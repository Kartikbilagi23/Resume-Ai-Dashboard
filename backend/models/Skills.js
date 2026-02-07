import mongoose from "mongoose"

const SkillSchema=new mongoose.Schema({
    userId:String,
    name:String,
    level:String,
    createdAt:{type:Date,default:Date.now},
})

export default mongoose.model("Skills",SkillSchema)