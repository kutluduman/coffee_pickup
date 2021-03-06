// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

/*
 Load the logger first so all (static) HTTP requests are logged to STDOUT
 'dev' = Concise output colored by response status for development use.
         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
*/
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  })
);

/*
 Separated Routes for each Resource
 Note: Feel free to replace the example routes below with your own
 */
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const homeRoute = require("./routes/home");
const logoutRoute = require("./routes/logout");
const adminRoute = require("./routes/adminDash");
const adminUpdateRoute = require("./routes/adminUpdate");
const successRoute = require("./routes/success");
const readyRoute = require("./routes/ready");
const delayRoute = require("./routes/delay");
const cancelRoute = require("./routes/cancel");
const archiveRoute = require("./routes/archive");
const editRoute = require("./routes/editRoute");
const deleteItem = require("./routes/deleteItem");

/*
 Mount all resource routes
  Note: Feel free to replace the example routes below with your own
 */
app.use("/register", registerRoute(db));
app.use("/login", loginRoute(db));
app.use("/home", homeRoute(db));
app.use("/logout", logoutRoute(db));
app.use("/admin", adminRoute(db));
app.use("/update", adminUpdateRoute(db));
app.use("/success", successRoute(db));
app.use("/ready", readyRoute(db));
app.use("/delay", delayRoute(db));
app.use("/cancel", cancelRoute(db));
app.use("/archive", archiveRoute(db));
app.use("/editRoute", editRoute(db));
app.use("/deleteItem", deleteItem(db));

app.listen(PORT, () => {});
