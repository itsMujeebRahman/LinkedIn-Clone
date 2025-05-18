import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/Auth.Routes.js";
import userRoutes from "./Routes/User.Routes.js";
import postRoutes from "./Routes/Post.Routes.js";
import notificationRoutes from "./Routes/Notification.Routes.js"
import connectionRoutes from "./Routes/ConnectionRoutes.js"
import cors from 'cors';


import { connectDB } from "./Lib/DB.js";

dotenv.config(); //calling the dotenv.config to read the value from .env file
const app = express();
const PORT = process.env.PORT || 5000; // if the port is not available then take the port number 5000 by default


app.use(
    cors({
        origin:"http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json({limit:"5mb"})); 
app.use(cookieParser());

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/posts/", postRoutes);
app.use("/api/v1/notifications/", notificationRoutes);
app.use("/api/v1/connections/", connectionRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});

