import mongoose from "mongoose";

const Wielder = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  zanpakuto: {
    type: String,
    ref: "Zanpakuto",
    required: true
  }
});

module.exports = mongoose.model("Wielder", Wielder);
