const Course = require("../models/Course");
const mongoose = require("mongoose");

// Initial seed data from freshers.json, sems.json, and commons.json
const defaultSeedData = [
  // Freshers
  {
    category: "freshers",
    title: "Advanced Calculus",
    NPTEL: "https://youtube.com/playlist?list=PLbRMhDVUMngeVrxtbBz-n8HvP8KAWBpI5&si=NGhORrzuPyZ_Is3O",
    notes: "drivelink",
    resources: "drivelink",
    books: "drivelink",
    tutorial: "",
    mytutorial: "",
    videos: []
  },
  {
    category: "freshers",
    title: "Basic Engineering Mechanics",
    NPTEL: "https://youtube.com/playlist?list=PLOSWwFV98rfKXq2KBphJz95rao7q8PpwT&si=HqgEUCOwC1aW3Jy3",
    notes: "https://drive.google.com/drive/folders/1-jK7fY34f0GaURYDuZkMjPtUgbbqawU6?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1QpRY4T9H4BoOpxnkYRso1HK04OQkUffP?usp=drive_link",
    books: "https://drive.google.com/file/d/1OThs2rjU_WNCBmmnHWcLIcCJQ0bqKbYD/view?usp=sharing",
    tutorial: "https://drive.google.com/drive/folders/1y4zlcmSIubPiufRFEEDJtbc0OhNrXGsf?usp=drive_link",
    mytutorial: "https://drive.google.com/drive/folders/1-jK7fY34f0GaURYDuZkMjPtUgbbqawU6?usp=sharing",
    videos: []
  },
  {
    category: "freshers",
    title: "Programming & Data Structure",
    NPTEL: "",
    notes: "",
    resources: "",
    books: "",
    tutorial: "",
    mytutorial: "",
    videos: []
  },
  {
    category: "freshers",
    title: "Physics of Waves",
    NPTEL: "https://youtube.com/playlist?list=PL30D1917C52D9F9B9&si=zpA99da780-MpIJQ",
    notes: "",
    resources: "",
    books: "",
    tutorial: "https://drive.google.com/drive/folders/1isk5yssxTSrh2p4WmE_c8jnzmKhpodmp?usp=drive_link",
    mytutorial: "https://drive.google.com/drive/folders/1K_I8wzlKRpvcez7FbpP5ewJLRolZzRoM?usp=drive_link",
    videos: []
  },
  {
    category: "freshers",
    title: "Environmental Science",
    NPTEL: "",
    notes: "https://drive.google.com/drive/folders/1Q8Qy0gj_J3JLdeXsKTRh1T--MbEjD12G?usp=drive_link",
    resources: "",
    books: "",
    tutorial: "",
    mytutorial: "https://drive.google.com/drive/folders/1Q8Qy0gj_J3JLdeXsKTRh1T--MbEjD12G?usp=drive_link",
    videos: []
  },
  {
    category: "freshers",
    title: "Linear Algebra Numerical Analysis Complex Analysis",
    NPTEL: "https://youtube.com/playlist?list=PLbRMhDVUMngdVprk_HvTKA_F1pe9UPlEy&si=_I7g7uSm_1E1JvWj",
    notes: "",
    resources: "",
    books: "",
    tutorial: "https://drive.google.com/drive/folders/1FqWgRY_MIWSh34gP1JOrXKQyxTnfhfE3?usp=drive_link",
    mytutorial: "https://drive.google.com/file/d/1p7oxfP5J7sS0YzbHdAYcPJonmjoIBuFF/view?usp=drive_link",
    videos: []
  },
  {
    category: "freshers",
    title: "Electrical Technology",
    NPTEL: "https://youtube.com/playlist?list=PLbRMhDVUMngfdEXVcdf_ijj2Eub-UHs_y&si=WwyqKi2HkqxxkDOU",
    notes: "https://drive.google.com/drive/folders/1lqvkTpbUpL90wjF_pkQu-aPVeT5fVphO?usp=drive_link",
    resources: "",
    books: "",
    tutorial: "https://drive.google.com/drive/folders/1pO6BkWwtA7Y7pPgkmWoJo3jYuEm_tub0?usp=drive_link",
    mytutorial: "https://drive.google.com/drive/folders/1BWilqUWK4oQZwM1mWxz2Idlu0qGhY3ur?usp=drive_link",
    videos: []
  },
  {
    category: "freshers",
    title: "Science of Living Systems",
    NPTEL: "",
    notes: "",
    resources: "",
    books: "",
    tutorial: "",
    mytutorial: "",
    videos: []
  },

  // Semesters
  {
    category: "semesters",
    title: "Analog Electronic Circuits",
    NPTEL: "https://youtube.com/playlist?list=PLp6ek2hDcoNDAw1BehPFazZ5ogPV8UlQa&si=dle4xBjqKsM3E_hw",
    notes: "https://drive.google.com/file/d/1lKc343XnKClf5q4tyEa-KTMPamipbwTH/view?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1guzDbVKAJIoyUsltVV5cAgFULKYIBeHH?usp=drive_link",
    books: "https://drive.google.com/drive/folders/1gt25u1GpPZ_-D0tAjI4qpbauV4E3uhR1?usp=drive_link",
    tutorial: "",
    mytutorial: "",
    videos: []
  },
  {
    category: "semesters",
    title: "Signals and Systems",
    NPTEL: "https://youtube.com/playlist?list=PLp6ek2hDcoNDAw1BehPFazZ5ogPV8UlQa&si=dle4xBjqKsM3E_hw",
    notes: "https://drive.google.com/drive/folders/1_nuOvaGIl21JZE1k2fjVK98brqZ2rrBX?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1sCsxCIORnOoXbL6Za2UFLoWl6cltdTtJ?usp=drive_link",
    books: "https://drive.google.com/drive/folders/1gt25u1GpPZ_-D0tAjI4qpbauV4E3uhR1?usp=drive_link",
    tutorial: "",
    mytutorial: "",
    videos: []
  },
  {
    category: "semesters",
    title: "Network Analysis",
    NPTEL: "https://youtube.com/playlist?list=PLbRMhDVUMnge4gDT0vBWjCb3Lz0HnYKkX&si=swdEhg8aCHpYKuki",
    notes: "https://drive.google.com/drive/folders/1oEEXSkOrve6CLSUDltcmlFqYNkxzBqY_?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1Vsi5xiq_M54JIe0a-O8mDl4YGMt_Vy5u?usp=drive_link",
    books: "",
    tutorial: "https://drive.google.com/drive/folders/1gjbOHvaGA1IkR2AXGRFrTli_dXcaZM-K?usp=drive_link",
    mytutorial: "",
    videos: []
  },
  {
    category: "semesters",
    title: "Digital Electronic Circuits",
    NPTEL: "https://youtube.com/playlist?list=PLbRMhDVUMnge4gDT0vBWjCb3Lz0HnYKkX&si=swdEhg8aCHpYKuki",
    notes: "https://drive.google.com/drive/folders/1D0L_5EEFwPjva8_7x8s9BKEKAqdXHCf0?usp=drive_link",
    resources: "https://drive.google.com/drive/folders/1zf72I6IKBxlzUxM8PpPswAsHWKgGAOKR?usp=drive_link",
    books: "",
    tutorial: "https://drive.google.com/drive/folders/17XLvKg-qaw0ZlEb7GutquwbV-Jtk64nt?usp=drive_link",
    mytutorial: "",
    videos: []
  },
  {
    category: "semesters",
    title: "Measurement and Electronic Instruments",
    NPTEL: "",
    notes: "https://drive.google.com/file/d/1vUxAS0PYAaFj-siHlrbyz3eKiNZcouoC/view?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1LVDJmCsU3lxXCckSF-eCNh0iJQZJsMjR?usp=drive_link",
    books: "https://drive.google.com/file/d/1pp34Z0HC3af-PhqnBECnilhmv3_fPU1S/view?usp=drive_link",
    tutorial: "https://drive.google.com/drive/folders/1IlGbBJBz49bv-L1WWvQXOtK9ZOt62GRB?usp=drive_link",
    mytutorial: "",
    videos: []
  },
  {
    category: "semesters",
    title: "Data Communication",
    NPTEL: "",
    notes: "",
    resources: "",
    books: "",
    tutorial: "",
    mytutorial: "",
    videos: []
  },
  {
    category: "semesters",
    title: "Digital Signal Processing",
    NPTEL: "",
    notes: "https://drive.google.com/file/d/1vUxAS0PYAaFj-siHlrbyz3eKiNZcouoC/view?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1o79_1VqB3KC43ARnmh-Xbp69pvR3OzFt?usp=drive_link",
    books: "https://drive.google.com/file/d/1J5EHF33YhheyfJ-8Ock43Dw_wVCNpOxO/view?usp=drive_link",
    tutorial: "https://drive.google.com/drive/folders/1pSx3o8dqawtzPuZFHjlDW-KkrdgYT4W9?usp=drive_link",
    mytutorial: "",
    videos: [
      { "LPF Windowing": "https://youtu.be/ObhoS6OOwrA" }
    ]
  },
  {
    category: "semesters",
    title: "Instrumentation Devices",
    NPTEL: "https://facweb.iitkgp.ac.in/~ashismaity/Instrumentation_Devices_Autumn_2025.html",
    notes: "https://drive.google.com/file/d/1nlFseSaCC-JnC9WYDw9DYFG04iblXpE-/view?usp=drive_link",
    resources: "https://drive.google.com/drive/folders/16bxA42u4wfv8kS1xO0HvceYz8mXMGi4-?usp=drive_link",
    books: "https://drive.google.com/file/d/1xpXAILNRcI9CZO37OcfkQqZ0nqYu2Zpu/view?usp=drive_link",
    tutorial: "https://drive.google.com/drive/folders/1Nm44BnYEJ_QrCotcty-JTyWtXk7sb9ru?usp=drive_link",
    mytutorial: "https://drive.google.com/drive/folders/1AiAxsibr3RyUV4TSHLVVSb4jzICltRbM?usp=drive_link",
    videos: []
  },
  {
    category: "semesters",
    title: "Control Systems Engineering",
    NPTEL: "",
    notes: "https://drive.google.com/file/d/1rVXCnui0CFGnaswe2IssUSvUbUGJOCXn/view?usp=drive_link",
    resources: "https://drive.google.com/drive/folders/14nb1Zp8TpvdBMGRRcnxsBd1Y3aPFSUgD?usp=drive_link",
    books: "https://drive.google.com/file/d/1IMmHTVw3P6wul4t6r6sl7dHDhtJjWpWb/view?usp=drive_link",
    tutorial: "https://drive.google.com/drive/folders/17R3rP2MHRlpGEWDTHRptLD6xV1KNCkWl?usp=drive_link",
    mytutorial: "https://drive.google.com/drive/folders/1WYOFtkRKVymO9NjCCq3ucatfXqtqEP-k?usp=drive_link",
    videos: []
  },

  // Commons
  {
    category: "commons",
    title: "Probability ans Statistics",
    NPTEL: "https://youtube.com/playlist?list=PL6C92B335BD4238AB&si=1oWzUJlh5KWd2zFG",
    notes: "https://drive.google.com/drive/folders/1EMVxnwbVUZr-0InCxZbcJbtQmPxFIpOs?usp=drive_link",
    resources: "https://youtube.com/playlist?list=PLO-6jspot8ALyrofp0fWp0fOb19NcFS4V&si=xCCJTN397E9rmVPx",
    books: "drivelink",
    tutorial: "https://drive.google.com/drive/folders/1cXi_hyIxheLIAETOd4I-rZmkwrs7M-dU?usp=drive_link",
    mytutorial: "https://drive.google.com/drive/folders/1amXtT0ttUwPWNEDZM1e8u1unNbJtZrPx?usp=drive_link",
    videos: [
      {
        "Transformation of a Random variable": "https://www.youtube.com/watch?v=zNZkfZytc_o&list=PLO-6jspot8ALyrofp0fWp0fOb19NcFS4V&index=36",
        "Transformation of Two-Dimensional Random Variables": "https://youtu.be/lr_UEYqPvPQ?si=2ZqjHarFCk5nvaJC",
        "Binomial Distribution": "https://www.youtube.com/watch?v=m5u4h0t4ico&list=PLO-6jspot8ALyrofp0fWp0fOb19NcFS4V&index=41",
        "Gamma Distribution": "https://youtu.be/QrcpYoRzRNQ?si=WJ8m5EeOuZJRncbf"
      }
    ]
  },
  {
    category: "commons",
    title: "Economics",
    NPTEL: "",
    notes: "https://drive.google.com/drive/folders/1ev6ZHL2H1Q7zk5e6lGBoGJJ5hlbihdw9?usp=drive_link",
    resources: "https://drive.google.com/drive/folders/1hBuGfvdZ6E490OV5MxNmyZWU9Sw1YukM?usp=drive_link",
    books: "https://drive.google.com/file/d/1hMvpsz3gexMmbQO2gldO7L33GLSSBAvR/view?usp=drive_link",
    tutorial: "drivelink",
    mytutorial: "",
    videos: []
  },
  {
    category: "commons",
    title: "Theory of Computations",
    NPTEL: "http://www.facweb.iitkgp.ac.in/~ratna/TheoryComputation.html",
    notes: "https://drive.google.com/drive/folders/1HjkeUNahI9gO_X-T4Jfj5zkMsH571r8N?usp=drive_link",
    resources: "https://youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev&si=yZdwDLA6jONUUqnH",
    books: "drivelink",
    tutorial: "https://drive.google.com/drive/folders/1y4zlcmSIubPiufRFEEDJtbc0OhNrXGsf?usp=sharing",
    mytutorial: "",
    videos: [
      {
        "Minimization of DFA": "https://youtu.be/0XaGAkY09Wc ",
        "Minimisation of DFA using Table Filling Method": "https://youtu.be/UiXkJUTkp44 ",
        "DFA to Regular Expression": "https://youtu.be/DTSJxGuV9dM https://youtu.be/76y_heZTmhE",
        "Homomorphism": "https://youtu.be/Q-HAP2Ade8I",
        "Inverse Homomorphism": "https://youtu.be/vah_mUPXBbc?si=UlF7WLY85YYX4N4m",
        "Pumping Lemma": "https://youtu.be/dikEDuepOtI?si=Ox8vw0_19Ra3Rbzm",
        "Reduction of CFG": "https://youtu.be/EF09zxzpVbk?si=t6CDxgu7E_aCNVEs",
        "Pushdown Automata (PDA), Language accepted by PDA": "https://www.youtube.com/watch?v=fc7wLWiDNBM&list=PLxCzCOWd7aiFM9Lj5G9G_76adtyb4ef7i&index=51",
        "Construction of PDA from a CFG in GNF, alternative construction of PDA from a CFG not in GNF": "https://www.youtube.com/watch?v=G8L4w3suwU4",
        "Context-free grammars (CFG), Context-free language (CFL), Derivation Tree, Parse Tree, Leftmost and Rightmost derivations, Ambiguity in CFG": "https://www.youtube.com/watch?v=eDAOxyZkl68",
        "Simplification of CFG - Algorithms to construct a reduced grammar": "https://www.youtube.com/watch?v=EF09zxzpVbk",
        "Chomsky Normal Form (CNF), Greibach Normal Form (GNF), conversion of CFG to CNF": "https://www.youtube.com/watch?v=FNPSlnj3Vt0"
      }
    ]
  },
  {
    category: "commons",
    title: "Basic Electronics",
    NPTEL: "",
    notes: "",
    resources: "",
    books: "",
    tutorial: "",
    mytutorial: "",
    videos: []
  },
  {
    category: "commons",
    title: "English as Second Language",
    NPTEL: "",
    notes: "https://drive.google.com/drive/folders/1NctXds4QlhhIhGTqghJtJD13lcyIlxd-?usp=drive_link",
    resources: "https://drive.google.com/drive/folders/1fJgaqt9PHIC2pAWOfQ43W0_ofdL-ZcDA?usp=drive_link",
    books: "drivelink",
    tutorial: "drivelink",
    mytutorial: "",
    videos: []
  },
  {
    category: "commons",
    title: "Application of Machine Learning in Biological Systems",
    NPTEL: "",
    notes: "https://drive.google.com/drive/folders/13K5yZunT8wh7EdGr0g7msakmNHyH4e42?usp=sharing",
    resources: "https://drive.google.com/drive/folders/1OO0dRCNZffjSboS92GJCrWUdM8Z12o3t?usp=sharing",
    books: "https://drive.google.com/drive/folders/13K5yZunT8wh7EdGr0g7msakmNHyH4e42?usp=sharing",
    tutorial: "",
    mytutorial: "",
    videos: []
  }
];

