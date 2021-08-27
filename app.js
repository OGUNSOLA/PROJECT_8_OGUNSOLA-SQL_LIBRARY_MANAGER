/** @format */

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var booksRouter = require("./routes/books");
const models = require("./models");

var app = express();

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

(async () => {
  await models.sequelize.sync();
  try {
    models.sequelize.authenticate();
    console.log("Connection to the database successful");
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
})();

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.messge =
    " oh oh!. Looks like the book you are looking for doesnt exist yet! ";
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  if (error) {
    console.log("Global error handler called");
  }
  if (error.status === 404) {
    res.status(404).render("books/page-not-found", { error });
    console.log(error);
  } else {
    error.message = `Bummer!  It looks like something went wrong on the server.`;
    res.status(error.status || 500).render("error", { error });
    console.log(error);
  }
});

module.exports = app;
