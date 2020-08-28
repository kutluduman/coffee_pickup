/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
//require twilio credentials
const client = require("twilio")(
  `${process.env.TWILIO_ACCOUNT_SID}`,
  `${process.env.TWILIO_AUTH_TOKEN}`
);

module.exports = (db) => {
  router.post("/", (req, res) => {
    if (req.session.name === 1) {
      console.log("Id from HTML form:", req.body);
      //orders.id = 6 ?????
      //how get order_id from HTML?
      console.log("Id from HTML form:", req.body.user_id);
      let order_id = parseInt(req.body.user_id);
      //orders.id = 6 ?????
      //how get order_id from HTML?
      //parse as int

      const text = `
      UPDATE orders
      SET pickup_ready = TRUE
      WHERE orders.id = $1
      RETURNING *;
      `;
      const values = [order_id];
      db.query(text, values)
        .then((data) => {
          const users = data.rows;

          const text2 = `
          SELECT orders.id as order_id, users.phone
          FROM orders
          JOIN users ON (orders.user_id = users.id)
          WHERE orders.id = $1
          GROUP BY orders.id, users.phone;`;
          const values2 = [order_id];
          //  console.log("Just before query insert")
          db.query(text2, values2).then((data) => {
            const usersPhone = data.rows[0].phone;
            console.log("user phone numbers:", usersPhone);
            let sms = `Your order is ready for pickup.`;
            client.messages
              .create({
                body: sms,
                from: process.env.TWILIO_PHONE,
                to: process.env.PHONE, //client phone number use => usersPhone
              })
              .then((message) => console.log(message.sid));
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
      res.redirect("/admin");
    } else {
      res.send("Must be admin");
    }
  });

  return router;
};
