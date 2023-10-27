import express from 'express';
import productsRouter from './routers/products.router.js'
import cartRouter from './routers/cart.router.js'
import viewsRouter from './routers/views.router.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import "./Dao/configDB.js"

const app = express();

//Dirname
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url))

//Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname+'/views');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))

const httpServer = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

  // Routes
  app.use('/api/products', productsRouter)
  app.use('/api/cart', cartRouter)
  app.use('/', viewsRouter)
  

//Socket.io

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log("Cliente conectado");
  
    socket.on("Product", (getProduct) => {
      console.log("Datos recibidos del cliente:", getProduct);
      socketServer.emit("ProductAdded", getProduct);
    });

    socket.on("NewUser", (user) => { 
      console.log("Usuario conectado:", user);
      socketServer.emit("NewUsernew", user);
    });

    socket.on("messageSent", (message) => { 
      console.log("Usuario conectado:", message.user);

      socket.broadcast.emit("messageSent", message);

      console.log(message)
    });
  
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });