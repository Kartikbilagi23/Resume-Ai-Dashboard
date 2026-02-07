import express from "express";
import OpenAI from "openai";
import Aihistory from "../models/Aihistory.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing inputs" });
    }

    const prompt = `
Return ONLY valid JSON:
{
  "score": number,
  "missingSkills": string[],
  "suggestions": string[]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content;
    const match = raw.match(/\{[\s\S]*\}/);//regx expression
    if (!match) throw new Error("Invalid AI response");

    const airesult = JSON.parse(match[0]);

    await Aihistory.create({
      userId: req.user.id,
      score: airesult.score,
      missingSkills: airesult.missingSkills,
      suggestions: airesult.suggestions,
    });

    res.json(airesult);
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
