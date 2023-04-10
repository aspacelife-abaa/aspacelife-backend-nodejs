var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret,isLive} = require('../config');

const GetDataPlans = async(bill_code)=>{
   const response = await Post(bill_code)
    return response;
}
async function  Post(bill_code){
    let url =  '/v3/bill-categories?data_bundle=1';
    if(bill_code)
    {
     url += `&bill_code=${bill_code}`;
    }
    var options = {
        'method': 'GET',
        'hostname': 'api.flutterwave.com',
        'path':url,
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
module.exports = {GetDataPlans};
