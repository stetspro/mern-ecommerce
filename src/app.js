import express from 'express';
import { __dirname } from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import chatRouter from './routes/chat.router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { ProductManager } from './dao/services/product.service.js';
import { MessageManager } from './dao/services/message.service.js';
import { CartManager } from './dao/services/cart.service.js';
import 'dotenv/config'

const productManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

const app = express();
app.engine("handlebars", handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => { res.render('home') });
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/views/', viewsRouter);
app.use('/chat/', chatRouter);

const httpServer = app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
const socketServer = new Server(httpServer);

// <--- Socket Connection --->

socketServer.on('connection', async socket => {
    console.log("New client connection");

    // <--- Product List sockets --->
    socket.on("onaddtocart", async (pid) => {
        const cid = "6569232dfd90f493970a65cd";
        await cartManager.addProductToCart(cid, pid);
    });

    // <--- Real time products sockets --->
    socket.emit('products', await productManager.getProducts());

    socket.on("onaddproduct", async product => {
        await productManager.addProduct(product);
        const data = await productManager.getProducts();
        socketServer.sockets.emit('products', data);
    });

    socket.on("ondeleteproduct", async pid => {
        await productManager.deleteProduct(pid);
        const data = await productManager.getProducts();
        socketServer.sockets.emit('products', data);  
    });

    // <--- Chat sockets --->
    socket.emit('messages', await messageManager.getAllMessages());

    socket.on('new-message', async (message) => {
        await messageManager.saveMessage(message);
        let messages = await messageManager.getAllMessages();
        socketServer.sockets.emit('messages', messages);
    });
})