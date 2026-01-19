import mongoose from "mongoose"
const userSchema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            trim:true,
        },
        
            email:{
                type:String,
                required:true,
                unique:true,
                trim:true,

            },
            password:{
                type:String,
                required:true,
                minLength:8,

            },
            profilePic:{
                type:String,
                default:""
            }

        

    },{timestamps:true}  // helps to add createdAt and updatedAt field
)
const User=mongoose.model("User", userSchema)
export default User