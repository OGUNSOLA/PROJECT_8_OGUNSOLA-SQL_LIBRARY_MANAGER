/** @format */

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

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
    const limit = 5;
    const { count, rows } = await Book.findAndCountAll({
      where: {
        [Op.or]: {
          title: {
            [Op.like]: `%%`,
          },
          author: {
            [Op.like]: `%%`,
          },
          genre: {
            [Op.like]: `%%`,
          },
          year: {
            [Op.like]: `%%`,
          },
        },
      },
      order: [["title"]],
      limit: limit,
      offset: 0,
    });
    const numberOfPages = Math.ceil(count / limit);
    const search = "";
    let page;
    res.render("index", {
      books: rows,
      title: "Books",
      numberOfPages: numberOfPages,
      page: 1,
      search,
    });
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

// // Search for a book route
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const limit = 5;
    const search = req.body.search || req.query.search || "";
    let page = parseInt(req.query.page);
    if (!page) {
      page = 1;
    }
    console.log("page: ", page);
    const { count, rows } = await Book.findAndCountAll({
      where: {
        [Op.or]: {
          title: {
            [Op.like]: `%${search}%`,
          },
          author: {
            [Op.like]: `%${search}%`,
          },
          genre: {
            [Op.like]: `%${search}%`,
          },
          year: {
            [Op.like]: `%${search}%`,
          },
        },
      },
      order: [["title"]],
      limit: limit,
      offset: (page - 1) * limit,
    });
    console.log("count:", count);
    const numberOfPages = Math.ceil(count / limit);
    res.render("index", {
      books: rows,
      title: "Books",
      numberOfPages: numberOfPages,
      page,
      search,
    });

    console.log("search:", req.query.search);
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
      res.render("books/update", {
        book,
        title: "Update Book",
        buttonTitle: "UPDATE",
      });
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
        await book.update(req.body);
        res.redirect("/books/" + book.id);
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
      res.render("books/delete", { book });
    }
  })
);

//Delete a Book
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    console.log("book: ", book.title);
    if (book) {
      console.log("book: ", book);
      await book.destroy();
      res.redirect("/");
    } else {
      res.sendStatus(400);
    }
  })
);

module.exports = router;
