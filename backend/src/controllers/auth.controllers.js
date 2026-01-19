import User from "../models/user.models.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";

export const signup=async(req,res)=>{

const{fullName, email, password}=req.body
try {
    if(!fullName || !email || !password){
       return  res.status(400).json({message : "All fields are compulsory"})
    }

    if(password.length<8){
       return  res.status(400).json({message :"the password must be atleast 8 characters long"})
    }
//email format regex check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(email)){
    return res.status(400).json({message :"Email is not in the desired format"})
}
const user= await User.findOne({email})
if(user){
    return res.status(409).json({message:"This email already exists. try using another email"})
}
// to store password:-  first hash and then store
const salt= await bcrypt.genSalt(10);
const hashedPassword= await bcrypt.hash(password, salt)
const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword
});

if(newUser){
    const savedUser= await newUser.save()
    generateToken(savedUser._id,res)
   
   return  res.status(201).json({
        id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic

    })
}
else{
    return res.status(400).json({message:"Invalid user data"})
}




} catch (error) {
      return res.status(500).json({ message: error.message });
}

}