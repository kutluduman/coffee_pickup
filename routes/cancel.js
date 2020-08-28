const express = require("express");
const router = express.Router();

module.exports = (db) => {
  /*
    This post route helps the owner to cancel
    the order from the admin side
  */
  router.post("/", (req, res) => {
    let order_id = parseInt(req.body.user_id);
    const text = `
    DELETE FROM orders
    WHERE orders.id = $1
    RETURNING *;
      `;
    const values = [order_id];
    db.query(text, values)
      .then((data) => {
        const users = data.rows;
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    res.redirect("/admin");
  });
  return router;
};
