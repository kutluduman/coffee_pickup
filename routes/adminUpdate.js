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
        //console.log("Result from query items", result.rows);
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
      res.render("admin_update", templateVars);
    });
  });


  router.post("/", (req, res) => {
    let newItem = req.body;
    //console.log("newItem: ", newItem)

    //parse checkbox status for SQL
    let in_stock;
    if (newItem.item_in_stock === 'on') {
      in_stock = true;
    } else {
      in_stock = false;
    }

    const text =
    "INSERT INTO menu_items (name, price, picture_url, prep_time, description, in_stock, category) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [newItem.item_name, parseInt(newItem.item_price), newItem.item_image_url, parseInt(newItem.item_prep_time), newItem.item_description, in_stock, newItem.item_category];
    //  console.log("Just before query insert")
    db.query(text, values).then((dbRes) => {
      //console.log("New item inserted: ", dbRes)
    })

    res.render("admin_update")
  });

  return router;
};
