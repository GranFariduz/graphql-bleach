import mongoose from "mongoose";

const Zanpakuto = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bankai: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Zanpakuto", Zanpakuto);
