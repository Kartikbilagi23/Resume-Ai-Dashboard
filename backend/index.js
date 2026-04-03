import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {v2 as cloudinary} from 'cloudinary';
import authRoute from "./routes/AuthRoutes.js";
import skillroutes from "./routes/skillRoutes.js";
import applicationRoutes from "./routes/ApplicationRoute.js";
import dashboardRoutes from "./routes/DashBoardRoute.js";
import resumeRoutes from "./routes/Resumeroute.js"
import aiHistoryRoutes from "./routes/Aihistory.js";
import paymentroutes from './routes/payment.js'
import auth from "./middleware/authMiddleware.js";
import AdminRoute from './routes/AdminRoute.js'
import profileRoute from './routes/ProfileRoute.js'


dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const app = express();
app.use(express.json());
app.use(cors());

// public
app.use("/api/auth", authRoute);
app.use("/api/admin",AdminRoute);

// protected
app.use("/api/skills", auth, skillroutes);
app.use("/api/profile",auth,profileRoute);
app.use("/api/applications", auth, applicationRoutes);
app.use("/api/dashboard", auth, dashboardRoutes);
app.use("/api/resume", auth, resumeRoutes);
app.use("/api/ai-history", auth, aiHistoryRoutes);
app.use('/api/payment',paymentroutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
