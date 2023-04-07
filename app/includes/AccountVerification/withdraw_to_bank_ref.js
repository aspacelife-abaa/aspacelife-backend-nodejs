const { generateRandomNumber } = require("../utils");
const { 
    PaystackSecretKey
    } = require('../config');
var https = require('follow-redirects').https;

const WithdrawToBankRef = (params)=>{
    var postData = JSON.stringify({
      type: "nuban",  
      currency: "NGN",
      name:params.name, 
      account_number:(params.account_number),
      bank_code:params.bank_code
      });
      console.log("postData:",postData);
return new Promise((resolve)=>{
    var options = {
    'method': 'POST',
    'hostname': 'api.paystack.co',
    'path': '/transferrecipient',
  'headers': {
    'Accept': 'application/json',
    'Authorization': `Bearer ${PaystackSecretKey}`,
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
    resolve(JSON.parse(body.toString()));
  });

  res.on("error", function (error) {
    console.error(error);
    resolve({
        status:false,
        message:error.message,
        data:{}
        });
  });
});
req.write(postData);
req.end();
})
}
module.exports = {WithdrawToBankRef};