import User from "../models/User"

export const protectedRoute=async (req,res,next)=>{
    try {
        const token=req.headers.token
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decoded.userId).select("-password")
        if(!user)
        {
            return res.json({success:false,mmessage:"User not Found"})
            
        }
        req.user=user
        next()
    } catch (error) {
        console.log("Error",error.message)
        return res.status(500).json({error:true,message:error.message})
    }
}
export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user})

} 