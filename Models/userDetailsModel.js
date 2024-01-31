const mongoose = require("mongoose");

const userDetails = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter fullname"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    gender: {
      type: String,
      required: [true, "Please enter gender"],
    },
    address: {
      type: String,
    },
    rememberMe: {
      type: Boolean,
    },
    workDetails: [
      {
        companyName: {
          type: String,
        },
        month: {
          type: String,
        },
        hours: {
          type: Number,
        },
      },
    ],
    stateName: {
      type: String,
      ref: "states",
    },
    districtName: {
      type: String,
      ref: "districts",
    },
    companyName: {
      type: String,
      ref: "companies",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userDetails);
