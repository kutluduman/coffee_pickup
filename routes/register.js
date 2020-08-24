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
    res.render("register");
  });


  router.post("/", (req, res) => {
    const text =
      "INSERT INTO users (name, email, password, phone, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [req.body.name, req.body.email, req.body.password, req.body.phone, false];
    db.query(text, values)
      .then((res) => {
        console.log(res.rows[0]);
        console.log("Email",res.rows[0].email);
        const text1 =
        `SELECT id, name, email, password, phone, is_admin
        FROM users
        WHERE phone = $1 AND email = $2;`;
        const values1 = [res.rows[0].phone, res.rows[0].email];
        db.query(text1, values1)
          .then((result) => {
            console.log("Result from query find user by email", ressult.rows[0]);
        //  const user = findUserByEmail(email);

        // if (!user) {
        //   const userId = addNewUser(name, email, password);
        //   // setCookie with the user id
        //   req.session['user_id'] = userId;

        //   // redirect to /quotes
        //   res.redirect('/quotes');
        // } else {
        //   res.status(403).send('Sorry, the user is already registered');
        // }
      })

        res.redirect('/menu');

        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      })
      .catch((e) => console.error(e.stack));

  });

  return router;
};
