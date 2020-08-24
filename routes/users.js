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

  // Get the info from the register form
  router.post('/register', (req, res) => {
    // extract the info from the form
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // check if the user is not already in the database

    const user = findUserByEmail(email);

    // if not in the db, it'ok to add the user to the db

    if (!user) {
      const userId = addNewUser(name, email, password);
      // setCookie with the user id
      req.session['user_id'] = userId;

      // redirect to /quotes
      res.redirect('/quotes');
    } else {
      res.status(403).send('Sorry, the user is already registered');
    }
  })






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
