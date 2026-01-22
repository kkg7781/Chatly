import Message from "../models/message.models.js";
import User from "../models/user.models.js";

export const getAllContacts=async(req,res)=>{
try {
    const loggedInUser= req.user._id
    const filteredUsers=await User.find({_id:{$ne:loggedInUser}}).select("-password")
    res.status(200).json(filteredUsers);

} catch (error) {
    console.log("Error in getContacts",error.message)
    res.status(500).json({message:"Internal Server Error"})
    
}

}