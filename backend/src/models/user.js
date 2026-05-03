const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  photoURL: String,

  ielts: {
    reading: { type: Number, default: 0 },
    writing: { type: Number, default: 0 },
    listening: { type: Number, default: 0 },
    speaking: { type: Number, default: 0 },
  },

  delf: {
    reading: { type: Number, default: 0 },
    writing: { type: Number, default: 0 },
    listening: { type: Number, default: 0 },
    speaking: { type: Number, default: 0 },
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);