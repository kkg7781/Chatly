import express from "express"
import { signup,login ,logout, updateProfile } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
const router=express.Router();
router.use(arcjetProtection)
router.post("/signup",signup)
router.post("/login", arcjetProtection,login)
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