/** @format */
var express = require("express");
var router = express.Router();
const Book = require("../models").Book;
const { Op } = require("sequelize");

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
    const limit = 10;
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

// // // Search for a book route
// router.get(
//   "/search",
//   asyncHandler(async (req, res) => {
//     const limit = 10;
//     const search = req.body.search || req.query.search || "";
//     let page = parseInt(req.query.page);
//     if (!page) {
//       page = 1;
//     }
//     const { count, rows } = await Book.findAndCountAll({
//       where: {
//         [Op.or]: {
//           title: {
//             [Op.like]: `%${search}%`,
//           },
//           author: {
//             [Op.like]: `%${search}%`,
//           },
//           genre: {
//             [Op.like]: `%${search}%`,
//           },
//           year: {
//             [Op.like]: `%${search}%`,
//           },
//         },
//       },
//       order: [["title"]],
//       limit: limit,
//       offset: (page - 1) * limit,
//     });

//     const numberOfPages = Math.ceil(count / limit);
//     res.render("index", {
//       books: rows,
//       title: "Books",
//       numberOfPages: numberOfPages,
//       page,
//       search,
//     });
//   })
// );

// router.get(
//   "/new",
//   asyncHandler(async (req, res) => {
//     res.render("books/new-book", { book: {}, title: "Create New Book" });
//   })
// );

// router.post(
//   "/new",
//   asyncHandler(async (req, res) => {
//     let book;
//     try {
//       book = await Book.create(req.body);
//       res.redirect("/books/" + book.id);
//     } catch (error) {
//       if (error.name === "SequelizeValidationError") {
//         book = await Book.build(req.body);
//         res.render("books/new-book", { book, errors: error.errors });
//       } else {
//         throw error;
//       }
//     }
//   })
// );

//get indiviadual book
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/show", { book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "The book you are looking for does not exist";
      next(err);
    }
  })
);

// // get update form
// router.get(
//   "/:id/edit",
//   asyncHandler(async (req, res) => {
//     const book = await Book.findByPk(req.params.id);
//     if (book) {
//       res.render("books/update-book", {
//         book,
//         title: "Update Book",
//         buttonTitle: "UPDATE",
//       });
//     } else {
//       const err = new Error();
//       err.status = 404;
//       err.message = `The Book you are looking for doent exist.`;
//       next(err);
//     }
//   })
// );

// // Update a book
// router.post(
//   "/:id/edit",
//   asyncHandler(async (req, res) => {
//     let book;
//     try {
//       book = await Book.findByPk(req.params.id);
//       if (book) {
//         await book.update(req.body);
//         res.redirect("/books/" + book.id);
//       } else {
//         res.sendStatus(404);
//       }
//     } catch (error) {
//       if (error.name === "SequelizeValidationError") {
//         book = await Book.build(req.body);
//         book.id = req.params.id;
//         res.render("books/update-book", { book, errors: error.errors });
//       } else {
//         throw error;
//       }
//     }
//   })
// );

// //get book to delete

// router.get(
//   "/:id/delete",
//   asyncHandler(async (req, res) => {
//     const book = await Book.findByPk(req.params.id);
//     if (book) {
//       res.render("books/delete", { book });
//     }
//   })
// );

// //Delete a Book
// router.post(
//   "/:id/delete",
//   asyncHandler(async (req, res) => {
//     const book = await Book.findByPk(req.params.id);
//     if (book) {
//       await book.destroy();
//       res.redirect("/");
//     } else {
//       res.sendStatus(404);
//     }
//   })
// );

module.exports = router;
