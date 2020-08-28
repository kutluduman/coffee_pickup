const express = require("express");
const router = express.Router();

// A middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  next();
});

/*
  The response renders the success page
  which is later on used when the
  order is submitted
*/
module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("success");
  });
  return router;
};
