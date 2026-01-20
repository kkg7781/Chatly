import express from "express"
import { signup,login ,logout, updateProfile } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
const router=express.Router();
router.post("/signup",signup)
router.post("/login", login)
// protected routes
router.post("/logout",verifyJWT, logout)
router.put(
  "/profile",
  verifyJWT,
  upload.single("profilePic"),
  updateProfile
);
router.get("/check", verifyJWT,(req,res)=>{return res.status(200).json(req.user)})

export default router