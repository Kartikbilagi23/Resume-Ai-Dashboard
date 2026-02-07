import mongoose from 'mongoose'

const resumeAnlSchema=new mongoose.Schema({
    userId:String,
    score:String,
    missingSkills:[String],
    suggestions:[String],
    createdAt:{type:Date,default:Date.now},
})

export default mongoose.model("ResumeAnalysis",resumeAnlSchema)