import mongoose from "mongoose";

const aiHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: Number,
    feedback: [String],
  },
  { timestamps: true }
);


export default mongoose.model("Aihistory", aiHistorySchema);
