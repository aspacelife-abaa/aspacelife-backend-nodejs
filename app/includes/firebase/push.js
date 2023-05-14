var https = require('follow-redirects').https;
require('dotenv').config();

const SendPush = (data)=>{
    return new Promise((resolve)=>{
    var options = {
      'method': 'POST',
      'hostname': 'fcm.googleapis.com',
      'path': '/fcm/send',
      'headers': {
        'Content-Type': ' application/json',
        'Authorization': `key=${process.env.Google_Pushkey}`
      },
      'maxRedirects': 20
    };
    
    var req = https.request(options, function (res) {
      var chunks = "";
      res.on("data", function (chunk) {
        chunks += chunk;
      });
      res.on("end", function (chunk) {
        console.log(JSON.parse(chunks));
        resolve(JSON.parse(chunks))
      });
      res.on("error", function (error) {
        console.error(error);
        resolve({
            status:false,
            message:"",
            data:{}
        })
      });
    });
    
    var postData =  JSON.stringify({
        ...data,
        collapse_key:"type_a",
        priority:"high"
    });
    req.write(postData);
    req.end();
})
}
module.exports = {
    SendPush
}