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


  //*********************************************/
  //given the user email return the object order
  //to be use with sms confirmation for th owner
  const orderInProgress = (email) => {
    console.log("email:", email)
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
        console.log("Result from query find user by email", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
       //}
      } else {
        console.log("orderInProgress returning false")
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
            console.log("Orders:", order)

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
    return router;
  }


    //*********************************************/
  //return the total eobject order
  //to be use with sms confirmation for th owner
  const orderInProgress = (email) => {
    console.log("email:", email)
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
        console.log("Result from query find user by email", result.rows[0]);
        //if (result.rows[0].email === email || result.rows[0].phone === phone) {
          return result.rows[0];
       //}
      } else {
        console.log("orderInProgress returning false")
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
            console.log("Orders:", order)

            //sms notification to the client
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
    return router;
  }

//working one for send SMS to onwer
  //  let sms = 'New order recived. User email' + req.body.email
  //  client.messages.create({
  //    body: sms,
  //    from: process.env.TWILIO_PHONE,
  //    to: process.env.PHONE
  //  })
  //  .then(message => console.log(message.sid));

///////////////////////////////

  //sms notification to the owner
  // client.messages
  // .create({
  //    body: 'New order recived. Order id ....',
  //    from: process.env.TWILIO_PHONE,
  //    to: process.env.PHONE
  //  })
  // .then(message => console.log(message.sid));

  //  //sms notification to the client for order received
  //  client.messages
  //  .create({
  //    body: 'Your order has been recived. It will be ready in....',
  //    from: process.env.TWILIO_PHONE,
  //    to: process.env.PHONE
  //   })
  //  .then(message => console.log(message.sid));

  //  //sms notification to the client for order ready for pick up
  //  client.messages
  //  .create({
  //    body: 'Your order has been recived. It will be ready in....',
  //      from: process.env.TWILIO_PHONE,
  //      to: process.env.PHONE
  //   })
  //  .then(message => console.log(message.sid));
