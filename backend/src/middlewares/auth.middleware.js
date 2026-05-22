import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyJWT = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    // fallback: read token from Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in authentication middleware", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};