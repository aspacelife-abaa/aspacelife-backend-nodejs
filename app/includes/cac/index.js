var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID} = require('../config');

const VerifyCAC = async(cac_number)=>{
   const response = await Post(cac_number)
    return response;
}
async function  Post(cac_search){
var options = {
  'method': 'POST',
  'hostname': 'postapp.cac.gov.ng',
  'path': '/postapp/api/front-office/search/company-business-name-it',
  'headers': {
    'Content-Type': 'application/json',
    'referer': 'https://post.cac.gov.ng/',
    'authority': 'postapp.cac.gov.ng'
  },
  'maxRedirects': 20
};
return new Promise((resolve)=>{
var req = https.request(options, function (res) {
  var chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks).toString();
    console.log(body.toString());
    const x  = body[0] == "{"?JSON.parse(body):{message:"",data:[]};
    resolve({
        status: x.data != [],
        message:x.message,
        data:x.data
        })
  });

  res.on("error", function (error) {
    console.error(error);
    resolve({
        status:false,
        message:error.message,
        data:{}
        })
  });
});

var postData = JSON.stringify({
  "classification": {
    "id": 0
  },
  "isViewFee":false,
  "searchTerm":`${cac_search}`,
  "selectedCompanyId": null
});
req.write(postData);
req.end();
})
}
module.exports = {VerifyCAC};