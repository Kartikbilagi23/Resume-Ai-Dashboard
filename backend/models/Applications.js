import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: String,
  role: String,
  status: String,
});


export default mongoose.model("Applications", applicationSchema);
