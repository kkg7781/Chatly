import express from "express";
import { getAllContacts } from "../controllers/message.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router()
//protected route
//router.get("/chats", getChatPatrners)
router.get("/contacts",verifyJWT,getAllContacts)
//router.get("/:id", getMessagesByUserId)
//router.post("/send/:id", sendMessages)
export default router