import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
      },
      _id: false,
    }
  ]
})

export const cartsModels = mongoose.model('carts', cartsSchema)