import express from "express"
import  dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from "./db/index.js";
import cookieParser from "cookie-parser"

dotenv.config();

const app=express();
const PORT=3000 || process.env.PORT
app.use(express.json()) //middleware to convert incoming json data to javaScript object as express cant understand json
app.use(cookieParser())
app.use("/auth", authRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    
    

})