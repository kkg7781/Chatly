import express from "express"
import  dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js";

dotenv.config();

//const app=express();
const PORT= process.env.PORT || 3000
app.use(express.json({limit :"5mb"})) //middleware to convert incoming json data to javaScript object as express cant understand json
app.use(cors({origin:process.env.CLIENT_URL, credentials:true}))
app.use(cookieParser())
//console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
app.use("/auth", authRoutes)
app.use("/messages", messageRoutes)
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    
    

})