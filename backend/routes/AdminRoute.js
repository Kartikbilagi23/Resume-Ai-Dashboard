import PDFDocument from 'pdfkit'
import User from '../models/User.js'
import Applications from '../models/Applications.js'
import auth from '../middleware/authMiddleware.js';
import Skills from '../models/Skills.js';
import express from 'express';
const router=express.Router();

router.get("/report",auth,async (req,res) => {
    try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

        const users=await User.find();
        const skills=await Skills.find();
        const applications=await Applications.find();
        const doc=new PDFDocument();
        res.setHeader("Content-Type","application/pdf");
        res.setHeader("Content-Disposition","attachment; filename=report.pdf")
        doc.pipe(res);
        // title
        doc.fontSize(20).text("SkillTrack Report",{align:'center'});
        doc.moveDown();
        // Summary
        doc.fontSize(14).text(`Total Users: ${users.length}`)
        doc.text(`Total Skills: ${skills.length}`)
        doc.text(`Total Applications: ${applications.length}`)
        doc.moveDown();
        // Users
        doc.fontSize(16).text("Users: ");
        users.forEach((u)=>{
            doc.fontSize(12).text(`-${u.name}  ${u.email}`)
        });
        doc.moveDown();
        // Applications
        doc.fontSize(16).text("Applications");
        applications.forEach((a)=>{
            doc.fontSize(12).text(`-${a.company} | ${a.status} `)
        });
        doc.end();
    } catch (error) {
        res.status(500).json({message:"Failed to generate report"})
    }
})

export default router;