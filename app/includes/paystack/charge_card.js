var https = require('follow-redirects').https;
require('dotenv').config();
const PaystackChargeCard = (data)=>{
return new Promise((resolve)=>{
var options = {
    'method': 'POST',
  'hostname': 'api.paystack.co',
  'path': '/charge',
  'headers': {
    'Authorization': 'Bearer '+process.env.Paystack_Test_secretKey,
    'Content-Type': 'application/json'
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
    resolve(JSON.parse(body.toString()))
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
const params = JSON.stringify({
    "email": `${data.EmailAddress}`,
    "amount": `${data.amount}`,
    "bank":{
        "code":`${data.bank_code}`,
        "account_number":`${data.account_number}`
    }
  })
console.log(params);
req.write(params);
req.end();
})
}

module.exports = {PaystackChargeCard};