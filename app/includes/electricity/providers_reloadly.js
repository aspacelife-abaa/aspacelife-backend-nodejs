const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret,ReloadlySecret, isLive} = require('../config');
var https = require('follow-redirects').https;

const GetBillersReloadly = async(data)=>{
   const response = await Post(data)
    return response;
}
async function  Post(data){
   
    return new Promise((resolve)=>{
        var options = {
          'method': 'GET',
          'hostname': 'utilities-sandbox.reloadly.com',
          'path': '/billers?countryISOCode=NG',
          'headers': {
            'authorization': isLive?'Bearer':'Bearer eyJraWQiOiIxNjYyOWUwZC1iM2NhLTRlM2EtYThkMS0xMzUyNjgxZmZkM2EiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOTMwOCIsImlzcyI6Imh0dHBzOi8vcmVsb2FkbHktc2FuZGJveC5hdXRoMC5jb20vIiwiaHR0cHM6Ly9yZWxvYWRseS5jb20vc2FuZGJveCI6dHJ1ZSwiaHR0cHM6Ly9yZWxvYWRseS5jb20vcHJlcGFpZFVzZXJJZCI6IjE5MzA4IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIiwiYXVkIjoiaHR0cHM6Ly91dGlsaXRpZXMtc2FuZGJveC5yZWxvYWRseS5jb20iLCJuYmYiOjE2NzkyMjkxNzAsImF6cCI6IjE5MzA4Iiwic2NvcGUiOiJkZXZlbG9wZXIiLCJleHAiOjE2NzkzMTU1NzAsImh0dHBzOi8vcmVsb2FkbHkuY29tL2p0aSI6ImQyNzY5MmY0LWU1ODQtNGQ5Mi1iOWRjLTZjYTdlOTFhODhhNyIsImlhdCI6MTY3OTIyOTE3MCwianRpIjoiN2YyYzA3NGMtNjBmMy00NzU1LThlMGMtMGZlZWI2NmFjYTFhIn0.hKFJIamgBpHNcpfVqlrUqaZV2J0QbZl9T62wNnYkxtg'
          },
          'maxRedirects': 20
        };
        console.log(options);
        var req = https.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res.on("end", function (chunk) {
              var body = Buffer.concat(chunks);
              const x = JSON.parse(body.toString());
              resolve({
                  status:true,
                  message:x.message,
                  data:x.content?x.content:[]
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
        
        req.end();
    })
}
module.exports = {GetBillersReloadly};
