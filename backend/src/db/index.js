import mongoose from "mongoose"

export const connectDB=async()=>{
    try {
        const connectionInstance= await mongoose.connect(process.env.MONGODB_URI);
       console.log(`MONGO DB connected !! DB host :${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("An error occured ", error.message );
        process.exit(1);

    }
}