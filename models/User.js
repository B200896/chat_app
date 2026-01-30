import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    fullName:{type:String,required:true,unique:true},
    password:{type:String ,required:true,minLength:6},
    profilePic:{type:String,default:""},
    bio:{type:String},

},{timestamps:true})
userSchema.index({ email: 1, fullName: 1 });
// async function testQuery() {
//   try {
//     const result = await User.find({ fullName: "test@example.com" }).explain("executionStats");
//     console.log(result);
//   } catch (err) {
//     console.error(err);
//   }
// }
// testQuery()
const User=mongoose.model("User",userSchema)
export default User