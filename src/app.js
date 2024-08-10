import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { productModel } from './models/Product.model.js';
import { chatModel } from './models/chat.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.engine('.handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
let messages = [];
let Id = [];
let products = [];
mongoose.connect(
  "mongodb+srv://doom660324:336699..@coderback.0bsn23o.mongodb.net/?retryWrites=true&w=majority&appName=coderback",
  { dbName: 'compras21' },
)
.then(() => console.log('Conectado a mongoDB'))
app.get('/', (req, res) =>{
  res.render('home', { products });
})
  

app.get('/', async (req, res) => {
  
  const { limit = 10, page = 1, query, sort } = req.query;
  const filter = query ? { [query]: true } : {};
  const products = await Product.find(filter)
  .sort(sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1} : {})
  .skip((page - 1) * limit)
  .limit(Number(limit))
  

  const totalProducts = await productModel.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);
  
  res.json({
    status: 'success',
    payload: products,
    totalPages,
    PrevPage: page > 1 ? page -1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevLink: page > 1 ? `/products?page=${page - 1}` : null,
    nextLink: page < totalPages ? `/products?page=${page + 1}` : null,
  })
  
});
app.get('/chats', async (req, res) => {
  const results = await chatModel.find().lean()

  res.render('chats', { messagesContainer: [...results] })
});

app.get('/checkout', (req, res) =>{
  res.render('checkout')
})

app.get('/cart', (req, res) =>{
  res.render('carrito', { products, Id})
})

app.get('/item/:pid', (req, res) =>{
  res.render('productoPorId', {  products, Id })
})


app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

app.post('/products', (req, res) => {
  const newProduct = req.body.product;
  products.push(newProduct);
  io.emit('newProduct', newProduct);
  res.redirect('/realtimeproducts');
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('message',async (data) =>{
    await chatModel.create({
        user: data.user,
        message: data.message
    })
    io.emit('logs', await chatModel.find().lean())
})
  socket.emit('initialProducts', products); 
  socket.on('deleteProduct', (index) => {
    products.splice(index, 1);
    io.emit('productsUpdated', products); 
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
