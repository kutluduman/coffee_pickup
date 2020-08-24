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


  // This route gets and renders the login page
  router.get("/login",(req,res) => {
    res.render("login");
  })


  // This route gets and renders the login page
  // router.get("/register", (req,res) => {
  //   res.render("register");
  // })



  router.get("/menu", (req,res) => {
    res.render("menu");
  })

  router.get("/contact", (req,res) => {
    res.render("contact");
  })

  return router;
};
