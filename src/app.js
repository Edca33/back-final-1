import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

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


let products = [];


app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

app.post('/products', (req, res) => {
  const newProduct = req.body.product;
  products.push(newProduct);
  io.emit('newProduct', newProduct);
  res.redirect('/realtimeproducts');
});

// Lógica de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');
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
