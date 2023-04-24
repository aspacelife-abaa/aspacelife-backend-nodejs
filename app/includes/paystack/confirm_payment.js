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
    let suc = JSON.parse(body.toString());
    if(suc.data && `${suc.data.message}` !== "undefined")
    {
      suc.message = suc.data.message;
      suc.data = {}
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