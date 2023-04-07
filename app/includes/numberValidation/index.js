var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret} = require('../config');

const ValidateServiceNumber = async(item_code)=>{
   const response = await Post(item_code)
    return response;
}
async function  Post(item_code){
    var options = {
        'method': 'GET',
        'hostname': 'api.flutterwave.com',
        'path': `/v3/bill-items/${item_code}/validate`,
        'headers': {
          'Authorization': FlutterWaveTestSecret
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
    req.end();
    })
    }
    module.exports = {ValidateServiceNumber};
