const express = require("express");
const router = express.Router();

/*
Twilio credentials that are stored in the
env and used below so that sms api connection
is established to send messages to clients
*/
const client = require("twilio")(
  `${process.env.TWILIO_ACCOUNT_SID}`,
  `${process.env.TWILIO_AUTH_TOKEN}`
);

// A middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  next();
});

module.exports = (db) => {
  /*
    Email is passed to this function as parameter,
    and it returns the object order. This object
    order is used with sms confirmation for the
    owner
  */
  const orderInProgress = (email) => {
    const text = `
      SELECT orders.id as order_id, orders.user_id, orders.time_ordered
      FROM orders
      JOIN users ON (orders.user_id = users.id)
      JOIN order_items ON (order_items.order_id = orders.id)
      WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE AND users.email = $1
      GROUP BY orders.id
      ORDER BY orders.id DESC;;`;
    const values = [`${email}`];
    return db.query(text, values).then((result) => {
      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        return false;
      }
    });
  };

  /*
    Returns the sum of all orders in progress for the
    preparation time as object. This function will be used
    with sms confirmation for the user
  */
  const totPrepTime = (email) => {
    const text = `
    SELECT SUM(t.sub_prep_time)
    FROM (SELECT orders.id as order_id, order_items.quantity, menu_items.name, menu_items.prep_time, menu_items.prep_time * order_items.quantity as sub_prep_time
          FROM orders
          JOIN users ON (orders.user_id = users.id)
          JOIN order_items ON (order_items.order_id = orders.id)
          JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
          WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
          GROUP BY orders.id, order_items.quantity, menu_items.name, menu_items.prep_time) as t;`;
    return db.query(text).then((result) => {
      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        return false;
      }
    });
  };

  const items = () => {
    const text = `
      SELECT name, price, picture_url, description, category, prep_time
      FROM menu_items
      `;
    return db.query(text).then((result) => {
      if (result.rows !== undefined) {
        if (result.rows) {
          return result.rows;
        }
      } else {
        return false;
      }
    });
  };

  router.get("/", (req, res) => {
    items().then((items) => {
      if (!items) {
        res.status(403);
        let templateVars = { errMessage: "Sorry, the no items" };
        res.render("errors_msg", templateVars);
      } else {
        for (let item in items) {
        }
        db.query("SELECT id, name FROM users WHERE id = $1", [
          req.session.name,
        ]).then((user) => {
          totPrepTime().then((totalPrepTime) => {
            if (totalPrepTime) {
              let templateVars = {
                items: items,
                user: user.rows[0],
                prepTimeOrdersInProgress: totalPrepTime.sum,
              };
              res.render("index", templateVars);
            }
          });
        });
      }
    });
  });

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const mycart = JSON.parse(req.body.cart);
    let myCheckoutArray = [];
    let myCheckoutObject = {};
    let itemId = [];

    //query to get the price and item id by menu item name
    const text1 = `
    SELECT menu_items.id, menu_items.name, menu_items.price
    FROM menu_items
    JOIN order_items ON (order_items.menu_item_id = menu_items.id)
    JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
    WHERE menu_items.name = ANY($1)
	  GROUP BY menu_items.id`;
    const values1 = mycart.map((item) => item.item_name);
    db.query(text1, [values1]).then((result) => {
      //query to get the price modifier by size
      const text2 = `
          SELECT coffe_sizes.id, coffe_sizes.size, coffe_sizes.price_modifier
          FROM coffe_sizes
          WHERE coffe_sizes.size = ANY($1)
	        GROUP BY coffe_sizes.id`;
      const values2 = mycart.map((item) => item.options.size);

      db.query(text2, [values2]).then((result2) => {
        for (let i = 0; i < mycart.length; i++) {
          let tempPrice = 0;

          myCheckoutObject.id = mycart[i].id;

          myCheckoutObject.qty = parseInt(mycart[i].qty);

          for (let j = 0; j < result.rows.length; j++) {
            if (mycart[i].item_name === result.rows[j].name) {
              myCheckoutObject.item_id = result.rows[j].id;
              myCheckoutObject.name = result.rows[j].name;
              tempPrice = result.rows[j].price;
              break;
            }
          }
          myCheckoutObject.price = Math.trunc(
            tempPrice * parseInt(mycart[i].qty)
          );
          myCheckoutObject.item_size_id = 1;

          if (mycart[i].options.size === "medium") {
            myCheckoutObject.price = Math.trunc(myCheckoutObject.price * 1.3);
            myCheckoutObject.item_size_id = 2;
          }
          if (mycart[i].options.size === "large") {
            myCheckoutObject.price = Math.trunc(myCheckoutObject.price * 1.6);
            myCheckoutObject.item_size_id = 3;
          }
          myCheckoutArray.push(myCheckoutObject);
          myCheckoutObject = {};
        }

        if (req.session.name === undefined) {
          return;
        }

        //add order to orders table
        const text3 =
          "INSERT INTO orders (user_id, in_progress, time_ordered,pickup_ready) VALUES($1, $2, NOW()::timestamp, $3) RETURNING *";
        const values3 = [parseInt(req.session.name), true, false];
        db.query(text3, values3).then((dbRes) => {
          let order_id = dbRes.rows[0].id;

          //add to order_items with FOR loop
          for (let i = 0; i < myCheckoutArray.length; i++) {
            const text4 =
              "INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES($1, $2, $3, $4, $5) RETURNING *";
            const values4 = [
              order_id,
              myCheckoutArray[i].item_id,
              myCheckoutArray[i].qty,
              myCheckoutArray[i].price,
              myCheckoutArray[i].item_size_id,
            ];
            db.query(text4, values4).then((dbRes1) => {});
          }
          //query to get user phone number to send SMS
          const text5 = `
              SELECT users.phone
              FROM users
              WHERE users.id = $1
              `;
          db.query(text5, [req.session.name]).then((result6) => {
            const user_phone = result6.rows[0].phone;

            totPrepTime()
              .then((totalPrepTime) => {
                if (totalPrepTime) {
                  let sms = `Your order has been recived. Expected pickup time in ${totalPrepTime.sum} minutes.`;
                  client.messages
                    .create({
                      body: sms,
                      from: process.env.TWILIO_PHONE,
                      to: process.env.PHONE,
                    })
                    .then((message) =>
                      console.log("SMS to client", message.sid)
                    );
                }
              })
              .then(() => {
                //query to get user email by cookie
                const text6 = `
              SELECT users.phone, users.email
              FROM users
              WHERE users.id = $1
              `;
                db.query(text6, [req.session.name]).then((result) => {
                  const user = result.rows[0];
                  orderInProgress(user.email).then((order) => {
                    if (order) {
                      let sms = `New order recived. Order_id: ${order.order_id}, user_id: ${order.user_id} `;
                      client.messages
                        .create({
                          body: sms,
                          from: process.env.TWILIO_PHONE,
                          to: process.env.PHONE,
                        })
                        .then((message) => console.log(message.sid));
                    }
                  });
                });
              });
          });
        });
      });
    });
    res.redirect("/success");
  });
  return router;
};
