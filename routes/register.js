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

  //TO DO:
    // Make function userExists(arg1, arg2)
    // runs a query checking for those values if they exist in users table

    const userExists =(email, phone) =>{
      const text =
        `SELECT id, name, email, password, phone, is_admin
        FROM users
        WHERE email = $1 AND phone = $2;`;
        const values = [email, phone];
        db.query(text, values)
          .then((result) => {
            console.log("Result from query find user by email", result.rows[0]);
            if ((result.email === email) & (result.phone === phone)) {
             return result.rows[0];
            }
          })

      // after the loop, return false
      return false;
    }

  router.post('/', (req, res)=>{
    let user = userExists(req.body.email, req.body.phone);
    console.log("user: ", user)
      if (user) {
      console.log("User already present", user)
      //return error message user exits use different email or phone
    } else {
      const text = "INSERT INTO users (name, email, password, phone, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *";
      const values = [req.body.name, req.body.email, req.body.password, req.body.phone, false];
      db.query(text, values)
        .then(dbRes => {
          res.redirect('/menu')
        })
        .catch(err => {
          console.log('Something Broke !', err);
        })
    }
  })


  // router.post("/", (req, res) => {
  //   const text =
  //     "INSERT INTO users (name, email, password, phone, is_admin) VALUES($1, $2, $3, $4, $5) RETURNING *";
  //   const values = [req.body.name, req.body.email, req.body.password, req.body.phone, false];
  //   db.query(text, values)
  //     .then((res) => {
  //       console.log(res.rows[0]);
  //       console.log("Email",res.rows[0].email);
  //       const text1 =
  //       `SELECT id, name, email, password, phone, is_admin
  //       FROM users
  //       WHERE phone = $1 AND email = $2;`;
  //       const values1 = [res.rows[0].phone, res.rows[0].email];
  //       db.query(text1, values1)
  //         .then((result) => {
  //           console.log("Result from query find user by email", ressult.rows[0]);
  //       //  const user = findUserByEmail(email);

  //       // if (!user) {
  //       //   const userId = addNewUser(name, email, password);
  //       //   // setCookie with the user id
  //       //   req.session['user_id'] = userId;

  //       //   // redirect to /quotes
  //       //   res.redirect('/quotes');
  //       // } else {
  //       //   res.status(403).send('Sorry, the user is already registered');
  //       // }
  //     })

  //       res.redirect('/menu');

  //       // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  //     })
  //     .catch((e) => console.error(e.stack));

  // });

  return router;
};
