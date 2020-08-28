const express = require("express");
const router = express.Router();

// A middleware function with no mount path. This code is executed for every request to the router
router.use(function(req, res, next) {
  console.log("Time:", Date.now());
  next();
});

module.exports = (db) => {
  router.post("/", (req, res) => {
    req.session = null;
    res.redirect("/home");
  });

  return router;
};
