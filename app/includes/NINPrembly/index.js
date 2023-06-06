
var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret} = require('../config');
const FormData = require('form-data');

const NINImageVerification = async(data)=>{
   const response = await Post(data)
    return response;
}
async function  Post(data){
    var options = {
        'method': 'POST',
        'hostname': 'api.prembly.com',
        'path': '/identitypass/verification/nin_w_face',
        'headers': {
          'X-Api-Key': 'sandbox_sk_nFpcm8RrZ4ZiMgsDFCFsU8h6yg9MhuKTkzKjgTz',
          'app_id': 'b9c83b51-a22a-4ff0-a9ec-0d1f7e4c0d53'
        },
        'maxRedirects': 20
      };
      
    return new Promise((resolve)=>{
        var req = https.request(options, function (res) {
            var chunks = [];
          
            res.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res.on("end", function (chunk) {
              var body = Buffer.concat(chunks);
              let d = JSON.parse(body.toString());
              if(d.detail)
              {
                d.message = d.detail;
                delete d.detail;
              }
              if(d.response_code)
              {
                d.data = {
                    response_code:d.response_code
                }
                delete d.response_code;
              }
              console.log(body.toString());
              resolve(d);
            });
          
            res.on("error", function (error) {
              console.error(error);
              resolve(error)
            });
          });
          
          var postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"number\"\r\n\r\n${data.nin}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"image\"\r\n\r\n${data.image}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;
          req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
          req.write(postData);
          req.end();
        })
    }
    module.exports = {NINImageVerification};