// Get all courses (with optional category and search filters)
exports.getAllCourses = async (req, res) => {
  try {
    const { category, section, search, code, subjectCode } = req.query;
    const filter = {};

    const targetCategory = category || section;
    if (targetCategory) {
      filter.category = targetCategory.toLowerCase().trim();
    }

    const targetCode = (code || subjectCode || "").trim().toUpperCase();
    if (targetCode) {
      filter.code = targetCode;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { code: searchRegex },
      ];
    }

    const courses = await Course.find(filter).sort({ title: 1 });

    // Send both `subjects` and `courses` keys for maximum frontend compatibility
    res.status(200).json({
      success: true,
      count: courses.length,
      subjects: courses,
      courses: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch courses: " + error.message,
    });
  }
};

// Get single course by ID or slug/title
exports.getCourseByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;
    let course = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id);
    }

    if (!course) {
      // Try finding by subject code (e.g. ET60007)
      course = await Course.findOne({ code: id.trim().toUpperCase() });
    }

    if (!course) {
      // Try finding by slug
      course = await Course.findOne({ slug: id.toLowerCase() });
    }

    if (!course) {
      // Try finding by slugified title match or exact title (case-insensitive)
      course = await Course.findOne({
        title: { $regex: new RegExp(`^${id.replace(/-/g, " ")}$`, "i") },
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
      subject: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch course: " + error.message,
    });
  }
};

