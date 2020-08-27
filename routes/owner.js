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
  //console.log("Time:", Date.now());
  next();
});

module.exports = (db) => {


  //*********************************************/
  //given the user email return the object order
  //to be use with sms confirmation for th owner
  const orderInProgress = (email) => {
    //console.log("email:", email)
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
        //console.log("Result from query orderInProgress", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
       //}
      } else {
        //console.log("orderInProgress returning false")
        return false;

      }
    });
  };

  router.post("/", (req, res) => {
    /////////////////////////////////////////////////
    //to be copied after checkout  complete sucessfully
    //to be use with order in progress function
    orderInProgress(req.body.email)
        .then((order) => {
          if (order) {
            //console.log("Orders:", order)

            //sms notification to the owner
            let sms = `New order recived. Order_id: ${order.order_id}, user_id: ${order.user_id} `
            client.messages.create({
              body: sms,
              from: process.env.TWILIO_PHONE,
              to: process.env.PHONE
            })
            .then(message => console.log(message.sid));
          }
        })
    /////////////////////////////////////////////////
  })


  //*********************************************/
  //return the sum of all order in progress of the preparation_time as object
  //to be use with sms confirmation for the user
  const totPrepTime = (email) => {
    //console.log("email:", email)
    const text = `
    SELECT SUM(t.sub_prep_time)
    FROM (SELECT orders.id as order_id, order_items.quantity, menu_items.name, menu_items.prep_time, menu_items.prep_time * order_items.quantity as sub_prep_time
          FROM orders
          JOIN users ON (orders.user_id = users.id)
          JOIN order_items ON (order_items.order_id = orders.id)
          JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
          WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
          GROUP BY orders.id, order_items.quantity, menu_items.name, menu_items.prep_time) as t;`;
    //const values = [email];
    return db.query(text).then((result) => {
      if (result.rows[0] !== undefined) {
        //console.log("Result from query totPrepTimee", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
       //}
      } else {
        //console.log("totPrepTime return FALSE")
        return false;

      }
    });
  };

  router.post("/", (req, res) => {
    /////////////////////////////////////////////////
    //to be copied after checkout  complete sucessfully and after message notification to the owner
    //to be use with totPrepTime function
    totPrepTime()
        .then((totalPrepTime) => {
          if (totalPrepTime) {
            //console.log("tot prep time:", totalPrepTime)
            //sms notification to the client
            let sms = `Your order has been recived. Expected pickup time in ${totalPrepTime.sum} minutes.`
            client.messages.create({
              body: sms,
              from: process.env.TWILIO_PHONE,
              to: process.env.PHONE
            })
            .then(message => console.log(message.sid));
          }
        })
    /////////////////////////////////////////////////
  })

    //*********************************************/
  //return the phone number of the order id passed in as input
  //to be use with sms for the client order ready for pickup
  const readyForPickup = (orders_id) => {
    ////console.log("email:", email)
    const text = `
    SELECT orders.id as order_id, users.phone
    FROM orders
    JOIN users ON (orders.user_id = users.id)
    WHERE orders.in_progress = TRUE AND orders.pickup_ready = TRUE AND orders.id = $1
    GROUP BY orders.id, users.phone;`;
    const values = [orders_id];
    return db.query(text, values).then((result) => {
      if (result.rows[0] !== undefined) {
        //console.log("Result from query readyForPickup", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
       //}
      } else {
        //console.log("readyForPickup return FALSE")
        return false;

      }
    });
  };

  router.post("/", (req, res) => {
    /////////////////////////////////////////////////
    //to be copied after checkout  complete sucessfully and after message notification to the owner
    //to be use with totPrepTime function
    //ATTENTION the argument here is hardcoded at 8 as order_id
    //when we implement need to be changed
    readyForPickup(8)
    .then((ready) => {
      if (ready) {
        //console.log("ready:", ready)
        //sms notification to the client
        let sms = `Your order is ready for pickup.`
        client.messages.create({
          body: sms,
          from: process.env.TWILIO_PHONE,
          to: process.env.PHONE
        })
        .then(message => console.log(message.sid));
      }
    })
    /////////////////////////////////////////////////
  })





    return router;
  }

//working one for send SMS to onwer
  //  let sms = 'New order recived. User email' + req.body.email
  //  client.messages.create({
  //    body: sms,
  //    from: process.env.TWILIO_PHONE,
  //    to: process.env.PHONE
  //  })
  //  .then(message => //console.log(message.sid));

///////////////////////////////

  //sms notification to the owner
  // client.messages
  // .create({
  //    body: 'New order recived. Order id ....',
  //    from: process.env.TWILIO_PHONE,
  //    to: process.env.PHONE
  //  })
  // .then(message => //console.log(message.sid));

  //  //sms notification to the client for order received
  //  client.messages
  //  .create({
  //    body: 'Your order has been recived. It will be ready in....',
  //    from: process.env.TWILIO_PHONE,
  //    to: process.env.PHONE
  //   })
  //  .then(message => //console.log(message.sid));

  //  //sms notification to the client for order ready for pick up
  //  client.messages
  //  .create({
  //    body: 'Your order has been recived. It will be ready in....',
  //      from: process.env.TWILIO_PHONE,
  //      to: process.env.PHONE
  //   })
  //  .then(message => //console.log(message.sid));
