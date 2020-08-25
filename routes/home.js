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


  router.post("/", (req, res) => {


  })






  return router;
};
