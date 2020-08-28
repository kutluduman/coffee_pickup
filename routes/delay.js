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

module.exports = (db) => {
  /*
    This post route helps the owner delay the
    order if it needs to be delayed. Also, if order
    is delayed, then owner sends message to the client
    that the order is delayed.
    usersPhone should be used to send message to the
    clients from the database
  */
  router.post("/", (req, res) => {
    let order_id = parseInt(req.body.user_id);
    const text = `
    SELECT orders.id as order_id, users.phone
    FROM orders
    JOIN users ON (orders.user_id = users.id)
    WHERE orders.id = $1
    GROUP BY orders.id, users.phone;`;
    const values = [order_id];
    db.query(text, values)
      .then((data) => {
        const usersPhone = data.rows[0].phone;
        let sms = `Your order has been delayed.`;
        client.messages
          .create({
            body: sms,
            from: process.env.TWILIO_PHONE,
            to: process.env.PHONE,
          })
          .then((message) => console.log(message.sid));
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    res.redirect("/admin");
  });
  return router;
};
