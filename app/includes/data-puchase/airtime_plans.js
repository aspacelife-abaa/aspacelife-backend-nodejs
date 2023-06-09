var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret, AIRTIMENG_APIKey, AIRTIMENG_APIToken} = require('../config');

const GetAIRTIMENGDataPlans = async(bill_code)=>{
   const response = await Post(bill_code)
    return response;
}
async function  Post(bill_code){
   
    var options = {
        'method': 'GET',
        'hostname': 'www.airtimenigeria.com',
        'path':'/api/v1/data/plans',
        'headers': {
            'Authorization': `Bearer ${AIRTIMENG_APIToken}`,//`Bearer ${FlutterWaveTestSecret}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
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
    module.exports = {GetAIRTIMENGDataPlans};
