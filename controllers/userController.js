import cloudinary from "../config/cloudinary"
import User from "../models/User"
import { generateToken } from "../utils/utils"

export const signup=async (req,res)=>{
    const {email,fullName,password,bio}=req.body
    try {
        if(!fullName || !email || !password || !bio)
        {
            return res.status(400).json({success:false,message:"Details Missing"})
        }
        const user=User.findOne({email})
        if(user)
        {
            return res.json({success:false,message:"Account Already Exists"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=await User.create({email,fullName,password:hashedPassword,bio})
        const token=generateToken(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account Created Successfully"})
        
    } catch (error) {
        return res.json(500).json({error:true ,message:"Error in Signing Up"})
        
    }

}
export const login=async (req,res)=>{
    try {
        const {email,password}=req.body
        const userData=await User.findOne({email})
        const isPasswordCorrect=await bcrypt.compare(process,userData.password)
        if(!isPasswordCorrect)
        {
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const token=generateToken(userData._id)
        return res.json({success:true,userData,token,message:"Login Successful"})
    } catch (error) {
        return res.status(500).json({error:true,message:"Error in Logging in"})
    }

}
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
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
        }
        res.json({success:false,user:updatedUser})
    } catch (error) {
        console.log(error.message,"Error in Updating Profile")
        return res.status(500).json({error:true,message:"Error in Updating Profile"})
        
    }

}