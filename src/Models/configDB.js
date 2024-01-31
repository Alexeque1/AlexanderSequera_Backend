import mongoose from "mongoose";

const URI = "mongodb+srv://alexeque1:alex15981478sequera@ecommerce.dvv9u6y.mongodb.net/CoderHouse_backend?retryWrites=true&w=majority"

mongoose.connect(URI)
.then(() => {
    console.log("Conectado")
})
.catch((error) => {
    console.log(error)
})

