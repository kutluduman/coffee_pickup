const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const items = () => {
    const text = `
      SELECT orders.id, users.name as name
      FROM orders
      JOIN users ON users.id = user_id
      WHERE pickup_ready = true
      `;

    return db.query(text).then((result) => {
      if (result.rows !== undefined) {
        console.log("Result from query items", result.rows);
        if (result.rows) {
          return result.rows;
        }
      } else {
        return false;
      }
    });
  };

  router.get("/", (req, res) => {
    items().then((items) => {
      let templateVars = { orders: items };
      res.render("admin_dash", templateVars);
    });
  });

  return router;
};
