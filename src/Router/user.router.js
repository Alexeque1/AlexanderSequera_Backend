import { Router } from "express";
import { userController } from "../Controllers/userController.js";

const router = Router();

router.put('/premium/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await userController.findUserById(id);
  
      if (!usuario) {
        return res.status(404).send('Usuario no encontrado.');
      }
  
      // Cambiar el rol del usuario entre "user" y "premium"
      usuario.role = usuario.role === 'USER' ? 'PREMIUM' : 'USER';
      await usuario.save();
  
      res.json({ message: `Rol del usuario ${usuario.email} actualizado a ${usuario.role}.` });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cambiar el rol del usuario.');
    }
  });

export default router;
