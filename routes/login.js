/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
  });

  router.post("/", (req, res) => {
    res.json(req.body);
    // const text =
    //   "INSERT INTO users (name, email, password, phone, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *";
    // const values = [req.body.name, req.body.email, req.body.password, req.body.phone, false];
    // db.query(text, values)
    //   .then((res) => {
    //     console.log(res.rows[0]);
    //     res.redirect('/menu');

    //     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    //   })
    //   .catch((e) => console.error(e.stack));

  });

  return router;
};
