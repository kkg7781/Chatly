import express from "express"
import  dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser"

dotenv.config();

const app=express();
const PORT= process.env.PORT || 3000
app.use(express.json()) //middleware to convert incoming json data to javaScript object as express cant understand json
app.use(cookieParser())
//console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
app.use("/auth", authRoutes)
app.use("/messages", messageRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    
    

})