import express from 'express'
import auth from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import Skills from '../models/Skills.js'
import upload from '../middleware/upload.js'
import cloudinary from '../configs/cloudinary.js'
import Applications from '../models/Applications.js'
import bcrypt from 'bcrypt'

const router=express.Router()

router.get("/me",auth,async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.put("/update",auth,async (req,res) => {
    try {
        const {name}=req.body;
        if(!name){
            return res.status(400).json({message:"Name required"}
            )
        }
        const user=await User.findByIdAndUpdate(
            req.userId,
            {name},
            {new:true}
        ).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"Update Failed"});
    }
})
router.get("/stats",auth,async (req,res) => {
    try {
        const skills=await Skills.countDocuments({userId:req.userId});
        const application=await Applications.countDocuments({userId:req.userId})
        res.json({
            skills,
            application,
        })
    } catch (error) {
        res.status(500).json({message:"Failed to fetch stats"});
    }
})
router.put("/change-password",auth,async (req,res) => {
    try {
        const {oldpassword,newPassword}=req.body;
        if(!oldpassword||!newPassword){
            return res.status(400).json({message:"All fields required"})
        }
        const user=await User.findById(req.userId);
        const match=await bcrypt.compare(oldpassword,user.password);
        if(!match){
            return res.status(400).json({message:"Wrong password"})
        }
        user.password=await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({message:"Password updated successfully"})
    } catch (error) {
        res.status(500).json({message:"Password update failed"})
    }
})

router.post("/upload-avatar", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });
    await User.findByIdAndUpdate(req.userId,{
        avatar:result.secure_url,
    })
const updatedUser = await User.findById(req.userId);
res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;


