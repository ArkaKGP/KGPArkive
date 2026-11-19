require('dotenv').config();

console.log("MONG_URI from .env:", process.env.MONG_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/auth'); 
const mailRoutes = require('./routes/mail');
const courseRoutes = require('./routes/courseRoutes');
const contributionRoutes = require('./routes/contributionRoutes');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true, // Dynamically allows Vercel frontend, localhost, etc.
    credentials: true,
  })
);

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', mailRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contributions', contributionRoutes);


mongoose
  .connect(process.env.MONG_URI || process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });
