import mongoose from "mongoose";

//1 make connext db function

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://hostclip:yocQEk0OQI4jZNXf@cluster0.ynvgbjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("DB connected");

}