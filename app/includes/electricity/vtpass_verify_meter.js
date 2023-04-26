var https = require('follow-redirects').https;
require('dotenv').config();
const VerifyMeterNumber = async(data)=>{
    const response = await Post(data)
     return response;
 }
 async function  Post(data){
     var options = {
         'method': 'POST',
         'hostname': 'sandbox.vtpass.com',
        'path': '/api/merchant-verify',
         'headers': {
           'Authorization': `Bearer ${process.env.VTPASS_Username}${process.env.VTPASS_Password}`
         },
         'maxRedirects': 20
       };
       console.log("options:",options);
     return new Promise((resolve)=>{
     var req = https.request(options, function (res) {
       var chunks = [];
       res.on("data", function (chunk) {
         chunks.push(chunk);
       });
     
       res.on("end", function (chunk) {
         var body = Buffer.concat(chunks);
         const x = JSON.parse(body.toString());
         resolve({
             status:x.status != "success",
             message:x.message,
             data:x.data
             })
       });
     
       res.on("error", function (error) {
         console.error(error);
         resolve({
             status:false,
             message:error.message,
             data:{}
             })
       });
     });
     const postData = JSON.stringify({
        billersCode:data.meter_number,
        serviceID:data.serviceID,
        type:data.type
     })
     req.write(postData);
     req.end();
     })
     }
module.exports = {VerifyMeterNumber};