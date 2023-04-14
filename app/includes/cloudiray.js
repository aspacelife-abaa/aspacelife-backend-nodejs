const { default: Axios } = require('axios');
require('dotenv').config();
const x = {
    api_key:process.env.CLOUDINARY_api_key,
    api_secret:process.env.CLOUDINARY_api_secret,
    cloud_name:process.env.CLOUDINARY_cloud_name
}

console.log(x);
const CloudinaryCall = (params)=>{
return new Promise((resolve)=>{
    const url = `https://api.cloudinary.com/v1_1/${x.cloud_name}/image/upload`;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body:JSON.stringify({
            file:params.imageString,
            upload_preset:"ml_default",
            folder:"socials_feeds"
        }),
        redirect: 'follow'
    };
    console.log(params);
    fetch(url,requestOptions).then(response => response.json()).then((result) => {
            console.log(result.secure_url)
            resolve({
                status:true,
                message:"",
                data:{
                    id:result.public_id,
                    uri:result.secure_url
                }
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