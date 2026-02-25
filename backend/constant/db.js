import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path :"../constant/.env"
})

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("mongodb connected successfully");
    })
}

export default connectDB;