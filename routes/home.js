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
      SELECT name, price, picture_url, description
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
});


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

  let fromcart = [{"item_name":"Lighthouse Americano","qty":2,"price":3,"options":{"size":"medium"}},
                  {"item_name":"Lighthouse Americano","qty":2,"price":3,"options":{"size":"medium"}},
                  {"item_name":"Lighthouse Americano","qty":2,"price":3,"options":{"size":"medium"}},
                  {"item_name":"Lighthouse Americano","qty":2,"price":3,"options":{"size":"medium"}}]

  router.post("/", (req, res) => {
    console.log("body", req.body)
    console.log('---------------------------------')
    console.log("body", JSON.parse(req.body.cart))

    const text =
          "INSERT INTO order_items (menu_item_id, quantity, price, size_id) VALUES($1, $2, $3, $4) RETURNING *";
        const values = [ 1, req.body.quantity, req.body.price, 2
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



  //expected = [{}, {}, {}]
  //what we are getting is  = {'{},{},{}': ''}


  //define object cart base on the application local storage
  // const cart = {
  //   menu_item_id: user,
  //   quantity: {
  //     text: req.body.text
  //   },
  //   created_at: Date.now()
  // };

  // Saves a tweet to `db`
  //by query

  // //when doc ready
  // $(document).ready(function() {
  //   $("#order_pickup").clic('keyup', (function() {
  //     alert("The order inserted");
  //   }))
  // });

  return router;
};


