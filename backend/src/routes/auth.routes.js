import express from "express"
import { signup,login ,logout, updateProfile } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router();
router.post("/signup",signup)
router.post("/login", login)
// protected routes
router.post("/logout",verifyJWT, logout)
router.put("/update-profile", verifyJWT,updateProfile)
export default router