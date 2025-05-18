import express from "express";
import { protectRoute } from '../Middleware/Auth.Middleware.js'
import { getSuggestedConnections, getPublicProfile, updateProfile  } from "../Controllers/User.Controllers.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;
