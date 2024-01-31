import jwt from "jsonwebtoken";
import config from "../config.js";

export const generateToken = (user) => {
    return jwt.sign(user, config.jwt_key, { expiresIn: '1h' })
  }
  