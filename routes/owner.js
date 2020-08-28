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
router.use(function(req, res, next) {
  next();
});

module.exports = (db) => {
  /*
    This function takes user email as parameter and
    returns the object order so that it can be used
    with the sms confirmation for the owner
  */
  const orderInProgress = (email) => {
    const text = `
      SELECT orders.id as order_id, orders.user_id, orders.time_ordered
      FROM orders
      JOIN users ON (orders.user_id = users.id)
      JOIN order_items ON (order_items.order_id = orders.id)
      WHERE orders.in_progress = FALSE AND orders.pickup_ready = FALSE AND users.email = $1
      GROUP BY orders.id;`;
    const values = [email];
    return db.query(text, values).then((result) => {
      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        return false;
      }
    });
  };

  router.post("/", (req, res) => {
    /*
      After the checkout for order is completed
      successfuly, message is received about new order
      by the owner with the order and user id.
    */
    orderInProgress(req.body.email).then((order) => {
      if (order) {
        let sms = `New order recived. Order_id: ${order.order_id}, user_id: ${order.user_id} `;
        client.messages
          .create({
            body: sms,
            from: process.env.TWILIO_PHONE,
            to: process.env.PHONE,
          })
          .then((message) => console.log(message.sid));
      }
    });
  });

  /*
    Returns the sum of all orders in progress and preparation time
    as object. This is used for the sms confirmation for the user
  */
  const totPrepTime = (email) => {
    const text = `
    SELECT SUM(t.sub_prep_time)
    FROM (SELECT orders.id as order_id, order_items.quantity, menu_items.name, menu_items.prep_time, menu_items.prep_time * order_items.quantity as sub_prep_time
          FROM orders
          JOIN users ON (orders.user_id = users.id)
          JOIN order_items ON (order_items.order_id = orders.id)
          JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
          WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
          GROUP BY orders.id, order_items.quantity, menu_items.name, menu_items.prep_time) as t;`;
    return db.query(text).then((result) => {
      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        return false;
      }
    });
  };

  router.post("/", (req, res) => {
    /*
      After the checkout for order is completed
      successfuly, message is received about new order
      by the owner with the prep time to complete the
      order
    */
    totPrepTime().then((totalPrepTime) => {
      if (totalPrepTime) {
        let sms = `Your order has been recived. Expected pickup time in ${totalPrepTime.sum} minutes.`;
        client.messages
          .create({
            body: sms,
            from: process.env.TWILIO_PHONE,
            to: process.env.PHONE,
          })
          .then((message) => console.log(message.sid));
      }
    });
  });

  /*
    Returns the phone number of the order id that is
    passed as parameter so that it can be used with
    sms functionality for the client to get notification
    when order will be ready for pickup
  */
  const readyForPickup = (orders_id) => {
    const text = `
    SELECT orders.id as order_id, users.phone
    FROM orders
    JOIN users ON (orders.user_id = users.id)
    WHERE orders.in_progress = TRUE AND orders.pickup_ready = TRUE AND orders.id = $1
    GROUP BY orders.id, users.phone;`;
    const values = [orders_id];
    return db.query(text, values).then((result) => {
      if (result.rows[0] !== undefined) {
        return result.rows[0];
      } else {
        return false;
      }
    });
  };

  router.post("/", (req, res) => {
    /*
      This function will be used with totPrepTime
      function and will be copied after the checkout
      is completed successfully and after the message
      notification to Owner

      ATTENTION : the argument here is hardcoded at 8 as order_id
                  when implemented, should be changed
    */
    readyForPickup(8).then((ready) => {
      if (ready) {
        let sms = `Your order is ready for pickup.`;
        client.messages
          .create({
            body: sms,
            from: process.env.TWILIO_PHONE,
            to: process.env.PHONE,
          })
          .then((message) => console.log(message.sid));
      }
    });
  });

  return router;
};
