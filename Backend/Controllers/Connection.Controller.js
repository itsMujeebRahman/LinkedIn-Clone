import ConnectionRequest from "../Models/ConnectionRequest.Model.js";
import User from "../Models/User.Models.js";
import Notification from "../Models/Notification.Model.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const{userId} = req.params;
        const senderId = req.user._id;

        if(senderId.toString() === userId){
            return res.status(400).json({mssage: "you cant send arequest to yourself"});
        }

        if(req.user.connections.includes(userId)){
            return res.status(400).json({message: "you are already connected"});
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending",
        });

        if(existingRequest){
            return res.status(400).json({message: "a connction request already exists"});
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId,
        });

        await newRequest.save();

        res.status(201).json({message: "connection request send succssfully"});

    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: "server error"});
    }
};

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId} = req.params;
        const userId = req.user._id;

        console.log("this is requst:" , requestId);

        const request = await ConnectionRequest.findById(requestId)
        .populate("sender", "name email username")
        .populate("recipient", "name username");

        // chck if the request is for the currunt user
        if(!request){
            return res.status(403).json({message: "connection request not found"});
        }

        if (request.status !== "pending"){
            return res.status(400).json({message: "this request has already been processd"});
        }

        request.status = "accepted";
        await request.save();

        //if iam your friend then you are also my friend
        await User.findByIdAndUpdate(request.sender._id, {$addToSet: {connections: userId}});
        await User.findByIdAndUpdate(userId, {$addToSet: {connections: request.sender._id}});

        const notification = new Notification({
            recipient : request.sender._id,
            type:"connectionAccepted",
            relatedUser: userId,
        })

        await notification.save();

        res.json({message: "connection accepted successfully"});

        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

        try {
            await sendConnectionAcceptedEmail (senderEmail, senderName, recipientName, profileUrl);
        } catch (error) {
            console.error("Error in sendConnectionAcceptdEmail:", error);
        }

    } catch (error) {
        console.error("Error in acceptConnectionrequest controller:", error);
        res.status(500).json({message: "server rror"});
    }
};

export const rejectConnectionRequest = async (req, res) => {
    try {
        const {requestId}= req.params;
        const userId = req.user._id;

        console.log("this is requst:" , requestId);

        const request = await ConnectionRequest.findById(requestId);

        if(request.recipient.toString() !== userId.toString()){
            return res.status(403).json({message:" not authorised to reject this request"});
        }

        if(request.status !== "pending"){
            return res.status(400).json({message: "this request has already been procssed"});
        }

        request.status = "rejected";
        await request.save();

        res.json({message :" connection request rejected"});
    } catch (error) {
        console.error("error in rejectconnctionRequst controller:", error);
        res.status(500).json({message:"server error"});
    }
};

export const getConnectionRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await ConnectionRequest.find({recipient: userId, status:"pending"}).populate(
            "sender",
            "name username profilePicture headLine connections"
        );

        res.json(requests);
    } catch (error) {
        console.error("error in getConnectionrequests controller", error);
        res.status(500).json({message: "server error"});
    }
};

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate(
            "connections",
            "name username profilePicture headLine connections"
        );

        res.json(user.connections);
    } catch (error) {
        res.status(500).json({message:"server error"});
    }
}

export const removeConnection = async (req, res) => {
    try {
        const myId = req.user._id;
        const {userId} =req.params;

        await User.findByIdAndUpdate(myId, {$pull: {connections: userId}});
        await User.findByIdAndUpdate(userId, {$pull: {connections: myId}});

        res.json({message: "connections removed Successfully"});
    } catch (error) {
        console.error("error in removeConnection controller", error);
        res.status(500).json({message:"server error"});
    }
};

export const getConnectionStatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;
        
        const currentUser = req.user;
        if (currentUser.connections && currentUser.connections.includes(targetUserId)) {
            return res.json({status:"connected"});
        }

        const pendingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: currentUserId, recipient: targetUserId },
				{ sender: targetUserId, recipient: currentUserId },
			],
			status: "pending",
		});
        

        if(pendingRequest){
            if(pendingRequest.sender.toString() === currentUserId.toString()){
                return res.json({status: "pending"});
            }else{

                return res.json({status: "received", requestId: pendingRequest._id});
            }
        }

        //if no connection or pending request found
        res.json({status: "not_connected"});
        } catch (error) {
        console.error("Error in getConnectionStatus controller:", error);
        res.status(500).json({message:"server error"});
    }
};