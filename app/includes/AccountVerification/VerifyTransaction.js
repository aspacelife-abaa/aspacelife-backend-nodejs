const { generateRandomNumber } = require("../utils");
const { 
    PaystackSecretKey
    } = require('../config');
var https = require('follow-redirects').https;

const VerifyTransaction = (tx)=>{
return new Promise((resolve)=>{
try {
  var options = {
  'method': 'GET',
  'hostname': 'api.paystack.co',
  'path': `/transaction/verify/${tx}`,
  'headers': {
    'Accept': 'application/json',
    'Authorization': `Bearer ${PaystackSecretKey}`,
    'Cookie':`sails.sid=${generateRandomNumber(16)}`
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
req.end();
} catch (error) {
  resolve({
    status:false,
    data:{},
    message:"Oops! something went wrong, try again later."
  });
}
})
}
module.exports = {VerifyTransaction};