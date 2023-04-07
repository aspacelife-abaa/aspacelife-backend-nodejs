const { 
    PaystackPublickey,
    PaystackSecretKey
    } = require('../config');
const {WithdrawToBankRef} = require("./withdraw_to_bank_ref");
var https = require('follow-redirects').https;
const WithdrawToBank = (params)=>{
return new Promise((resolve)=>{
 WithdrawToBankRef({
account_number:params.recipient,
amount:params.amount,
bank_code:params.bank_code,
name:params.name
}).then((bnkRes)=>{
  if(bnkRes.status)
  {
    var postData = JSON.stringify({
      source: 'balance',
      amount:params.amount,
      recipient:bnkRes.data.recipient_code,
      reason:params.memo,
      currency: 'NGN',
      reference:params.ref
    });
  var options = {
    'method': 'POST',
    'hostname': 'api.paystack.co',
    'path': '/transfer',
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
  }else{
    resolve({
      status:false,
      data:{},
      message:bnkRes.message
    });
  }
})
})
}
module.exports = {WithdrawToBank};