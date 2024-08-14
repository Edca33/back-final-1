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
let Id = [];
function getProductData() {
  // Define productData here
  let productData = {};

  // Use productData within the function
}

let products = [];
mongoose.connect(
  "mongodb+srv://doom660324:Blood669933ñbloodñññ@coderback.0bsn23o.mongodb.net/?retryWrites=true&w=majority&appName=coderback",
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

app.get('/products', (req, res) =>{
  res.render('products', { products })
})

app.get('/checkout', (req, res) =>{
  res.render('checkout')
})



app.get('/cart', (req, res) =>{
  res.render('carrito', { products, Id})
})
app.get('/producto', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId', {  products, Id })
})



app.get('/item/1', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-1', {  products, Id })
})
app.get('/item/2', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-2', {  products, Id })
})

app.get('/item/3', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-3', {  products, Id })
})

app.get('/item/4', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-4', {  products, Id })
})

app.get('/item/5', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-5', {  products, Id })
})

app.get('/item/6', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-6', {  products, Id })
})

app.get('/item/7', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-7', {  products, Id })
})

app.get('/item/8', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-8', {  products, Id })
})

app.get('/item/9', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-9', {  products, Id })
})

app.get('/item/10', (req, res) =>{
  const pid = req.params.pid;
  const productData = getProductData(pid);
  res.render('productoPorId-10', {  products, Id })
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
