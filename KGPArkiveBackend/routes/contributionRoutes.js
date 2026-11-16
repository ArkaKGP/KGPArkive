const express = require("express");
const router = express.Router();
const {
  createContribution,
  getAllContributions,
  getContributionById,
} = require("../controllers/contributionController");

router.post("/", createContribution);
router.get("/", getAllContributions);
router.get("/:id", getContributionById);

module.exports = router;
