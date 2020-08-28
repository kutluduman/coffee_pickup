const express = require("express");
const router = express.Router();

module.exports = (db) => {
  /*
    This post route helps the owner to
    distinguish whether the order is ready
    for the pickup
  */
  router.post("/", (req, res) => {
    let order_id = parseInt(req.body.user_id);
    const text = `
    UPDATE orders
    SET in_progress = FALSE,
        pickup_ready = TRUE
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
