
import User from "../models/User.js"
import { generateToken } from "../utils/utils.js"
import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcryptjs'
export const signup=async (req,res)=>{
    const {email,fullName,password,bio}=req.body
    try {
        if(!fullName || !email || !password || !bio)
        {
            return res.status(400).json({success:false,message:"Details Missing"})
        }

        const existingUser=await User.aggregate([
            {$match :{email}},
            {$project :{password:0}}
        ])
         if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Account Already Exists",
      });
    }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=await User.create({email,fullName,password:hashedPassword,bio})
        const token=generateToken(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account Created Successfully"})
        
    } catch (error) {
        console.log("error",error)
        return res.json(500).json({error:true ,message:"Error in Signing Up"})
        
    }

}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(userData._id);

    return res.status(200).json({
      success: true,
      userData,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Logging in",
    });
  }
};

export const updateProfile=async (req,res)=>{
    try {
        const {profilePic,bio,fullName}=req.body
        const userId=req.user._id
        let updateProfile;
        if (!profilePic)
        {
            await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})

        }
        else
        {
            const upload=await cloudinary.uploader.upload(profilePic)
            updateProfile=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
        }
        res.json({success:false,user:updateProfile})
    } catch (error) {
        console.log(error.message,"Error in Updating Profile")
        return res.status(500).json({error:true,message:"Error in Updating Profile"})
        
    }

}