import config from "../config.js"
import mongoose from "mongoose"

export let carts
export let chats
export let products
export let users

switch (config.persistence) {
    case "mongo":
        const URI = config.mongo_uri

        mongoose.connect(URI)
            .then(() => {
                console.log("Conectado")
            })
            .catch((error) => {
                console.log(error)
            });

        const { default: cartsDao } = await import('./Mongo/cartsDao.mongo.js');
        const { default: chatDao } = await import('./Mongo/chatDao.mongo.js');
        const { default: productDao } = await import('./Mongo/productsDao.mongo.js');
        const { default: userDao } = await import('./Mongo/usersDao.mongo.js');

        carts = cartsDao
        chats = chatDao
        products = productDao
        users = userDao

        break;
    case "fs":
    case "memory":
}