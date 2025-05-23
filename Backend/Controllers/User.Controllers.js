import cloudinary from "../Lib/Cloudinary.js";
import User from "../Models/User.Models.js";

export const getSuggestedConnections = async (req, res) => {
    try{
        const currentUser = await User.findById(req.user._id).select("connections");

        //find users who are not already conncted, and also do not recomment our own peofile
        const suggestedUsers = await User.find({
            _id:{
                $ne: req.user._id, 
                $nin: currentUser.connections,
            }
        })
        .select("name username profilePicture headLine")
        .limit(6);

        res.json(suggestedUsers);
    }catch(error){
        console.error("Error in getSuggestedConnections controller:", error);
        res.status(500).json({message: "srver error"});
    }
}

export const getPublicProfile = async (req, res) => {
    try{
        const user = await User.findOne({username: req.params.username}).select("-password");

        if(!user){
            return res.status(404).json({message: "user not found"});
        }
        res.json(user);
    }catch(error){
        console.error("Error in getPublicProfile controller:", error);
        res.status(500).json({message: "Server error"});
    }
};

export const updateProfile = async (req, res) => {
    try{
        const allowedFields = [
            "name",
            "username",
            "headLine",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ];

        const updatedData = {};

        for (const field of allowedFields){
            if(req.body[field]){
                updatedData[field] = req.body[field];
            }
        }

        if(req.body.profilPicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updatedData.profilPicture = result.secure_url;
        }

        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg)
            updatedData.bannerImg = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");
        res.json(user); 
    }catch(error){
        console.error("Error in updatedProfile controller:", error);
        res.status(500).json({message: "Server error"});
    }
}