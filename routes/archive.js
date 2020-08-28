/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {

    //orders.id = 6 ?????
    //how get order_id from HTML?

    const text = `
    UPDATE orders
    SET in_progress = FALSE,
        pickup_ready = TRUE
    WHERE orders.id = 3
    RETURNING *;
      `;

    db.query(text)
      .then(data => {
        const users = data.rows;
        //res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
      res.redirect('/admin');
  });
  return router;
};

