import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        requried: true
    },
    description: {
        type: String,
        requried: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
})

export const productsModel = mongoose.model('Products', productsSchema)
