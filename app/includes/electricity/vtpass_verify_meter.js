var request = require('request');
require('dotenv').config();
const VTPASSVerifyMeterNumber = async(data)=>{
    const response = await Post(data)
     return response;
 }
 async function  Post(data){
  var options = {
    'method': 'POST',
    'url': process.env.isDEV == "1"?'https://sandbox.vtpass.com/api/merchant-verify':'https://vtpass.com/api/merchant-verify',
    'headers': {
      'Authorization': process.env.isDEV == "1"?'Basic bXlhc3BhY2VsaWZldGVjaEBnbWFpbC5jb206YWRtaW5sZXZlbDE=':`Basic `,
    },
    formData: {
      'billersCode': data.meterNumber,
      'serviceID': data.serviceID,
      'type':data.type
    }
  };
     return new Promise((resolve)=>{
      request(options, function (error, response) {
        if (error)
        { 
        resolve({
             status:false,
             message:error.message,
             data:{}
             })
        }else{
          const body = JSON.parse(response.body);
          resolve({
            status:true,
            message:"",
            data:body.content
          }) 
        }
       });
     })
     }
module.exports = {VTPASSVerifyMeterNumber};