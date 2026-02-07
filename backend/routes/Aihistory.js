import express from "express";
import Aihistory from "../models/Aihistory.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const history = await Aihistory
      .find({ userId: req.userid })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(history);
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ message: "Failed to fetch AI history" });
  }
});

export default router;
