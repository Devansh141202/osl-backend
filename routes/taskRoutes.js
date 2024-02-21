const express = require("express");
const { createProject, createModule, getModules, getProjects, createTask, getTasks, getHours } = require("../controller/logsController");
const router = express.Router();

router.route("/create-project").post(createProject);
router.route("/create-module/:id").post(createModule);
router.route("/get-modules/:id").get(getModules);
router.route("/get-projects").get(getProjects);
router.route("/create-task").post(createTask);

router.route("/get-task-hours").get(getHours);

module.exports = router;