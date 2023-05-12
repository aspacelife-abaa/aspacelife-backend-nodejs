var https = require('follow-redirects').https;
require('dotenv').config();
const PaystackURL = (data)=>{
return new Promise((resolve)=>{
var options = {
  'method': 'POST',
  'hostname': 'api.paystack.co',
  'path': '/transaction/initialize',
  'headers': {
    'Authorization': 'Bearer '+process.env.Paystack_Test_secretKey,
    'Content-Type': 'application/json',
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
    try {
    const srp = JSON.parse(body.toString());
    resolve(srp)
    } catch (error) {
      resolve({
        status:false,
        message:body.toString(),
        data:{}
      })
    }
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

var postData = JSON.stringify({
  email:data.email,
  amount:parseFloat(data.amount*100),
  channels:[data.channel],
});
console.log("postData:",postData)
req.write(postData);
req.end();
})
}

module.exports = {PaystackURL};