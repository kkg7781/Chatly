import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";

//getAllconatcts controller
// Fetch all users except the currently logged-in user
// - Used to show contacts list in chat sidebar
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
//for message controller
// - Fetch all chat messages between
//   logged-in user and selected user
// - Used when opening a chat window

export const getMessagesByUserId=async(req,res)=>{
    try {
        const myId=req.user._id //loggedIn user id
        const {id:userToChatId}=req.params // extract user to whom i have to send message from url rename it for clarity

        const messages=await Message.find({
            $or :[
                { senderId:myId,  receiverId:userToChatId}, // 1. I sent message to selected user OR
   
    
                {  senderId:userToChatId, receiverId:myId } // // 2. Selected user sent message to me
            ]
        })
        return res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessageByUserId",error.message)
    res.status(500).json({message:"Internal Server Error"})
    }
}
//  for send message
 export const sendMessages=async(req,res)=>{
   try {
     const {text}=req.body
     const image=req.file  // when using multer remember that image will be there in req.file not req.body
     const { receiverId}=req.params
     const senderId=req.user._id

     //few checks added
     if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }
     let imageUrl=null
     if(image){
 const uploadResponse =await cloudinary.uploader.upload(image.path,
        {
          folder: "chat-images"
        });
        imageUrl = uploadResponse.secure_url;
     }

     //create a new message
     const newMessage= await Message.create(
        {senderId,
            receiverId,
            text,
            image:imageUrl
        }
     )
     const receiverSocketId=getReceiverSocketId(receiverId);
     if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
     }
     return res.status(201).json(newMessage);
   } catch (error) {
    console.log("Error in sendMessages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    
   }
 }

 
export const getChatPartners = async(req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};