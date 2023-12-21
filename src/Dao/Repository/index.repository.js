import { carts, products, chats, users } from "../factory";
import cartsRepository from "./cartRepository";
import chatsRepository from "./chatRepository";
import productsRepository from "./productRepository";
import usersRepository from "./userRepository";

export const cartService = new cartsRepository(new carts())
export const chatService = new chatsRepository(new chats())
export const productService = new productsRepository(new products())
export const userService = new usersRepository(new users())