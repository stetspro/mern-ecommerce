import express from 'express';
import { __dirname } from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars';

const app = express();
app.engine("handlebars", handlebars.engine());

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => { res.send("Servidor Express") });
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/views/', viewsRouter);

app.listen(process.env.PORT, () => console.log(`Corriendo en el puerto ${process.env.PORT}`));