import express from "express";
import Skills from "../models/Skills.js";
import Applications from "../models/Applications.js";
import ResumeScore from "../models/ResumeAnalysis.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.userId; 

  try {
    const skillsCount = await Skills.countDocuments({ userId });
    const applications = await Applications.find({ userId });
    const resume = await ResumeScore.findOne({ userId });

    const statusCount = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      statusCount[app.status]++;
    });

    res.json({
      skillsCount,
      applicationsCount: applications.length,
      resumeScore: resume?.score ?? null,
      subscription: "Free",
      applicationsChart: Object.entries(statusCount).map(
        ([name, count]) => ({ name, count })
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
});

export default router;
