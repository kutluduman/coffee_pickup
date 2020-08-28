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

      let deleteItem = req.body;
      console.log("deleteItem: ", parseInt(deleteItem.itemId))

      const text =
        "DELETE FROM menu_items WHERE menu_items.id = $1 RETURNING *";
      const values = [ parseInt(deleteItem.itemId) ];
       //console.log("Just before query insert", values)
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
