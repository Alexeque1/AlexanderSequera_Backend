import express from 'express';
import productsRouter from './Router/products.router.js';
import cartRouter from './Router/cart.router.js';
import viewsRouter from './Router/views.router.js';
import chatRouter from './Router/chat.router.js';
import sessionsRouter from './Router/sessions.router.js';
import mailRouter from './Router/mail.router.js';
import userRouter from './Router/user.router.js';
import MockingRouter from './Router/mocking.router.js';
import LoggerTest from './Router/loggertest.router.js';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { Server } from 'socket.io';
import "./Models/configDB.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcrypt';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import config from './config.js';
import './passportConfig.js';
import nodemailer from 'nodemailer';
import { errorMiddleware } from './middlewares/errors.middleware.js';
import { logger } from "./Fuctions/logger.js";
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from "swagger-jsdoc";

const app = express();
const SECRET_KEY = config.secret_key;
const PORT = config.port || 8080

// Dirname
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export default __dirname

// Session
app.use(session({
  store: new MongoStore({
    mongoUrl: config.port
  }),
  secret: "secretSession",
  cookie: { maxAge: 1800000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// JWT
export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  return token;
};
 
// Handlebars
const options = {
  allowProtoMethodsByDefault: true,
  allowProtoPropertiesByDefault: true
};


app.engine('handlebars', engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars), 
  ...options 
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const httpServer = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Cookies
app.use(cookieParser());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/chat', chatRouter);
app.use('/mail', mailRouter);
app.use('/api/user', userRouter);
app.use('/mockingproducts', MockingRouter);
app.use('/loggerTest', LoggerTest);

//SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FunkoPop - Argentina DOCs',
      version: '1.0.0',
      description: "Documentación para FunkoPop"
    },
  },
  apis: [`${__dirname}/Docs/*.yaml`], // files containing annotations as above
};

const swaggerSetup = swaggerJSDoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.use(errorMiddleware);

// Mail
export const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'alexandersequera97@gmail.com',
    pass: 'cggo cfzc lejw uxth'
  }
});

// Bcrypt
export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
  return bcrypt.compare(data, hashedData);
};

// Socket.io
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  logger.info("Cliente conectado");

  socket.on("Product", (getProduct) => {
    logger.info("Datos recibidos del cliente:", getProduct);
    socketServer.emit("ProductAdded", getProduct);
  });

  socket.on("NewUser", (user) => {
    logger.info("Usuario conectado:", user);
    socketServer.emit("NewUsernew", user);
  });

  socket.on("messageSent", (message) => {
    socket.broadcast.emit("messageSent", message);
    logger.info(message);
  });

  socket.on("disconnect", () => {
    logger.info("Cliente desconectado");
    socket.emit("userOff");
  });
});
