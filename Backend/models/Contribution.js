const mongoose = require("mongoose");

const ContributedSubjectSchema = new mongoose.Schema({
  code: {
    type: String,
    uppercase: true,
    trim: true,
    default: "",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["freshers", "semesters", "commons"],
    default: "semesters",
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
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
  NPTEL: {
    type: String,
    default: "",
    trim: true,
  },
  videos: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
});

const ContributionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subjects: {
      type: [ContributedSubjectSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one subject contribution is required",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contribution", ContributionSchema);
