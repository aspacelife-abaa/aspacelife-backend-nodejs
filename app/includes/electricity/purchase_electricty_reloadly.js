const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret,ReloadlySecret, isLive} = require('../config');
var https = require('follow-redirects').https;

const BuyElectricityReloadly = async(data,ref)=>{
   const response = await Post(data,ref)
    return response;
}
async function  Post(data,ref){
   
    return new Promise((resolve)=>{
        var options = {
          'method': 'POST',
          'hostname': isLive?'utilities.reloadly.com':'utilities-sandbox.reloadly.com',
          'path': '/pay',
          'headers': {
            'authorization':isLive?'Bearer':'Bearer eyJraWQiOiIxNjYyOWUwZC1iM2NhLTRlM2EtYThkMS0xMzUyNjgxZmZkM2EiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOTMwOCIsImlzcyI6Imh0dHBzOi8vcmVsb2FkbHktc2FuZGJveC5hdXRoMC5jb20vIiwiaHR0cHM6Ly9yZWxvYWRseS5jb20vc2FuZGJveCI6dHJ1ZSwiaHR0cHM6Ly9yZWxvYWRseS5jb20vcHJlcGFpZFVzZXJJZCI6IjE5MzA4IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXVkIjoiaHR0cHM6Ly91dGlsaXRpZXMtc2FuZGJveC5yZWxvYWRseS5jb20iLCJuYmYiOjE2NzkyMjkxNzAsImF6cCI6IjE5MzA4Iiwic2NvcGUiOiJkZXZlbG9wZXIiLCJleHAiOjE2NzkzMTU1NzAsImh0dHBzOi8vcmVsb2FkbHkuY29tL2p0aSI6ImQyNzY5MmY0LWU1ODQtNGQ5Mi1iOWRjLTZjYTdlOTFhODhhNyIsImlhdCI6MTY3OTIyOTE3MCwianRpIjoiN2YyYzA3NGMtNjBmMy00NzU1LThlMGMtMGZlZWI2NmFjYTFhIn0.hKFJIamgBpHNcpfVqlrUqaZV2J0QbZl9T62wNnYkxtg'
          },
          'maxRedirects':20
        };
        let postData = JSON.stringify({
            subscriberAccountNumber:data.meter_number,
            amount:data.amount,
            billerId:data.billerId,
            useLocalAmount: null,
            referenceId:ref
        })
        var req = https.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res.on("end", function (chunk) {
              var body = Buffer.concat(chunks);
             try {
             
              const x = JSON.parse(body.toString());
              resolve({
                  status:x.status == "PROCESSING",
                  message:x.message,
                  data:{
                    id:x.id,
                    referenceId:x.referenceId,
                    code:x.code
                  }
                  })
                     
             } catch (error) {
                console.error(error);
                resolve({
                    status:false,
                    message:"Information not found.",
                    data:{}
                    }) 
             }
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
        req.write(postData);
        req.end();
    })
}
module.exports = {BuyElectricityReloadly};
