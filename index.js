require('dotenv').config();
const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');
const fileUpload = require('express-fileupload');
var cors = require('cors');

//Aoo de express
const app = express();


//Habilitar express.json
app.use(express.json({ extended: true }));


// puerto de la app
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(fileUpload({
    useTempFiles: true
}))

//Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);

//Mensajes de Sockets
require('./sockets/socket');

//conectar a la base de datos
conectarDB();





// Path público
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

//importar rutas
app.use('/api/lugares', require('./routes/lugares'));
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/promocion', require('./routes/promocion'));
app.use('/api/subproductos', require('./routes/subproductos'));
app.use('/api/slide', require('./routes/slider'));
app.use('/api/socialMedia', require('./routes/socialMedia'));
app.use('/api/like', require('./routes/like'));
app.use('/api/comentario', require('./routes/comentarios'));
app.use('/api/direccion', require('./routes/direccions'));
app.use('/api/renew', require('./routes/renew'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/calificacion', require('./routes/calificacion'));

//Administrador
app.use('/api/category', require('./routes/category'));
app.use('/api/restaurant', require('./routes/restaurantTipo'));

//arrancar el puerto
server.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});