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
    This post route helps to identify whether
    the order is complete or not. When the order
    is complete, a text message is sent to the client
    that order is complete. In order to send the message
    to the client, process.env.PHONE should be changed to
    usersPhone
  */
  router.post("/", (req, res) => {
    if (req.session.name === 1) {
      let order_id = parseInt(req.body.user_id);
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
          db.query(text2, values2).then((data) => {
            const usersPhone = data.rows[0].phone;
            let sms = `Your order is ready for pickup.`;
            client.messages
              .create({
                body: sms,
                from: process.env.TWILIO_PHONE,
                to: process.env.PHONE,
              })
              .then((message) => console.log(message.sid));
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
      res.redirect("/admin");
    } else {
      res.send("Must be Admin");
    }
  });

  return router;
};
