var https = require('follow-redirects').https;
require('dotenv').config();
const PaystackSubmitPIN = (data)=>{
return new Promise((resolve)=>{
var options = {
    'method': 'POST',
  'hostname': 'api.paystack.co',
  'path': '/charge/submit_pin',
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
    pin: `${data.pin}`,
    reference: `${data.reference}`
  })
console.log(params);
req.write(params);
req.end();
})
}

module.exports = {PaystackSubmitPIN};