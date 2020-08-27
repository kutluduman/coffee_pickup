/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
//require twilio credentials
const client = require('twilio')(`${process.env.TWILIO_ACCOUNT_SID}`, `${process.env.TWILIO_AUTH_TOKEN}`);



// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
//  console.log('Time:', Date.now())
  next()
})

module.exports = (db) => {



  //*********************************************/
  //given the user email return the object order
  //to be use with sms confirmation for th owner
  const orderInProgress = (email) => {
    //console.log("email:", email)
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
      console.log("function order in progress: result", result)
      if (result.rows[0] !== undefined) {
       // console.log("Result from query orderInProgress", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
        return result.rows[0];
        //}
      } else {
       // console.log("orderInProgress returning false")
        return false;

      }
    });
  };

  //*********************************************/
  //return the sum of all order in progress of the preparation_time as object
  //to be use with sms confirmation for the user
  const totPrepTime = (email) => {
   // console.log("email:", email)
    const text = `
    SELECT SUM(t.sub_prep_time)
    FROM (SELECT orders.id as order_id, order_items.quantity, menu_items.name, menu_items.prep_time, menu_items.prep_time * order_items.quantity as sub_prep_time
          FROM orders
          JOIN users ON (orders.user_id = users.id)
          JOIN order_items ON (order_items.order_id = orders.id)
          JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
          WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
          GROUP BY orders.id, order_items.quantity, menu_items.name, menu_items.prep_time) as t;`;
    //const values = [email];
    return db.query(text).then((result) => {
      if (result.rows[0] !== undefined) {
      //  console.log("Result from query totPrepTimee", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
        return result.rows[0];
        //}
      } else {
      //  console.log("totPrepTime return FALSE")
        return false;

      }
    });
  };


  // Make function userExists(arg1, arg2)
  // runs a query checking for those values if they exist in users table
  const items = () => {
    const text = `
      SELECT name, price, picture_url, description, category, prep_time
      FROM menu_items
      `;
    //const values = [email, phone];
    return db.query(text).then((result) => {
      if (result.rows !== undefined) {
       // console.log("Result from query items", result.rows);
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
        //User already present
        res
          .status(403)
        let templateVars = { errMessage: "Sorry, the no items" };
        res.render("errors_msg", templateVars);
      } else {
       // console.log('return from user function', items)
        for (let item in items) {
       //   console.log(items[item])
        }

        console.log('HERE IS THE SESSION ID', req.session.name)
        db.query('SELECT id, name FROM users WHERE id = $1', [req.session.name])
        .then(user =>{
          console.log('WE found this', user)
          totPrepTime()
          .then((totalPrepTime) => {
            if (totalPrepTime) {
              //console.log("Tot prep time to pass front end", totalPrepTime.sum)
              //prepTimeOrdersInProgress = totalPrepTime.sum;

              let templateVars = { items: items, user: user.rows[0], prepTimeOrdersInProgress: totalPrepTime.sum};//////////////////users[req.session.user_id] //////////////////////////////////////////render user here
              res.render('index', templateVars);
            }
          })
        })



      }

    })
  })



  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // let fromcartExample = [{ item_name: "Lighthouse Americano", qty: 2, price: 3.55, category: '', options: { size: "medium" } },
  // { item_name: "Lighthouse Americano", qty: 2, price: 3.55, category: '', options: { size: "medium" } }]

  router.post("/", (req, res) => {
    // console.log('---------------------------------')
    // console.log("body", JSON.parse(req.body.cart))
    const mycart = JSON.parse(req.body.cart)
    //  console.log("MyCart", mycart)
    //try to combine all info in an object
    let myCheckoutArray = []
    let myCheckoutObject = {};
    let itemId = [];
    // console.log("body index 0", JSON.parse(req.body.cart[0]))
    // console.log("body [0]", mycart[0])
    // console.log("type of", typeof req.body.cart[0].qty)
    // console.log("quantity", JSON.parse(req.body.cart[0].qty))
    // for (let i=0; i < mycart.length; i++) {
    //  console.log("Loop", mycart[i])
    //  itemName.push(mycart[i].item_name)


    //query to get the price and item id by menu item name
    const text1 = `
    SELECT menu_items.id, menu_items.name, menu_items.price
    FROM menu_items
    JOIN order_items ON (order_items.menu_item_id = menu_items.id)
    JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
    WHERE menu_items.name = ANY($1)
	  GROUP BY menu_items.id`;
    const values1 = mycart.map(item => item.item_name);
    // console.log("db.query1", db.query(text1, values1).toString())
    // console.log("Value1", values1)
    db.query(text1, [values1]).then((result) => {
      console.log("Result from query find item_id by item name", result.rows); //result.rows[0]
      //itemId.push(result.rows[0].id)


      //query to get the price modifier by size
      const text2 = `
          SELECT coffe_sizes.id, coffe_sizes.size, coffe_sizes.price_modifier
          FROM coffe_sizes
          WHERE coffe_sizes.size = ANY($1)
	        GROUP BY coffe_sizes.id`;
      const values2 = mycart.map(item => item.options.size);
      //  console.log("db.query2", db.query(text2, values2).toString())
      //  console.log("Value2", values2)
      db.query(text2, [values2]).then((result2) => {
        // console.log("Result from query find coffe_size_id by size name", result2.rows); //result.rows[0]

        //make calculation of price
        for (let i = 0; i < mycart.length; i++) {
          // if (!result.rows[i]) {
          //   break
          // }
          let tempPrice = 0;
          //give same id like in the cart
          myCheckoutObject.id = mycart[i].id
          //give same quantity like the cart
          myCheckoutObject.qty = parseInt(mycart[i].qty)

          //check name to calculate price
          //result.row = [ anonymous { id: 1, name: 'Americano', price: 176 }, anonymous { id: 2, name: 'Cappuccino', price: 355 }, anonymous { id: 3, name: 'Espresso', price: 288 } ]
          for (let j = 0; j < result.rows.length; j++) {
           // console.log(" mycart[i].item_name", mycart[i].item_name)
            //console.log(" result.rows[j].name", result.rows[i].name)
            //   console.log(" result.rows[j].price", result.rows[j].price)
            if (mycart[i].item_name === result.rows[j].name) {
              myCheckoutObject.item_id = result.rows[j].id
              myCheckoutObject.name = result.rows[j].name;
              tempPrice = result.rows[j].price;
              break

            }
          }

          myCheckoutObject.price = Math.trunc(tempPrice * parseInt(mycart[i].qty))

          //by default the size is small
          myCheckoutObject.item_size_id = 1;

          if (mycart[i].options.size === 'medium') {
            myCheckoutObject.price = Math.trunc(myCheckoutObject.price * 1.30)
            myCheckoutObject.item_size_id = 2;
          }
          if (mycart[i].options.size === 'large') {
            myCheckoutObject.price = Math.trunc(myCheckoutObject.price * 1.60)
            myCheckoutObject.item_size_id = 3;
          }
          // myCheckoutObject.price = Math.trunc(result.rows[i].price * result2.rows[i].price_modifier) * myCheckoutObject.qty
          // myCheckoutObject.price = Math.round(myCheckoutObject.price) / 100;
          myCheckoutArray.push(myCheckoutObject)
          myCheckoutObject = {}

        }

        //console.log("This is myCheckout object: ", myCheckoutObject);
      //  console.log("This is myCheckout array: ", myCheckoutArray);

        //user_id = req.session.name
        console.log('----------------------------------------------------------------------')
        console.log("req.session.name", req.session.name)
        console.log('----------------------------------------------------------------------')

        //if user not log in exit the function
        if (req.session.name === undefined) {
          console.log("User is not login. I exit the function")
          return
        }

        //add order to orders table
        const text3 =
          "INSERT INTO orders (user_id, in_progress, time_ordered,pickup_ready) VALUES($1, $2, NOW()::timestamp, $3) RETURNING *";
        const values3 = [parseInt(req.session.name), true, false];
        console.log("query insert order")
        db.query(text3, values3).then((dbRes) => {


          let order_id = dbRes.rows[0].id
          //add to order_items by FOR loop (advice by mentor)
        //  console.log(`length ${myCheckoutArray.length}`)
          for (let i = 0; i < myCheckoutArray.length; i++) {
            const text4 =
              "INSERT INTO order_items (order_id, menu_item_id, quantity, price, size_id) VALUES($1, $2, $3, $4, $5) RETURNING *";
            const values4 = [order_id, myCheckoutArray[i].item_id, myCheckoutArray[i].qty, myCheckoutArray[i].price, myCheckoutArray[i].item_size_id];
          //  console.log("Just before query insert")
            db.query(text4, values4).then((dbRes1) => {

            })
          }

          //query to get user phone to send SMS
          const text6 = `
              SELECT users.phone
              FROM users
              WHERE users.id = $1
              `;
              db.query(text6, [req.session.name]).then((result6) => {
              const user_phone = result6.rows[0].phone

          totPrepTime()
            .then((totalPrepTime) => {
              if (totalPrepTime) {
                //console.log("tot prep time:", totalPrepTime)

                //sms notification to the client
                let sms = `Your order has been recived. Expected pickup time in ${totalPrepTime.sum} minutes.`
                client.messages.create({
                  body: sms,
                  from: process.env.TWILIO_PHONE,
                  to: process.env.PHONE  //user_phone
                })
                .then(message => console.log("SMS to client", message.sid));
              }
            })
            .then (() => {

              //query to get user email by cookie
              const text5 = `
              SELECT users.phone, users.email
              FROM users
              WHERE users.id = $1
              `;
              db.query(text5, [req.session.name]).then((result) => {
              const user = result.rows[0]

              orderInProgress(user.email)
              .then((order) => {
                if (order) {
                  //console.log("Orders:", order)

                  //sms notification to the owner
                  let sms = `New order recived. Order_id: ${order.order_id}, user_id: ${order.user_id} `
                  client.messages.create({
                    body: sms,
                    from: process.env.TWILIO_PHONE,
                    to: process.env.PHONE //owner phone number
                  })
                    .then(message => console.log(message.sid));
                  //res(order);
                }
              })

                // //sms notification to the owner
                // let sms1 = `New order recived. Order_id: ${order.order_id}, user_id: ${order.user_id} `
                // client.messages.create({
                //   body: sms1,
                //   from: process.env.TWILIO_PHONE,
                //   to: process.env.PHONE
                // })
                // .then(message => console.log("SMS to owner", message.sid));

                //res(order);

              })
              //})
              // })

            })
          })  //added
        })


      })


    })


  });


  return router;
};
