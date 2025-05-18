import express from "express";
import { protectRoute } from "../Middleware/Auth.Middleware.js";
import { getUserNotifications, markNotificationAsRead, deleteNotification} from "../Controllers/Notification.Controller.js";

const router = express.Router();

router.get("/",protectRoute, getUserNotifications)

router.put("/:id/read",protectRoute,markNotificationAsRead)
router.delete("/:id",protectRoute, deleteNotification)



export default router;