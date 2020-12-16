require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');
const fileUpload = require('express-fileupload');
var cors = require('cors')
    //crear el servidor
const app = express();

//conectar a la base de datos
conectarDB();



//Habilitar express.json
app.use(express.json({ extended: true }));


// puerto de la app
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(fileUpload({
    useTempFiles: true
}))

//importar rutas
app.use('/api/lugares', require('./routes/lugares'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/promocion', require('./routes/promocion'));
app.use('/api/subproductos', require('./routes/subproductos'));
app.use('/api/renew', require('./routes/renew'));

//arrancar el puerto
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});