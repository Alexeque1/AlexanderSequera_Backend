import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: [] 
      }
})

export const cartsModels = mongoose.model('carts', productsSchema)