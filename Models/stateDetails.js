const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
  {
    stateName: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("states", stateSchema);
