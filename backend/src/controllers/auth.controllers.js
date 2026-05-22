import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are compulsory" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "the password must be atleast 8 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Email is not in the desired format" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ message: "This email already exists. try using another email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id, res);

    return res.status(201).json({
      token,
      id: savedUser._id,
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password field can't be empty" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id, res);

    return res.status(200).json({
      token,
      id: user._id,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Logged Out Successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chatly/profile_pics",
      resource_type: "image",
    });

    fs.unlinkSync(req.file.path);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      id: updatedUser._id,
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Failed to update profile picture" });
  }
};