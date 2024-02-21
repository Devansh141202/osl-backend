const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../Models/userDetailsModel");
const mongoose = require("mongoose");
const asyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.userDetails = asyncErrors(async (req, res) => {
  const {
    fullName,
    email,
    password,
    gender,
    state,
    district,
    address,
    companyName,
    rememberMe,
  } = req.body;
  if (!fullName || !email) {
    res.status(406).send({
      success: false,
      message: "Fullname and email can't be empty",
    });
  }
  const hashedPass = await bcrypt.hash(password, 10).catch((e) => {
    console.log(e.message);
  });
  console.log(hashedPass);
  const data = await userModel.create({
    fullName,
    email,
    password: hashedPass,
    gender,
    stateName: state,
    districtName: district,
    companyName,
    address,
    rememberMe,
  });
  if (!data)
    res.status(406).send({
      success: false,
      message: "Data insertion failed!",
    });
  res.status(201).send({
    success: true,
    message: "User created successfully!",
  });

  responseHandler(res, SUCCESS_S_0001("WO"), data);

});
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const data = await userModel.findOne({ email });
  if (!data) {
    return res.status(401).send({
      success: false,
      message: "User Not found",
    });
  }
  const isPassValid = await bcrypt.compare(password, data.password);
  if (!isPassValid) {
    return res.status(401).send({
      success: false,
      message: "Authentication fail!!",
    });
  }
  const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
  res.status(200).send({
    success: true,
    message: "you are logged in!!",
    token,
  });
};
exports.getUser = asyncErrors(async (req, res) => {
  const { email } = req.body;
  const data = await userModel.find({ email });
  if (!data) {
    res.status(404).send({
      success: false,
      message: "User doesn't exists",
    });
  }
  res.status(201).send({
    success: true,
    data,
  });
});
exports.updateUser = asyncErrors(async (req, res) => {
  const { firstName, email } = req.body;
  const data = await userModel.find({ firstName });
  if (!data) {
    res.status(404).send({
      success: false,
      message: "User doesn't exists",
    });
    return;
  }
  const updatedData = await userModel.findOneAndUpdate(
    { firstName },
    { email },
    {
      new: true,
      runValidators: true,
      userFindAndModified: false,
    }
  );
  if (!updatedData) {
    res.status(406).send({
      success: false,
      message: "Updation failed!!",
    });
    return;
  }

  res.status(201).send({
    success: true,
    updatedData,
  });
});
exports.deleteUser = asyncErrors(async (req, res) => {
  const { firstName } = req.body;
  const user = await userModel.find({ firstName });
  await userModel.deleteOne({ user });
  res.status(200).json({
    success: true,
    message: "User removed successfully",
  });
});
// exports.workDetails = asyncErrors(async (req, res) => {
//   const { name, month, hours } = req.body;

//   const data = await userModel.create({});
// });
exports.addRows = asyncErrors(async (req, res) => {
  const { companyName, month, hours } = req.body;
  if (!companyName || !month || !hours) {
    res.status(400).json({
      success: true,
      message: "Please provide all the fields",
    });
    // return
  }
  const data = await userModel.findByIdAndUpdate(
    {
      _id: req.body.userId,
    },
    {
      $push: { workDetails: { companyName, month, hours } },
    }
  );
  console.log(req.body.userId);
  if (!data) {
    res.status(400).json({
      success: false,
      message: "Data insertion failed",
    });
    // return;
  }
  res.status(200).json({
    success: true,
    message: "Data added successfully",
  });
  // return
});
exports.getRows = asyncErrors(async (req, res) => {
  // const { id } = req.params;
  const data = await userModel.findById(req.body.userId);
  if (!data) {
    res.status(400).json({
      success: false,
      message: "Data not found",
    });
    return;
  }
  let resp = [{}];
  data.workDetails.map((item) => {
    const rows = item.workDetails;
    resp = resp.concat(rows);
  });
  resp = data.workDetails;
  res.status(200).json({
    success: true,
    resp,
  });
});
exports.deleteRows = asyncErrors(async (req, res) => {
  const { id } = req.params;

  const data = await userModel.findByIdAndUpdate(
    { _id: req.body.userId },
    { $pull: { workDetails: { _id: id } } }
  );
  if (!data) {
    res.status(400).json({
      success: false,
      message: "Data not found",
    });
    return;
  }
  // await data.save();
  res.status(200).json({
    success: true,
    message: "Data deleted successfully",
  });
});
exports.updateRows = asyncErrors(async (req, res) => {
  try {
    const { companyName, month, hours } = req.body;
    const { id } = req.params;
    console.log("this is params "+ id)
    console.log("this is user " + req.body.userId);
    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          "workDetails.$[elem].companyName": companyName,
          "workDetails.$[elem].month": month,
          "workDetails.$[elem].hours": hours,
        },
      },
      {
        arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(id) }],
        new: true,
        runValidators: true, // To run validators on the update operation
      }
    );
    let resp = [{}];
    user.workDetails.find((val) => {
      // console.log("this is "+ val._id);
      if (val._id == id) {
        console.log("object");
        resp = val;
      }
    });
    res.status(200).json({
      resp,
    });
  } catch (err) {
    console.log(err);
  }
});
