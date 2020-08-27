const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const items = () => {
    const text = `
      SELECT * FROM menu_items
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
      let templateVars = { menuItems: items };
      res.render("admin_update", templateVars);
    });
  });


  router.post("/", (req, res) => {
    //const newItem = req.body
    console.log("newItem: ", req.body)
    res.render("admin_update")
  });

  return router;
};
