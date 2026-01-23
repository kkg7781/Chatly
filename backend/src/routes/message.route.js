import express from "express";
import { getAllContacts,getChatPartners,getMessagesByUserId, sendMessages} from "../controllers/message.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=express.Router()
//protected route

router.get("/contacts",verifyJWT,getAllContacts)
router.get("/chats", verifyJWT,getChatPartners)

router.get("/:id",verifyJWT, getMessagesByUserId)

router.post("/send/:id",verifyJWT,  
    upload.single("image"),  //multer runs first
 sendMessages)

export default router