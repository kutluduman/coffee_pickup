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
    if (req.session.name === 1) {

      let updateItem = req.body;
      console.log("updatetem: ", updateItem)

      //parse checkbox status for SQL
      let in_stock;
      if (updateItem.item_in_stock === "on") {
        in_stock = true;
      } else {
        in_stock = false;
      }

      const text =
        "UPDATE menu_items SET name = $1, price = $2, picture_url = $3, prep_time = $4, description = $5, in_stock = $6, category = $7 WHERE menu_items.id = $8 RETURNING *";
      const values = [
        updateItem.item_name,
        parseInt(updateItem.item_price),
        updateItem.item_image_url,
        parseInt(updateItem.item_prep_time),
        updateItem.item_description,
        in_stock,
        updateItem.item_category,
        parseInt(updateItem.item_id)
      ];
       console.log("Just before query insert", values)
      db.query(text, values).then((dbRes) => {
      console.log("item mofified inserted: ", dbRes)
      });

      res.redirect("/update");
    } else {
      res.send("Must be admin");
    }
  });
  return router;
};
