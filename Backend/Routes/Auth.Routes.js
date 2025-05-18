import express from "express";
import {signup, login, logout, getCurrentuser} from '../Controllers/Auth.Controllers.js';
import { protectRoute } from "../Middleware/Auth.Middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, getCurrentuser);

export default router;