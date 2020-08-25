/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
//const bcrypt = require('bcrypt');


// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  });


  const emailExist = function(email) {
    return db.query(`
    SELECT *
    FROM users
    WHERE email = $1;
    `, [email])
    .then(res => res.rows[0])
  };

  router.post("/", (req, res) => {
    const email = req.body.email;
    return emailExist(email)
      .then(user => {
        if (user) {
       //   console.log(req.body.password, user.password)
          if (req.body.password === user.password) {
            req.session.email = user.email;
            res.redirect('/home');
          } else {
            console.log(req.body.password, user.password);
            let templateVars = {errMessage: "Incorrect Password!"};
            res.render("errors_msg", templateVars);
            // res.send({error: "incorrect password"})
        }
      } else {
        let templateVars = {errMessage: "Email does not exist!"};
            res.render("errors_msg", templateVars);
      }
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
  })

  return router;
};


// if (!bcrypt.compareSync(req.body.password, user.password)) {
//   console.log(req.body.password, user.password);
//   res.send({error: "incorrect password"})
// } else {
// req.session.email = user.email;
// res.redirect('/');
