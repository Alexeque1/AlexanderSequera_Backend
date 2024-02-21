import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        requried: true
    },
    last_name: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        requried: true,
        unique: true
    },
    password: {
        type: String,
        requried: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER", "PREMIUM"],
        default: "USER"
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts",
    },
    fromGithub: {
        type: Boolean,
        default: false,
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
    documents: [
        {
            name: {
                type: String,
                default: "Unknown"
            },
            document: {
                type: String,
                required: true
            }
        }
    ],
    last_conection: {
        type: Date, 
        default: Date.now 
    }
})

export const usersModel = mongoose.model('Users', userSchema)