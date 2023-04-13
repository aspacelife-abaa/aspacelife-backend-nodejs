const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const x = {
    api_key:process.env.CLOUDINARY_api_key,
    api_secret:process.env.CLOUDINARY_api_secret,
    cloud_name:process.env.CLOUDINARY_cloud_name
}
console.log(x);
cloudinary.config(x);
module.exports = cloudinary;