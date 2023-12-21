import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        requried: true
    },
    message: {
        type: String,
        default: ""
    }
})

export const messagesModel = mongoose.model('Messages', messageSchema)