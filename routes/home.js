/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

module.exports = (db) => {

  // Make function userExists(arg1, arg2)
  // runs a query checking for those values if they exist in users table
  const items = () => {
    const text = `
      SELECT name, price, picture_url, description, category
      FROM menu_items
      `;
    //const values = [email, phone];
    return db.query(text).then((result) => {
      if (result.rows !== undefined) {
        console.log("Result from query items", result.rows);
        if (result.rows) {
          return result.rows;
        }
      } else {
        return false;
      }
    });
  };


  router.get("/", (req,res) => {


    items().then ((items) =>    {

    if (!items) {
      //User already present
      res
        .status(403)
        let templateVars = {errMessage: "Sorry, the no items"};
        res.render("errors_msg", templateVars);
    } else {
      console.log('return from user function',items )
      for(let item in items) {
        console.log(items[item])
      }
      let templateVars = {items: items};
      res.render('index',templateVars);
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

  let fromcartExample = [{item_name:"Lighthouse Americano",qty:2,price:3.55, category: '', options:{ size:"medium"}},
                        {item_name:"Lighthouse Americano",qty:2,price:3.55, category: '', options:{ size:"medium"}}]

  router.post("/", (req, res) => {
    console.log('---------------------------------')
    console.log("body", JSON.parse(req.body.cart))
    const mycart = JSON.parse(req.body.cart)
    console.log("MyCart", mycart )
    //try to combine all info in an object
    let item = [{}]
    let itemName = [];
    let itemId = [];
    // console.log("body index 0", JSON.parse(req.body.cart[0]))
    console.log("body [0]", mycart[0])
    // console.log("type of", typeof req.body.cart[0].qty)
    // console.log("quantity", JSON.parse(req.body.cart[0].qty))
    for (let i=0; i < mycart.length; i++) {
      console.log("Loop", mycart[i])
      itemName.push(mycart[i].item_name)
    }

    console.log("item name", itemName);
    //Question for mentor:
    //1)how to send more then one value to array values
    //2)how link option side
    for (let name of itemName) {
    const text1 = `
        SELECT id
        FROM menu_items
        WHERE name = $1;`;
    const values1 = [name];
      return db.query(text1, values1).then((result) => {
        console.log("Result from query find item_id by item name", result.rows[0].id);
        itemId.push(result.rows[0].id)
      // if (result.rows[0] !== undefined) {

      //   // if (result.rows[0].email === email || result.rows[0].phone === phone) {
      //   //   return result.rows[0];
      //   }
      // } else {
      //   return false;
      // }
      });
    }


    const text =
          "INSERT INTO order_items (menu_item_id, quantity, price, size_id) VALUES($1, $2, $3, $4) RETURNING *";
        const values = [ 1, parseInt(mycart[0].qty), parseInt(mycart[0].price * 100), 2
          // req.body.quantity,
          // req.body.email,
          // req.body.password,
          // req.body.phone,
          // false,
        ];
        console.log("Just before query insert")
        db.query(text, values)
        .then((dbRes) => {
          console.log("dbRes", dbRes)
          res.redirect("/home");
          if (dbRes !== undefined) {
            //console.log("Return object from insert query", dbRes.rows[0].id);
            //set cookie
            //req.session.name = dbRes.rows[0].id;
            // console.log()

          } else {
            res.
            status(500)
            let templateVars = {errMessage: "Sorry, registration failed! Try it again."};
            res.render("errors_msg", templateVars);
          }
        })
        .catch((err) => {
          console.log("Something Broke !", err);
        });
  })


  return router;
};
