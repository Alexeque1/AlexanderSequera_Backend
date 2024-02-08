import { validateToken } from "../Fuctions/jwt.js";

export const verifyToken = (req, res, next) => {
    const info = req.cookies.token;
    console.log(info)
  
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
  
    try {
      const decoded = validateToken(token);
      req.user = decoded;
      console.log("El token fue validado")
  
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token no válido' });
    }
  };
  