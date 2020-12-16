require("dotenv").config();
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.NUBE_CLOUD_NAME,
    api_key: process.env.NUBE_API_KEY,
    api_secret: process.env.NUBE_API_SECRET
});

module.exports = { cloudinary };