const express = require("express");
const {
  userDetails,
  getUser,
  updateUser,
  deleteUser,
  login,
  addRows,
  getRows,
  updateRows,
  deleteRows,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addStateAndDist,
  getStates,
  getDistricts,
} = require("../controller/stateController");
const { addCompany, getHours} = require("../controller/companyController");
// const user = require('../controller/userController');

const router = express.Router();

router.route("/create-details").post(userDetails);
router.route("/get-details").get(getUser);
router.route("/update-details").put(updateUser);
router.route("/delete-details").delete(deleteUser);


router.route("/add-row").post(addRows);
router.route("/get-rows").get(authMiddleware,getRows);
router.route("/update-rows/:id").put(authMiddleware,updateRows);
router.route("/delete-rows/:id").delete(deleteRows);


router.route("/add-state-dist").post(addStateAndDist);
router.route("/login").post(login);
router.route("/get-states").get(getStates);
router.route("/verify-token").get(authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});
router.route("/get-districts").get(getDistricts);

router.route("/add-company").post(addCompany)

router.route("/get-hours").get(getHours)


module.exports = router;
