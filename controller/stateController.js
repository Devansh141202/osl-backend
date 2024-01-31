const express = require("express");
const jsonData = require("../Indian_Cities_In_States_JSON.json");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stateDetails = require("../Models/stateDetails");
const districtDetails = require("../Models/districtDetails");

// exports.addStateAndDist = catchAsyncErrors(async (req, res) => {
//   try {
//     for (let stateName in jsonData) {
//       const state = await stateDetails.create({ stateName });
//       const districts = jsonData[stateName];

//       for (const districtName of districts) {
//         console.log(state._id)
//         await districtDetails.create({ districtName, stateId: state._id });
//       }
//       console.log(stateName);
//     }
//     res.status(200).json("State and District Details Added Successfully");
//   } catch (error) {
//     console.log(error);
//   }
// });
exports.addStateAndDist = catchAsyncErrors(async (req, res) => {
  try {
    for (let stateName in jsonData) {
      // Create the state first
      const state = await stateDetails.create({ stateName });
      const districts = jsonData[stateName];

      for (const districtName of districts) {
        // Use the saved state _id here
        await districtDetails.create({ districtName, stateName: state._id });
      }
      console.log(stateName);
    }
    res.status(200).json("State and District Details Added Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
exports.getStates = catchAsyncErrors(async (req, res) => {
  const states = await stateDetails.find({}, 'stateName');
  res.status(200).json(states);
})
exports.getDistricts = catchAsyncErrors(async (req, res) => {
  const selectedState = req.query.state;

  const state = await stateDetails.findOne({ _id : selectedState });
  if (!state) {
    return res.status(404).json({ error: 'State not found' });
  }

  const districts = await districtDetails.find({ stateId: state._id }, 'districtName');
  res.status(200).json(districts);
})
