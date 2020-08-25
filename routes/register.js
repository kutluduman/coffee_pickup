/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

//require twilio credentials
const client = require('twilio')(`${process.env.TWILIO_ACCOUNT_SID}`, `${process.env.TWILIO_AUTH_TOKEN}`);

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });


  // Make function userExists(arg1, arg2)
  // runs a query checking for those values if they exist in users table
  const userExists = (email, phone) => {
    const text = `
        SELECT id, name, email, password, phone, is_admin
        FROM users
        WHERE email = $1 AND phone = $2;`;
    const values = [email, phone];
    return db.query(text, values).then((result) => {
      if (result.rows[0] !== undefined) {
        //console.log("Result from query find user by email", result.rows[0]);
        if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
        }
      } else {
        return false;
      }
    });
  };


  router.post("/", (req, res) => {
    userExists(req.body.email, req.body.phone).then((user) => {
      if (user) {
        //User already present
        res
          .status(403)
          let templateVars = {errMessage: "Sorry, the user is already registered! Use different email or phone"};
          res.render("errors_msg", templateVars);

      } else {
        const text =
          "INSERT INTO users (name, email, password, phone, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *";
        const values = [
          req.body.name,
          req.body.email,
          req.body.password,
          req.body.phone,
          false,
        ];
        db.query(text, values)
          .then((dbRes) => {
            if (dbRes.rows[0].id !== undefined) {
              //console.log("Return object from insert query", dbRes.rows[0].id);
              //set cookie
              req.session.name = dbRes.rows[0].id;
              res.redirect("/menu");
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
      }
    });
  });

  return router;
};
