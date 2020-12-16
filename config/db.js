const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

const conectarDB = async() => {
    try {
        await mongoose.connect(process.env.BBDD, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarDB;