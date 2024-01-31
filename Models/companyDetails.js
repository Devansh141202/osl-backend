const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String },
    stateName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "states",
    },
    districtName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "districts",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("companies", companySchema);
