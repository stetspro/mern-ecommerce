import express from 'express';
import 'dotenv/config'
import passport from 'passport';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import bcrypt, { compareSync } from 'bcrypt';
import UserRouter from './routes/user.router.js';
import CartRouter from './routes/carts.router.js';
import ViewRouter from './routes/views.router.js';
import ProductRouter from './routes/products.router.js';
import { ProductService, CartService, MessageService } from './services/index.js';
import { initializePassport } from './config/passport.config.js';
  
export const app = express();
app.engine("handlebars", handlebars.engine(
    {
        helpers: {
            range: function (count) { 
                const result = [];
                for (let i = 0; i < count; ++i) {
                    result.push(i+1);
                }
                return result;
            },
            eq: function (a, b) { 
                return a == b; 
            },
            cl: function (v) { 
                console.log(v); 
            },
            getCartSubtotal: function (products) {
                let subtotal = 0;

                products.forEach(product => {
                    subtotal += product.id.price * product.quantity;
                });

                return subtotal;
            }
        }
    }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const viewRouter = new ViewRouter();
const productRouter = new ProductRouter();
const userRouter = new UserRouter();
const cartRouter = new CartRouter();

app.use('/views/', viewRouter.getRouter());
app.use('/api/products/', productRouter.getRouter());
app.use('/api/carts/', cartRouter.getRouter());
app.use('/api/users/', userRouter.getRouter());

app.get('/', (req, res) => {
    res.redirect('/views/products');
});

const httpServer = app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
const socketServer = new Server(httpServer);

// <--- Socket Connection --->

socketServer.on('connection', async socket => {
    console.log("New client connection");

    // <--- Product List sockets --->
    socket.on("onaddtocart", async (data) => {
        await CartService.addProductToCart(data.cid, data.pid);
    });

    // <--- Real time products sockets --->
    socket.emit('products', await ProductService.getProducts(40));

    socket.on("onaddproduct", async product => {
        await ProductService.addProduct(product);
        const data = await ProductService.getProducts(40);
        socketServer.sockets.emit('products', data);
    });

    socket.on("ondeleteproduct", async pid => {
        await ProductService.deleteProduct(pid);
        const data = await ProductService.getProducts(40);
        socketServer.sockets.emit('products', data);  
    });

    // <--- Chat sockets --->
    socket.emit('messages', await MessageService.getAllMessages());

    socket.on('new-message', async (message) => {
        await MessageService.saveMessage(message);
        let messages = await MessageService.getAllMessages();
        socketServer.sockets.emit('messages', messages);
    });
});