import mongoose from "mongoose";

// 2 make schema for the data to be stored in db

const Schema = new mongoose.Schema({
	 sessionId: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    images: {
        type: [String], // base64 strings or URLs
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


//3 make model using schema

const ClipModel =  mongoose.model.hostclip || mongoose.model('hostclip', Schema);

export default ClipModel;