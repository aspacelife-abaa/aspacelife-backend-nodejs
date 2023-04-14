require('dotenv').config();
const {Cloudinary} = require('@cloudinary/url-gen');

const x = {
    api_key:process.env.CLOUDINARY_api_key,
    api_secret:process.env.CLOUDINARY_api_secret,
    cloud_name:process.env.CLOUDINARY_cloud_name
}
const cldInstance = new Cloudinary({cloud: {cloudName: 'dcqt9xiub'}});

console.log(x);
const CloudinaryCall = (params)=>{
return new Promise((resolve)=>{
    const fetchedImage = cldInstance.image('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg').setDeliveryType('fetch');
            console.log(fetchedImage.toURL())
            resolve({
                status:true,
                message:"",
                data:{
                    uri:fetchedImage.toURL()
                }
            })
    })
}
module.exports = {CloudinaryCall};