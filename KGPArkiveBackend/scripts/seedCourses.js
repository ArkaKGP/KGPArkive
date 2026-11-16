require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Course = require("../models/Course");

const mongoUri = process.env.MONG_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONG_URI or MONGO_URI is missing from environment variables.");
  process.exit(1);
}

const frontendDataPath = path.resolve(__dirname, "../../KGPArkiveFrontend/public/Data");

function loadDataFromFile(fileName) {
  const filePath = path.join(frontendDataPath, fileName);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content).subjects || [];
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to read ${filePath}:`, err.message);
    }
  }
  return [];
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected successfully!");

    // Load from frontend data folder or use default
    const freshersSubjects = loadDataFromFile("freshers.json");
    const semsSubjects = loadDataFromFile("sems.json");
    const commonsSubjects = loadDataFromFile("commons.json");

    const categories = [
      { name: "freshers", subjects: freshersSubjects },
      { name: "semesters", subjects: semsSubjects },
      { name: "commons", subjects: commonsSubjects },
    ];

    let totalUpserted = 0;

    for (const cat of categories) {
      console.log(`Processing category: ${cat.name} (${cat.subjects.length} subjects)...`);
      for (const subj of cat.subjects) {
        if (!subj.title) continue;

        // Clean up empty video objects if any
        const cleanedVideos = (subj.videos || []).filter(
          (v) => v && typeof v === "object" && Object.keys(v).length > 0
        );

        const slug = subj.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");

        const courseData = {
          title: subj.title.trim(),
          slug: slug,
          category: cat.name,
          description: subj.description || "",
          NPTEL: subj.NPTEL || "",
          notes: subj.notes || "",
          resources: subj.resources || "",
          books: subj.books || "",
          tutorial: subj.tutorial || "",
          mytutorial: subj.mytutorial || "",
          videos: cleanedVideos,
        };

        await Course.findOneAndUpdate(
          { title: courseData.title, category: courseData.category },
          courseData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        totalUpserted++;
        console.log(`  ✓ Synced: [${cat.name}] ${courseData.title}`);
      }
    }

    console.log(`\n🎉 Seeding complete! Successfully synced ${totalUpserted} courses to MongoDB.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  }
}

seed();
