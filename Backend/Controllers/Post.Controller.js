import cloudinary from "../Lib/Cloudinary.js";
import postMessage from "../Models/Post.Model.js";
import Notification from "../Models/Notification.Model.js";
import { sendCommentNotificationEmail } from "../Emails/EmailHandlers.js";
import Post from "../Models/Post.Model.js";

export const getFeedPosts = async (req, res) => {
    try{
        const posts = await postMessage.find({author:{$in: [...req.user.connections, req.user._id]}})
        .populate("author", "name username profilePicture headLine")
        .populate("comments.user", "name profilePicture")
        .sort({ createdAt: -1});

        res.status(200).json(posts);
    }catch(error){
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({message: "server error"});
    }
};

export const createPost = async (req, res) => {
    try{
        const {content, image} = req.body;
        let newPost;

        if(image){
            const imgResult = await cloudinary.uploader.upload(image)
            newPost = new postMessage({
                author : req.user._id,
                content,
                image:imgResult.secure_url
            })
        }else{
            newPost = new postMessage({
                author : req.user._id,
                content,
            })
        }
        await newPost.save();
        res.status(201).json(newPost);
    }catch(error){
        console.error("Error in createPost controller:", error);
        res.status(500).json({message: "server error"});
    }
}

export const deletePost = async (req, res) => {
    try{
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.ststus(404).json({message: "post not found"});
        }

        //check if the current user is the author of the post
        if(post.author.toString() !== userId.toString()){
            return res.status(403).json({message: "you are not authorised to delete this post"})
        }

        //delete the image from cloudinary as well 
        if(post.image){
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({mesage:"post deletd successfully"})

    }catch(error){
        console.log("error in delete post controller" , error.message);
        res.status(500).json({message: "Server error"});
    }
}

export const getPostById = async (req, res) => {
    try{
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate("author", "name username profilPicture headLine")
        .populate("comments.user", "name profilePicture username headLine");

        res.status(200).json(post);
    }catch(error){
        console.error("Error in getPostById controller:", error);
        res.status(500).json({message: "server error"});
    }
}

export const createComments = async (req, res) => {
    try{
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(
            postId, 
            {
            $push: {comments:{user:req.user._id, content}},
            },
            {new: true}
        ).populate("author", "name email username headLine profilePicture");

        //create a notification if the comment owner is not the post owner
        if(post.author._id.toString() !== req.user._id.toString()){
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })

            await newNotification.save();
            
            try{
                const postUrl = process.env.CLIENT_URL + "/post/" + postId;
                await sendCommentNotificationEmail(
                    post.author.email, 
                    post.author.name,
                    req.user.name, 
                    postUrl,
                    content
                );
            }catch(error){

            }
        }

        res.status(200).json(post)

    }catch(error){
        console.error("Error in createComment controller:", error);
        res.status(500).json({message: "server error"});
    }
}

export const deleteComments = async (req, res) => {
    try{
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
      
          // Remove the comment with _id === content
          post.comments = post.comments.filter(
            (comment) => comment._id.toString() !== content
          );
      
          await post.save();
        
        res.status(200).json({mesage:"comment deleted successfully"})

    }catch(error){
        console.log("error in delete comment controller" , error.message);
        res.status(500).json({message: "Server error"});
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;
        
        if(post.likes.includes(userId)){
            //unlike the post
            post.likes = post.likes.filter(id => id.toString()!== userId.toString());
        } else {
            //like the post
            post.likes.push(userId)
            //create a notification if the post owner is not the user who liked
            if(post.author.toString() !== userId.toString()){
                const newNotification = Notification({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId,
                });

                await newNotification.save();
            }
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in likepost controller:", error);
        res.status(500).json({message: "server error"});
    }
}