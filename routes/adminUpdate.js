const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const items = () => {
    const text = `
      SELECT * FROM menu_items
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

  router.get("/", (req, res) => {
    items().then((items) => {

      if (req.session.name === 1) {
        db.query("SELECT id, name FROM users WHERE id = $1", [
          req.session.name,
        ]).then((user) => {
          let templateVars = { menuItems: items, user: user.rows[0] };

          res.render("admin_update", templateVars);

        });
      } else {
        res.send("Must be admin to view this page/");
      }
    });
  });

  router.post("/", (req, res) => {
    if (req.session.name === 1) {
      let newItem = req.body;
      let in_stock;
      if (newItem.item_in_stock === "on") {
        in_stock = true;
      } else {
        in_stock = false;
      }

      const text =
        "INSERT INTO menu_items (name, price, picture_url, prep_time, description, in_stock, category) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
      const values = [
        newItem.item_name,
        parseInt(newItem.item_price),
        newItem.item_image_url,
        parseInt(newItem.item_prep_time),
        newItem.item_description,
        in_stock,
        newItem.item_category,
      ];
      db.query(text, values).then((dbRes) => {});
      res.redirect("/update");
    } else {
      res.send("Must be admin");
    }
  });
  return router;
};
