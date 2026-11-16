const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseByIdOrSlug,
  createCourse,
  updateCourse,
  deleteCourse,
  seedCourses,
} = require("../controllers/courseController");

// Seeding route
router.get("/seed", seedCourses);
router.post("/seed", seedCourses);

// Category specific route
router.get("/category/:category", (req, res, next) => {
  req.query.category = req.params.category;
  return getAllCourses(req, res, next);
});

// Section specific route (alias for category)
router.get("/section/:section", (req, res, next) => {
  req.query.category = req.params.section;
  return getAllCourses(req, res, next);
});

// General course CRUD routes
router.get("/", getAllCourses);
router.get("/:id", getCourseByIdOrSlug);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
