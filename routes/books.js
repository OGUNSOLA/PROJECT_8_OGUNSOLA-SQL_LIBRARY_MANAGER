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
    res.render("books/new", { book: {}, title: "Create New Book" });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/" + book.id);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("books/new", { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  })
);

//get indiviadual book
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/show", { book, title: book.title });
    } else {
      res.sendStatus(404);
    }
  })
);

// get update form
router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/update", { book, title: "Update Book" });
    } else {
      res.sendStatus(404);
    }
  })
);

// Update a book
router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        // await book.update(req.body);
        // res.redirect("/books/" + book.id);
        console.log(book);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("books/edit", { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  })
);

//get book to delete

router.get(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/delete", { book, title: "delete book" });
    } else {
      res.sendStatus(404);
    }
  })
);

//Delete a Book
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      console.log(book);
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(400);
    }
  })
);

module.exports = router;
