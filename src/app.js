import express from 'express';
import { __dirname } from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
app.use(express.json());

app.use('/static', express.static(__dirname + '/public'))

app.get('/', (req, res) => { res.send("Servidor Express") });
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);

app.listen(process.env.PORT, () => console.log(`Corriendo en el puerto ${process.env.PORT}`));