// Create a new course or update if subject code exists
exports.createCourse = async (req, res) => {
  try {
    const {
      code,
      subjectCode,
      title,
      category,
      section,
      description,
      NPTEL,
      notes,
      resources,
      books,
      tutorial,
      mytutorial,
      videos,
    } = req.body;

    const selectedCategory = (category || section || "freshers").toLowerCase().trim();
    const formattedCode = (code || subjectCode || "").trim().toUpperCase();

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    // Check if course with same subject code or title already exists
    let existingCourse = null;
    if (formattedCode) {
      existingCourse = await Course.findOne({ code: formattedCode });
    }
    if (!existingCourse) {
      existingCourse = await Course.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
        category: selectedCategory,
      });
    }

    // If already exists, update details in MongoDB directly
    if (existingCourse) {
      const updateFields = {};
      if (formattedCode) updateFields.code = formattedCode;
      if (title && title.trim()) updateFields.title = title.trim();
      if (selectedCategory) updateFields.category = selectedCategory;
      if (description !== undefined && description !== "") updateFields.description = description.trim();
      if (NPTEL !== undefined && NPTEL !== "") updateFields.NPTEL = NPTEL.trim();
      if (notes !== undefined && notes !== "") updateFields.notes = notes.trim();
      if (resources !== undefined && resources !== "") updateFields.resources = resources.trim();
      if (books !== undefined && books !== "") updateFields.books = books.trim();
      if (tutorial !== undefined && tutorial !== "") updateFields.tutorial = tutorial.trim();
      if (mytutorial !== undefined && mytutorial !== "") updateFields.mytutorial = mytutorial.trim();
      if (videos && Array.isArray(videos) && videos.length > 0) {
        updateFields.videos = [...(existingCourse.videos || []), ...videos];
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        existingCourse._id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: `Course with subject code ${updatedCourse.code || formattedCode} already exists. Details updated directly in MongoDB.`,
        course: updatedCourse,
        subject: updatedCourse,
        isUpdated: true,
      });
    }

    const newCourse = new Course({
      code: formattedCode || undefined,
      title: title.trim(),
      category: selectedCategory,
      description: description || "",
      NPTEL: NPTEL || "",
      notes: notes || "",
      resources: resources || "",
      books: books || "",
      tutorial: tutorial || "",
      mytutorial: mytutorial || "",
      videos: videos || [],
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: savedCourse,
      subject: savedCourse,
      isUpdated: false,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create course: " + error.message,
    });
  }
};

// Update an existing course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const updateData = { ...req.body };
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
    }
    if (updateData.section && !updateData.category) {
      updateData.category = updateData.section.toLowerCase();
    }

    const updatedCourse = await Course.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
      subject: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update course: " + error.message,
    });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };

    const deletedCourse = await Course.findOneAndDelete(query);
    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete course: " + error.message,
    });
  }
};

// Seed courses into MongoDB (upserting to avoid duplicates)
exports.seedCourses = async (req, res) => {
  try {
    const dataToSeed = req.body && Array.isArray(req.body.courses) && req.body.courses.length > 0
      ? req.body.courses
      : defaultSeedData;

    let upsertedCount = 0;
    for (const item of dataToSeed) {
      const slug = item.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      await Course.findOneAndUpdate(
        { title: item.title, category: item.category },
        { ...item, slug },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upsertedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${upsertedCount} courses into MongoDB`,
      count: upsertedCount,
    });
  } catch (error) {
    console.error("Error seeding courses:", error);
    res.status(500).json({
      success: false,
      error: "Failed to seed courses: " + error.message,
    });
  }
};
