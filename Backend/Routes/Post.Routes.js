import express from "express";
import { protectRoute } from "../Middleware/Auth.Middleware.js";
import { createPost, getFeedPosts, deletePost, getPostById, createComments, likePost, deleteComments} from "../Controllers/Post.Controller.js";

const router = express.Router();

router.get("/",protectRoute,getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id",protectRoute, getPostById);
router.post("/:id/comments",protectRoute, createComments);
router.delete("/:id/comments",protectRoute, deleteComments);
router.post("/:id/likes",protectRoute, likePost);




export default router;



