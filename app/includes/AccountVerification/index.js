const { generateRandomNumber } = require("../utils");
const { 
    PaystackSecretKey
    } = require('../config');
    
var https = require('follow-redirects').https;
const VerifyBankAccount = (data)=>{
  return new Promise((resolve)=>{
      var options = {
        'method': 'GET',
        'hostname': 'api.paystack.co',
        'path': `/bank/resolve?account_number=${data.account_number}&bank_code=${data.bank_code}`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': `Bearer ${PaystackSecretKey}`,
          'Cookie': `sails.sid=${generateRandomNumber(16)}`
        },
      'maxRedirects': 20
      };
      console.log("Headers:",options);
      var req = https.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
          let suc = JSON.parse(body.toString());
          if(!suc.status)
          {
            suc.message = "Oops! account does not exist."
          }
          resolve(suc);
        });
        res.on("error", function (error) {
        console.error(error);
        resolve({status:false,
        message:"",
        data:{}});
        });
      });
      req.end();
    })
}
module.exports = {VerifyBankAccount};