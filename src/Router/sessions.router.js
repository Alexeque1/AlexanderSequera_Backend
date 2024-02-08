import { Router } from "express";
import { hashData, compareData } from "../app.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import { userController } from "../Controllers/userController.js";
import userDTO from "../DTO/userDTO.js";
import passport from "passport";
import { logger } from "../Fuctions/logger.js";
import { isTokenValid } from "../Fuctions/utils.js";
import { generateToken } from "../Fuctions/jwt.js";

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
        try {

            console.log("Info ==> " + JSON.stringify(info))

            if (err) {
                logger.error(`Error en la ruta /signup: ${err.message}`);
                CustomError.generateError(ErrorsMessage.ERROR_SYSTEM, 500, ErrorsName.ERROR_SYSTEM);
            }
            if (!user) {
                if (info.message === "Missing credentials") {
                    logger.error('Datos faltantes al intentar agregar un usuario');
                    return res.status(400).json({ message: 'Datos faltantes al intentar agregar un usuario', error: 'DATA_MISSING' });
                } else if (info.state === "registered") {
                    logger.error('Intento de registrar un usuario con un email ya registrado');
                    return res.status(400).json({ message: 'Intento de registrar un usuario con un email ya registrado', error: 'USER_ALREADY_LOGGED' });
                }
            }

            logger.info(`El email se ha registrado`);
            return res.status(200).json({ message: 'Usuario creado', user, state: 'alreadysign' });
        } catch (error) {
            return res.status(error.code || 500).json({ error: error.message, name: error.name });
        }
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            logger.error(`Error en la ruta /login: ${err.message}`);
            return next(err); 
        }

        if (!user) {
            let errorInfo;

            if (info.state === "noregistered") {
                logger.error('Intento de inicio de sesión con un email no registrado');
                return res.status(401).json({ message: 'Email no registrado', state: 'error', errorCode: "USER_NOT_LOGGED" });
            } else if (info.state === "nopassword") {
                logger.error('Intento de inicio de sesión con contraseña incorrecta');
                return res.status(401).json({ message: 'Contraseña incorrecta', state: 'error', errorCode: "PASSWORD_NOT_ACCEPTED" });
            }

            return res.status(401).json(errorInfo);
        }
        
        const userName = user.first_name; 
        const token = generateToken({ userName });
    
        req.session.user = user; 
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.cookie('email', user.email);
        console.log(req.session.user)

        logger.info(`El email ${user.email} se ha logeado`);
        return res.status(200).json({ message: 'Usted ha ingresado con éxito', state: 'login', user: req.body, name: user.first_name });
    })(req, res, next);
});

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

  router.get('/callback', 
  passport.authenticate('github'), (req, res) => {
    const userName = req.user.first_name; 
    const token = generateToken({ userName });

    req.session.user = req.user;
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.cookie('email', req.user.email);

    res.redirect('http://localhost:8080/realtimeproducts');
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
    const user = req.session.user
    try {
        if (user) { 
            const userData = new userDTO(user);
            logger.info('Información de usuario obtenida exitosamente');
            res.status(200).json({ user: userData });
        } else {
            logger.error('Error en la ruta /current: Usuario no loggeado');
            return res.status(401).json({ error: 'Usuario no loggeado' });
        }
    } catch (error) {
        return res.status(error.code || 500).json({ error: error.message, name: error.name });
    }
});

router.post('/resetpassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const token = req.cookies.token;

        const findUser = await userController.findByEmail(email);

        if (!findUser) {
            return res.status(400).json({ message: 'El correo es incorrecto o no existe.', state: "noEmail", error: "Error" });
        }

        if (!token) {
            return res.redirect('http://localhost:8080/login');
        }

        const resetToken = JSON.parse(token);
        const createdAt = resetToken.createdAt;

        if (!isTokenValid(token, createdAt)) {
            return res.redirect('http://localhost:8080/login');
        }

        console.log(findUser)
        
        let passwordMatch

        if (findUser.fromGithub === true || findUser.fromGoogle === true) {
            return res.status(401).json({ message: 'Usted se ha logeado con Github o Google.',  state: "loginservice", error: "Error"});
        } else {
            passwordMatch = await compareData(newPassword, findUser.password);
        }

        if (passwordMatch) {
            return res.status(401).json({ message: 'La contraseña no puede ser igual a la anterior.',  state: "noPassword", error: "Error"});
        }

        const hashPassword = await hashData(newPassword)
        findUser.password = hashPassword
        await findUser.save();

        res.clearCookie('token');

        return res.status(200).json({ message: 'Contraseña restablecida con éxito.', state: "resetpas" });
    } catch (error) {
        logger.error(`Error en la ruta /resetpassword: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;
