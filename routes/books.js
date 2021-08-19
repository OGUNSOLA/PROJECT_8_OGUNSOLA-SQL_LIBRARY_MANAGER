/** @format */

const express = require("express");
const router = express.Router();

/* GET home page. */
const Book = require("../models").Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      res.status(500).send(error);
    }
  };
}

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({
      attributes: ["id", "title", "author", "genre", "year"],
      order: [["title", "ASC"]],
    });
    res.render("index", { books, title: "Books" });
  })
);

// create new book

router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("books/new");
  })
);

module.exports = router;
