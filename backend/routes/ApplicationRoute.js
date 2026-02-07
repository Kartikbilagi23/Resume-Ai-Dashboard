import express from "express";
import Applications from "../models/Applications.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET applications for logged-in user */
router.get("/", auth, async (req, res) => {
  const apps = await Applications.find({ userId: req.userId });
  res.json(apps);
});

/* ADD application */
router.post("/", auth, async (req, res) => {
  const app = await Applications.create({
    userId: req.userId,
    company: req.body.company,
    role: req.body.role,
    status: req.body.status,
  });
  res.json(app);
});

/* UPDATE */
router.put("/:id", auth, async (req, res) => {
  const updated = await Applications.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE */
router.delete("/:id", auth, async (req, res) => {
  await Applications.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  res.json({ message: "Deleted" });
});

export default router;
