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
  const error = new Error();
  error.message = " Page Not Found";
  error.status = 400;
  console.log(`Error Occured, Error ${error.status}: ${error.message}`);
  res.render("books/pageNotFound", { error: error });

  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
