const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    districtName: { type: String },
        
    stateName:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "states",
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("districts", districtSchema);
