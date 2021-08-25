/** @format */

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");

const app = express();

const models = require("./models");

(async () => {
  await models.sequelize.sync();
  try {
    models.sequelize.authenticate();
    console.log("Connection to the database successful");
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
})();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("The book you are looking for does not exist");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    err.message = err.message || "Something went wrong";
    res.status(err.status || 500).render("error", { err });
  }
});

module.exports = app;
