const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = mongoose.model('book', BookSchema);