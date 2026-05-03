const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  examType: { type: String, enum: ["IELTS", "DELF"] },
  reading: Number,
  writing: Number,
  listening: Number,
  speaking: Number,
  totalScore: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);