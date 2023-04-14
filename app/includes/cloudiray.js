const { default: Axios } = require('axios');
require('dotenv').config();
import {Cloudinary} from '@cloudinary/url-gen';

const x = {
    api_key:process.env.CLOUDINARY_api_key,
    api_secret:process.env.CLOUDINARY_api_secret,
    cloud_name:process.env.CLOUDINARY_cloud_name
}

console.log(x);
const CloudinaryCall = (params)=>{
return new Promise((resolve)=>{
const url = `https://api.cloudinary.com/v1_1/${x.cloudName}/image/upload`;
let data = new FormData();
data.append('file',params.imageString);
// data.append('upload_preset',`${x.api_key}`);
data.append('public_id',`social_feeds`);
data.append('api_key',`${x.api_key}`);

let config = {
  method: 'post',
  url:url,
  headers: { 
    'api_key':`${x.api_key}`,
    'Content-Type':'application/json'
  },
  data:data
};
 Axios.post(config).then((res)=>{
            console.log(res)
            resolve({
                status:true,
                message:"",
                data:{}
            })
        }).catch((res)=>{
            console.log(res)
            resolve({
                status:true,
                message:"",
                data:{}
            })   
        })
    })
}
module.exports = {CloudinaryCall};