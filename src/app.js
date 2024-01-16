import express from 'express';
import productsRouter from './Router/products.router.js';
import cartRouter from './Router/cart.router.js';
import viewsRouter from './Router/views.router.js';
import chatRouter from './Router/chat.router.js';
import sessionsRouter from './Router/sessions.router.js';
import mailRouter from './Router/mail.router.js';
import MockingRouter from './Router/mocking.router.js';
import LoggerTest from './Router/loggertest.router.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import "./Models/configDB.js";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import config from './config.js';
import './passportConfig.js';
import nodemailer from 'nodemailer';
import { errorMiddleware } from './middlewares/errors.middleware.js';
import { logger } from "./Fuctions/logger.js";

const app = express();
const SECRET_KEY = config.secret_key;

// Dirname
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Session
app.use(session({
  store: new MongoStore({
    mongoUrl: config.mongo_uri
  }),
  secret: "secretSession",
  cookie: { maxAge: 60000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// JWT
export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: 300 });
  return token;
};
 
// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const httpServer = app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
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
app.use('/mockingproducts', MockingRouter);
app.use('/loggerTest', LoggerTest);

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
