var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,ReloadlySecret,ReloadlyClientID} = require('../config');

const ReloadlyAccessToken = async()=>{
   const response = await Post()
    return response;
}
async function  Post(){
    var options = {
        'method': 'POST',
        'hostname': 'auth.reloadly.com',
        'path': '/oauth/token',
        'headers': {
        },
        'maxRedirects': 20
      };
      const postData = JSON.stringify({
        client_id: `${ReloadlyClientID}`,
        client_secret:`${ReloadlySecret}`,
        grant_type: "client_credentials",
        audience: "https://utilities-sandbox.reloadly.com"
      })
    return new Promise((resolve)=>{
    var req = https.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        resolve({
            status:true,
            message:"",
            data:body.toString()
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
   
    req.write(postData);
    req.end();
    })
    }
    module.exports = {ReloadlyAccessToken};
