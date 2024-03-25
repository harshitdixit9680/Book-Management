const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Card = require("../models/Card");
const { body, validationResult } = require("express-validator");


// route 1 fetch all the data for a card POST "/api/card/fetchalldata"
router.get("/fetchalldata", fetchuser, async (req, res) => {
    try {
      const card_data = await Card.find({ user: req.user.id });
      res.json(card_data);
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
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("price", "Enter The Price").isLength({
      min:2,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, price } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const card = new Card({
        title,
        description,
        price,
        user: req.user.id,
      });
      const savedCard = await card.save();

      res.json(savedCard);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);









// ROUTE 3: Update Of Exiting Note Note using: PUT "/api/note/updatenote". Login required
router.put("/updatecard/:id", fetchuser, async (req, res) => {
  const { title, description, price } = req.body;
  // Create a newCard object
  const newCard = {};
  if (title) {
    newCard.title = title;
  }
  if (description) {
    newCard.description = description;
  }
  if (price) {
    newCard.price = price;
  }

  // Find the note to be updated and update it
  let cardData = await Card.findById(req.params.id);
  if (!cardData) {
    return res.status(404).send("Not Found");
  }

  if (cardData.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  cardData = await Card.findByIdAndUpdate(
    req.params.id,
    { $set: newCard },
    { new: true }
  );
  res.json({ cardData });
});






// ROUTE 4: Delete Of Exiting Note Note using: Delete "/api/note/Deleteenote". Login required
router.delete('/deletecard/:id', fetchuser, async (req, res) => {
  try {
      // Find the note to be delete and delete it
      let carddata = await Card.findById(req.params.id);
      if (!carddata) { return res.status(404).send("Not Found") }

      // Allow deletion only if user owns this Note
      if (carddata.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allowed");
      }

      carddata = await Card.findByIdAndDelete(req.params.id)
      res.json({ "Success": "Note has been deleted", carddata: carddata });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})

module.exports = router;