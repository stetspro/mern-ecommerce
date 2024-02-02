import express from 'express';
import 'dotenv/config'
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import { ViewRouter, ProductRouter, UserRouter, CartRouter, MockRouter } from './routes/index.router.js';
import { ProductService, CartService, MessageService } from './services/index.js';
import { initializePassport } from './config/passport.config.js';
import ErrorHandler from './middlewares/errorhandler.js';
import { addLogger, logger } from './utils/logger.js';
  
export const app = express();
initializePassport();
app.use(passport.initialize());

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
            getCartSubtotal: function (products) {
                let subtotal = 0;

                if (!products) {
                    return subtotal;
                }

                products.forEach(product => {
                    subtotal += product?.id?.price * product?.quantity;
                });

                return subtotal;
            }
        }
    }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(addLogger);

const viewRouter = new ViewRouter();
const productRouter = new ProductRouter();
const userRouter = new UserRouter();
const cartRouter = new CartRouter();
const mockRouter = new MockRouter();

app.use('/views/', viewRouter.getRouter());
app.use('/api/products/', productRouter.getRouter());
app.use('/api/carts/', cartRouter.getRouter());
app.use('/api/mock/', mockRouter.getRouter());
app.use('/api/users/', userRouter.getRouter());

app.get('/', (req, res) => {
    res.redirect('/views/products');
});

app.get('/loggerTest', (req, res) => {
    req.logger.debug('Debug message');
    req.logger.http('Http message');
    req.logger.info('Info message');
    req.logger.warning('Warn message');
    req.logger.error('Error message');
    req.logger.fatal('Fatal message');
    res.send('Logger test');
});

const httpServer = app.listen(process.env.PORT, () => logger.debug(`Server running on port ${process.env.PORT}`));
const socketServer = new Server(httpServer);

// <--- Socket Connection --->

socketServer.on('connection', async socket => {
    logger.debug("New client connection");

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

app.use(ErrorHandler);