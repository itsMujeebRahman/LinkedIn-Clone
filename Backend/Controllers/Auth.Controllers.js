import User from "../Models/User.Models.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../Emails/EmailHandlers.js";

export const signup = async(req, res) => {
    try {
        const {name, username, email, password} = req.body;

        if(!name || !username || !email || !password){
            return res.status(400).json({message: "All Fields are required"});
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername){
            return res.status(400).json({message: "Username already exists"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "password must be atleast 6 charecters"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email, 
            password: hashedPassword,
            username,
        });

        await user.save();

        const token = jwt.sign({ userId:user._id }, process.env.JWT_SECRET, {expiresIn:"3d"})

        res.cookie("jwt-linkedin", token, {
            httpOnly:true, //prevent XSS attack
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite:"strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ message: "user registered successfully"});

        const profileUrl = process.env.CLIENT_URL + "/profile" + user.username;

        try{
            await sendWelcomeEmail(user.email, user.name, profileUrl);
        }catch(emailError){
            console.error("Error sending Welcome Email", emailError);
        }

    } catch (error) {
        console.log("error in signup: ", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};

export const login = async (req, res) => {
    try{
        const { username, password } = req.body;

        //check if user exists
        const user = await User.findOne({ username });
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid Credntials"});
        }

        //create and send token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: "3d"});
        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.json({message:"Logged in Sucessfully"});
    } catch (error){
        console.error("Error i Login Controller", error);
        res.status(500).json({message:"Server error"})
    }
};

export const logout = (req, res) => {
    res.clearCookie("jwt-linkedin");
    res.json({message: "Logged out successfully"});
};

export const getCurrentuser = async (req, res) => {
    try{
        res.json(req.user);
    }catch(error){
        console.error("Error in getCurruntuser controller:", error);
        res.status(500).json({message: "server error"});
    }
};