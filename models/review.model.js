const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
  });

module.exports = mongoose.model("Review", reviewSchema)