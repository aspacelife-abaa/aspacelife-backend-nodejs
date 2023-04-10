var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret, AIRTIMENG_APIKey, AIRTIMENG_APIToken,isLive} = require('../config');

const AirtimePurchase = async(data,ref)=>{
   const response = await Post(data,ref);
   return response;
}
async function  Post(data,ref){
  const name = String(data.biller_name).toLowerCase().split(" ");
  let postData = JSON.stringify({
    network_operator:name[0],
    phone:data.phone_number,
    amount:isLive?data.amount:"50",
    customer_reference:ref,
    max_amount:20000,
    callback_url: `/airtime_callback`
});
    var options = {
        'method': 'POST',
        'hostname': 'www.airtimenigeria.com',// 'api.flutterwave.com'
        'path': '/api/v1/airtime/purchase',//'/v3/bills',
        'headers': {
          'Authorization': `Bearer ${AIRTIMENG_APIToken}`,//`Bearer ${FlutterWaveTestSecret}`,
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
        'maxRedirects': 20
      };
      
      console.log(options);
    return new Promise((resolve)=>{
      if(parseInt(data.amount) > 100)
      {
        resolve({status:false,data:{},message:"Oops! only N100 and below are allowed"});
        return ;
      }
    var req = https.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var resquet = Buffer.concat(chunks);
        let x = JSON.parse(resquet.toString());
        console.log(x);
        resolve({
            status:x.status === "success",
            message:x.status === "success"?"Airtime purchase was successful.":"Oops! Airtime purchase not successful.",
            data:x.status === "success"?{
                reference:x.details.reference,
                customer_reference:x.details.ref,
                network:data.biller_name,
                phone_number:data.phone_number,
                number_of_recipients: 1,
                amount:data.amount,
                unit_cost:x.details.unit_cost,
                total_cost:x.details.total_cost,
                currency: "NGN"
            }:{}
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
    req.write(postData);
    req.end();
    })
}
module.exports = {AirtimePurchase};

