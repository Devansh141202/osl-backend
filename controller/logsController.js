const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const logsModel = require("../Models/logsModel");
const { default: mongoose } = require("mongoose");

exports.createProject = catchAsyncErrors(async (req, res) => {
  const { projectName } = req.body;
  const project = await logsModel.create({
    projectName,
  });
  res.status(201).json({
    message: "Project created successfully",
    project,
  });
});
exports.getProjects = catchAsyncErrors(async (req, res) => {
  const projects = await logsModel.find();
  res.status(201).json({
    message: "Project fetched successfully",
    projects,
  });
});
exports.createModule = catchAsyncErrors(async (req, res) => {
  const { moduleName } = req.body;
  const { id } = req.params;
  const module = await logsModel.findByIdAndUpdate(id, {
    $push: { module: { moduleName } },
  });
  res.status(201).json({
    message: "module created successfully",
    module,
  });
});
exports.getModules = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const project = await logsModel.findById(id);
  const modules = project.module;
  res.status(201).json({
    message: "Project fetched successfully",
    modules,
  });
});
exports.createTask = catchAsyncErrors(async (req, res) => {
  const { projectId, moduleId } = req.query;

  const { taskName, date, researchHour, developmentHour, meetingHour } =
    req.body;
  const project = await logsModel.findById(projectId);
  const modules = project.module;
  const module = modules.find((module) => module._id == moduleId);
  // console.log("this is", module);
  module.task.push({
    taskName,
    date,
    researchHour,
    developmentHour,
    meetingHour,
  });
  project.save();

  res.status(201).json({
    message: "module created successfully",
    module,
  });
});

exports.getHours = catchAsyncErrors(async (req, res) => {
  const { project, module, date1, date2 } = req.query;

  let pipeLine = [];
  if (project) {
    pipeLine.push({
      $match: {
        _id: new mongoose.Types.ObjectId(project),
      },
    });
  }
  pipeLine.push(
    {
      $unwind: "$module",
    },
  );
  if (module) {
    pipeLine.push({
      $match: {
        "module._id": new mongoose.Types.ObjectId(module),
      },
    });
  }
  pipeLine.push(
    {
      $unwind: "$module.task",
    }
  );
  if(date1 && date2){
    pipeLine.push(
      {
        $match: {
          "module.task.date": {
            $gte: new Date(date1),
            $lt: new Date(date2),
          },
        },
      },
    )
  }
  pipeLine.push(
    {
      $group: {
        _id: null,
        countResearch:{
          $sum:"$module.task.researchHour"
        },
        countDevelopment:{
          $sum:"$module.task.developmentHour"
        },
        countMeeting:{
          $sum:"$module.task.meetingHour"
        }
      },
    },
  );
  const data = await logsModel.aggregate([pipeLine]);
  if (!data) {
    res.status(400).json({
      message: "No data found",
    });
  }
  res.status(200).json(data);
});
