const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const items = () => {
    const text = `
      SELECT orders.id, users.name as name
      FROM orders
      JOIN users ON users.id = user_id
      WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
      `;
    return db.query(text).then((result) => {
      if (result.rows !== undefined) {
        if (result.rows) {
          return result.rows;
        }
      } else {
        return false;
      }
    });
  };

  /*
    This route gives information about the
    orders that are currently processed after the
    order checkout.
  */
  router.get("/", (req, res) => {
    const text = `
    SELECT orders.id as orders_id ,order_items.id as order_items_id, order_items.menu_item_id as menu_item_id, order_items.quantity as order_items_qty, menu_items.name, order_items.price, coffe_sizes.size, order_items.size_id, users.name as user_name
    FROM order_items
    JOIN orders ON (orders.id = order_items.order_id)
    JOIN menu_items ON (order_items.menu_item_id = menu_items.id)
    JOIN coffe_sizes ON (order_items.size_id = coffe_sizes.id)
    JOIN users ON (orders.user_id = users.id)
    WHERE order_items.order_id IN (SELECT orders.id
    FROM orders
    JOIN users ON (orders.user_id = users.id)
    JOIN order_items ON (order_items.order_id = orders.id)
    JOIN coffe_sizes ON (coffe_sizes.id = order_items.size_id)
    JOIN menu_items ON (menu_items.id = order_items.menu_item_id)
    WHERE orders.in_progress = TRUE AND orders.pickup_ready = FALSE
    GROUP BY users.email, orders.id)
    GROUP BY orders.id, order_items.id, menu_items.name , coffe_sizes.size, users.name
    ORDER BY orders.id;
    `;
    db.query(text).then((result) => {
      const ordersInProgress = result.rows;
      items().then((items) => {
        if (req.session.name === 1) {
          db.query("SELECT id, name FROM users WHERE id = $1", [
            req.session.name,
          ]).then((user) => {
            let templateVars = {
              orders: items,
              orderItems: ordersInProgress,
              user: user.rows[0],
            };
            res.render("admin_dash", templateVars);
          });
        } else {
          res.send("must be admin");
        }
      });
    });
  });
  return router;
};
