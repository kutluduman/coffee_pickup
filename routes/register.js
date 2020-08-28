const express = require("express");
const router = express.Router();

/*
Twilio credentials that are stored in the
env and used below so that sms api connection
is established to send messages to clients
*/
const client = require("twilio")(
  `${process.env.TWILIO_ACCOUNT_SID}`,
  `${process.env.TWILIO_AUTH_TOKEN}`
);

// A middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  next();
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });

  /*
    This function runs a query to check whether the
    parameter values exist in the users table
  */
  const userExists = (email, phone) => {
    const text = `
        SELECT id, name, email, password, phone, is_admin
        FROM users
        WHERE email = $1 AND phone = $2;`;
    const values = [email, phone];
    return db.query(text, values).then((result) => {
      if (result.rows[0] !== undefined) {
        if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
        }
      } else {
        return false;
      }
    });
  };

  /*
    This post route checks first with userExists function
    whether the user exists in the database and then posts
    the information from the body into the database to register
    the user
  */
  router.post("/", (req, res) => {
    userExists(req.body.email, req.body.phone).then((user) => {
      if (user) {
        res.status(403);
        let templateVars = {
          errMessage:
            "Sorry, the user is already registered! Use different email or phone",
        };
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
              req.session.name = dbRes.rows[0].id;
              res.redirect("/home");
            } else {
              res.status(500);
              let templateVars = {
                errMessage: "Sorry, registration failed! Try it again.",
              };
              res.render("errors_msg", templateVars);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });

  return router;
};
