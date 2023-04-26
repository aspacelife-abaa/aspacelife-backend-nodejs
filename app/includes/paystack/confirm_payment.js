var https = require('follow-redirects').https;
require('dotenv').config();
const PaystackTransactionConfirmation = (refNo)=>{
return new Promise((resolve)=>{
var options = {
    'method': 'GET',
    'hostname': 'api.paystack.co',
    'path': '/transaction/verify/'+refNo,
  'headers': {
    'Authorization': 'Bearer '+process.env.Paystack_Test_secretKey,
    'Content-Type': 'application/json',
     },
  'maxRedirects': 20
};
console.log(options)
var req = https.request(options, function (res) {
  var chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
      const ms = body.toString();
      let suc = {}
      if(String(ms).includes("data"))
      {
        suc = JSON.parse(ms);
        // suc.message = suc;
        // suc.data = {}
      }
      resolve(suc); 
  });

  res.on("error", function (error) {
    console.error(error);
    resolve({
        status:false,
        data:{},
        message:error.message
    })
  });
});
req.end();
})
}

module.exports = {PaystackTransactionConfirmation};