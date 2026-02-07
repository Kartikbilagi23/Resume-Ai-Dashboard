import express from "express";
import Skills from "../models/Skills.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE SKILL */
router.post("/", auth, async (req, res) => {
  try {
    const skill = await Skills.create({
      ...req.body,
      userId: req.userId,
    });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Skill creation failed" });
  }
});
//  UPDATE SKILL
router.put("/:id", auth, async (req, res) => {
  const updated = await Skills.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});


/* GET USER SKILLS */
router.get("/", auth, async (req, res) => {
  try {
    const skills = await Skills.find({ userId: req.userId });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* DELETE SKILL */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Skills.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // 🔒 ownership check
    });
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
