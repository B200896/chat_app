import mongoose from "mongoose";
const connectDb=async ()=>{
    try {

        console.log("Mongodb Connected")
        mongoose.connection.on('connected',()=>console.log("Database Connected"))
        await mongoose.connect(process.env.MONGODB_URI)        
    } catch (error) {
        console.log("Error",error.message)
          process.exit(1)
        
    }
}
export default connectDb