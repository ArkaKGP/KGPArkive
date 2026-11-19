const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      uppercase: true,
      trim: true,
      index: true,
      sparse: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["freshers", "semesters", "commons"],
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    NPTEL: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    resources: {
      type: String,
      default: "",
      trim: true,
    },
    books: {
      type: String,
      default: "",
      trim: true,
    },
    tutorial: {
      type: String,
      default: "",
      trim: true,
    },
    mytutorial: {
      type: String,
      default: "",
      trim: true,
    },
    videos: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from title before saving
CourseSchema.pre("save", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
  next();
});

// Virtual aliases for compatibility
CourseSchema.virtual("subjectCode").get(function () {
  return this.code;
});
CourseSchema.virtual("section").get(function () {
  return this.category;
});
CourseSchema.virtual("coursename").get(function () {
  return this.title;
});
CourseSchema.virtual("ournotes").get(function () {
  return this.notes;
});
CourseSchema.virtual("tutorials").get(function () {
  return this.tutorial;
});

module.exports = mongoose.model("Course", CourseSchema);
