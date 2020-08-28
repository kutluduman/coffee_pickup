const express = require("express");
const router = express.Router();

// A middleware function with no mount path. This code is executed for every request to the router
router.use(function(req, res, next) {
  next();
});

module.exports = (db) => {
  /*
    This route clears the cookie session
    when the user logs out. Also the user
    is redirected to the home page
  */
  router.post("/", (req, res) => {
    req.session = null;
    res.redirect("/home");
  });

  return router;
};
