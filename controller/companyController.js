const userModel = require("../Models/userDetailsModel");
const stateModel = require("../Models/stateDetails");
const companyModel = require("../Models/companyDetails");
const asyncErrors = require("../middleware/catchAsyncErrors");
const { default: mongoose } = require("mongoose");

exports.addCompany = asyncErrors(async (req, res) => {
  const company = new companyModel({
    companyName: "Amazon",
    stateName: new mongoose.Types.ObjectId("65b23c40526f5edf436aa91a"),
    districtName: new mongoose.Types.ObjectId("65b23c40526f5edf436aa91e"),
  });

  await company.save();
  res.json(company);
});
exports.getHours = asyncErrors(async (req, res) => {
  const { state, district, month } = req.query;
  let pipelines = [
    {
      $unwind: "$workDetails",
    },
  ];
  if (month) {
      pipelines.push({
      $match: { "workDetails.month": month },
    });
  }
  pipelines.push(
    {
      $group: {
        _id: "$companyName",
        count: { $sum: "$workDetails.hours" },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "_id",
        foreignField: "companyName",
        as: "company",
      },
    },
    {
      $addFields: {
        company: {
          $arrayElemAt: ["$company", 0],
        },
      },
    }
  );
  if (state) {
    let pipeline = {
      $match: { "company.stateName": new mongoose.Types.ObjectId(state) },
    };
    if (district) {
      pipeline.$match["company.districtName"] = new mongoose.Types.ObjectId(
        district
      );
    }
    pipelines.push(pipeline);
  }
  const data = await userModel.aggregate([pipelines]);
  if (!data) {
    res.status(400).json({
      message: "No data found",
    });
  }
  res.status(200).json(data);
});
