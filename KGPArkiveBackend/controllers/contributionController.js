const Contribution = require("../models/Contribution");
const Course = require("../models/Course");

// Create a new contribution and sync with courses
exports.createContribution = async (req, res) => {
  try {
    const { name, email, subjects } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Contributor name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: "Contributor email is required" });
    }
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ success: false, error: "At least one subject is required" });
    }

    // Normalize subjects data according to course schema
    const normalizedSubjects = subjects
      .filter((s) => (s.title && s.title.trim()) || (s.subjectName && s.subjectName.trim()))
      .map((s) => {
        const title = (s.title || s.subjectName).trim();
        const category = (s.category || "semesters").toLowerCase().trim();
        const notes = (s.notes || s.driveLink || "").trim();
        const resources = (s.resources || "").trim();
        const books = (s.books || "").trim();
        const tutorial = (s.tutorial || "").trim();
        const mytutorial = (s.mytutorial || "").trim();
        const NPTEL = (s.NPTEL || "").trim();
        const description = (s.description || "").trim();
        const videos = Array.isArray(s.videos) ? s.videos : [];

        return {
          title,
          category,
          notes,
          resources,
          books,
          tutorial,
          mytutorial,
          NPTEL,
          description,
          videos,
        };
      });

    if (normalizedSubjects.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide valid subject details with title and resource link",
      });
    }

    // 1. Save Contribution record in MongoDB
    const contribution = new Contribution({
      name: name.trim(),
      email: email.trim(),
      subjects: normalizedSubjects,
      status: "approved",
    });

    const savedContribution = await contribution.save();

    // 2. Automatically sync with Course collection in MongoDB
    for (const sub of normalizedSubjects) {
      const slug = sub.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      const existingCourse = await Course.findOne({
        title: { $regex: new RegExp(`^${sub.title}$`, "i") },
        category: sub.category,
      });

      if (existingCourse) {
        // Enrich existing course with non-empty contributed fields
        const updateFields = {};
        if (sub.notes && (!existingCourse.notes || existingCourse.notes === "drivelink")) {
          updateFields.notes = sub.notes;
        }
        if (sub.resources && (!existingCourse.resources || existingCourse.resources === "drivelink")) {
          updateFields.resources = sub.resources;
        }
        if (sub.books && (!existingCourse.books || existingCourse.books === "drivelink")) {
          updateFields.books = sub.books;
        }
        if (sub.tutorial && (!existingCourse.tutorial || existingCourse.tutorial === "drivelink")) {
          updateFields.tutorial = sub.tutorial;
        }
        if (sub.mytutorial && !existingCourse.mytutorial) {
          updateFields.mytutorial = sub.mytutorial;
        }
        if (sub.NPTEL && !existingCourse.NPTEL) {
          updateFields.NPTEL = sub.NPTEL;
        }
        if (sub.description && !existingCourse.description) {
          updateFields.description = sub.description;
        }

        if (Object.keys(updateFields).length > 0) {
          await Course.findByIdAndUpdate(existingCourse._id, { $set: updateFields });
        }
      } else {
        // Create new Course
        await Course.create({
          title: sub.title,
          slug,
          category: sub.category,
          description: sub.description || "",
          notes: sub.notes || "",
          resources: sub.resources || "",
          books: sub.books || "",
          tutorial: sub.tutorial || "",
          mytutorial: sub.mytutorial || "",
          NPTEL: sub.NPTEL || "",
          videos: sub.videos || [],
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Contribution saved successfully to MongoDB and synced with courses!",
      contribution: savedContribution,
    });
  } catch (error) {
    console.error("Error saving contribution:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save contribution: " + error.message,
    });
  }
};

// Get all contributions
exports.getAllContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contributions.length,
      contributions,
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch contributions: " + error.message,
    });
  }
};

// Get single contribution by ID
exports.getContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) {
      return res.status(404).json({ success: false, error: "Contribution not found" });
    }
    res.status(200).json({ success: true, contribution });
  } catch (error) {
    console.error("Error fetching contribution:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch contribution: " + error.message,
    });
  }
};
