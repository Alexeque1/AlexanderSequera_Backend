import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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
    owner: {
        type: String,
        default: "ADMIN"
    },
})

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model('Products', productsSchema)
