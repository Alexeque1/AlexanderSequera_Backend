import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    user: {
        type: String,
        requried: true
    },
    message: {
        type: String,
        default: ""
    }
})

export const productsModel = mongoose.model('Messages', productsSchema)