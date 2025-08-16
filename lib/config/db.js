import mongoose from "mongoose";

//1 make connext db function

export const connectDB = async () => {
    await mongoose.connect("");
    console.log("DB connected");

}
