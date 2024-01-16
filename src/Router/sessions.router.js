import { Router } from "express";
import { hashData, compareData } from "../app.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import userDTO from "../DTO/userDTO.js";
import passport from "passport";
import { logger } from "../Fuctions/logger.js";

const router = Router();

router.get('/getUserName', async (req, res) => {
    try {
        const user = req.session.user;
        const userAlreadyLogged = user.first_name;
        logger.info(`Nombre de usuario obtenido exitosamente: ${userAlreadyLogged}`);
        return res.status(200).json({ message: "Success", username: userAlreadyLogged });
    } catch (error) {
        logger.error(`Error en la ruta /getUserName: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.post('/signup', (req, res, next) => {
    passport.authenticate('signup', (err, user, info) => {
        if (err) {
            logger.error(`Error en la ruta /signup: ${error.message}`);
            CustomError.generateError(ErrorsMessage.ERROR_SYSTEM, 500, ErrorsName.ERROR_SYSTEM);
        }
        if (!user) {
            if (info.state === "incompleted") {
                logger.error('Datos faltantes al intentar agregar un usuario');
                CustomError.generateError(ErrorsMessage.DATA_MISSING, 400, ErrorsName.DATA_MISSING);
            } else if (info.state === "registered") {
                logger.error('Intento de registrar un usuario con un email ya registrado');
                CustomError.generateError(ErrorsMessage.USER_ALREADY_LOGGED, 400, ErrorsName.USER_ALREADY_LOGGED);
            }
        }

        logger.info(`El email ${req.user.email} se ha registrado`);
        return res.status(200).json({ message: 'Usuario creado', user, state: 'alreadysign' });
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            logger.error(`Error en la ruta /login: ${error.message}`);
            return res.status(500).json({ message: 'Error interno del servidor', state: 'error' });
        }
        if (!user) {
            if (info.state === "noregistered") {
                logger.error('Intento de inicio de sesión con un email no registrado');
                CustomError.generateError(ErrorsMessage.USER_NOT_LOGGED, 401, ErrorsName.USER_NOT_LOGGED);
            } else if (info.state === "nopassword") {
                logger.error('Intento de inicio de sesión con contraseña incorrecta');
                CustomError.generateError(ErrorsMessage.PASSWORD_NOT_ACCEPTED, 401, ErrorsName.PASSWORD_NOT_ACCEPTED);
            }
        }

        res.cookie('email', req.user.email);
        logger.info(`El email ${req.user.email} se ha logeado`);
        return res.status(200).json({ message: 'Usted ha ingresado con éxito', state: 'login', user: req.body, name: user.first_name });
    })(req, res, next);
});

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/callback', 
  passport.authenticate('github'), (req, res) => {
    req.session.user = req.user;
    res.cookie('email', req.user.email);
    res.redirect('http://localhost:8080/realtimeproducts')
    logger.info(`El email ${req.user.email} ha iniciado sesión`);
  });

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.cookie('email', req.user.email);
    res.redirect('http://localhost:8080/realtimeproducts')
    logger.info(`El email ${req.user.email} ha iniciado sesión`);
  });

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            CustomError.generateError(ErrorsMessage.USER_NOT_LOGOUT, 500, ErrorsName.USER_NOT_LOGOUT);
        }

        logger.info('Usuario ha cerrado sesión exitosamente');
        return res.status(200).json({ message: 'Se ha deslogeado con exito', state: 'logout' });
    });
});

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
      const userData = new userDTO(req.user);
      logger.info('Información de usuario obtenida exitosamente');
      res.json({ user: userData });
    } else {
      logger.error('Error en la ruta /current: Usuario no loggeado');
      CustomError.generateError(ErrorsMessage.USER_NOT_LOGGED, 401, ErrorsName.USER_NOT_LOGGED);
    }
});

export default router;
