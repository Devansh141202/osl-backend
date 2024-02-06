const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const logsModel = require("../Models/logsModel");

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
  const { taskName } = req.body;
  const project = await logsModel.findById(projectId);
  const modules = project.module;
  const module = modules.find((module) => module._id == moduleId);
  module.task.push({
    taskName,
    date,
    researchHour,
    developmentHour,
    meetingHour,
  });

  res.status(201).json({
    message: "module created successfully",
    module,
  });
});
