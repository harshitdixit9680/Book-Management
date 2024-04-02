const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Book = require("../models/Book");
const { body, validationResult } = require("express-validator");


// route 1 fetch all the data for a card POST "/api/card/fetchalldata"
router.get("/fetchallbook", fetchuser, async (req, res) => {
    try {
      const book_data = await Book.find({ user: req.user.id });
      res.json(book_data);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
// ROUTE 2: Add a new Card using: POST "/api/card/addcard". Login required
router.post(
  "/adddata",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("author", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("year", "Enter The Price").isLength({
      min:2,
    }),
  ],
  async (req, res) => {
    try {
      const { title, author ,year } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const book = new Book({
        title,
        author,
        year,
        user: req.user.id,
      });
      const savedBook = await book.save();

      res.json(savedBook);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);









// ROUTE 3: Update Of Exiting Note Note using: PUT "/api/note/updatenote". Login required
router.put("/updatebook/:id", fetchuser, async (req, res) => {
  const { title, author, year } = req.body;
  // Create a newCard object
  const newBook = {};
  if (title) {
    newBook.title = title;
  }
  if (author) {
    newBook.author = author;
  }
  if (year) {
    newBook.year = year;
  }

  // Find the note to be updated and update it
  let bookData = await Book.findById(req.params.id);
  if (!bookData) {
    return res.status(404).send("Not Found");
  }

  if (bookData.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  bookData = await Book.findByIdAndUpdate(
    req.params.id,
    { $set: newBook },
    { new: true }
  );
  res.json({ bookData });
});






// ROUTE 4: Delete Of Exiting Note Note using: Delete "/api/note/Deleteenote". Login required
router.delete('/deletebook/:id', fetchuser, async (req, res) => {
  try {
      // Find the note to be delete and delete it
      let bookdata = await Book.findById(req.params.id);
      if (!bookdata) { return res.status(404).send("Not Found") }

      // Allow deletion only if user owns this Note
      if (bookdata.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }

      bookdata = await Book.findByIdAndDelete(req.params.id)
      res.json({ "Success": "Note has been deleted", bookdata: bookdata });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})

module.exports = router;