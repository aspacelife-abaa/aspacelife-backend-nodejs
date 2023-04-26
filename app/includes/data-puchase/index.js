var https = require('follow-redirects').https;
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret, AIRTIMENG_APIToken, isLive} = require('../config');
const BuyData = async(data,ref)=>{
    const response = await Post(data,ref);
    return response;
}
async function  Post(data,ref){
  let postData = JSON.stringify({
    network_operator:(data.network_operator).toLowerCase(),
    phone:data.phoneNumber,
    package_code:data.dataPlanId,
    customer_reference:ref,
    max_amount:data.amount,
    callback_url:'https:staging.aspacelife.com/v1.0/data_callback'
  });
 
    var options = {
        'method': 'POST',
        'hostname':'www.airtimenigeria.com',//'api.flutterwave.com',
        'path':'/api/v1/data/purchase',//'/v3/bills',
        'headers': {
          'Authorization':`Bearer ${AIRTIMENG_APIToken}` ,//`Bearer ${FlutterWaveTestSecret}`,
          'Content-Type': 'application/json'
        },
        'maxRedirects': 20
      };
      console.log(postData);
      console.log(options);
    return new Promise((resolve)=>{
      // resolve({status:false,
      //   message:postData,
      //   data:{}
      // })
      // return;
      const list = ['mtn', 'airtel', 'glo','9mobile'];
      if(!list.includes(String(data.network_operator).toLowerCase()))
      {
        resolve({status:false,data:{},message:`Oops! network_operator must one of the following (${list.join(",")})`});
        return ;
      }
      if(data.network_operator !== "MTN")
      {
        resolve({status:false,data:{},message:"Oops! only N140 (500mb) MTN is allowed"});
        return ;
      }
      if(parseInt(data.amount) !== 140 && !isLive)
      {
        resolve({status:false,data:{},message:"Oops! only N140 (500mb) MTN is allowed"});
        return ;
      }
    var req = https.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var resquet = Buffer.concat(chunks);
        try {
          let x = JSON.parse(resquet.toString());
        resolve({
          status:x.status === "success",
          message:x.status === "success"?"Data purchase was successful.":"Oops! Data purchase not successful.",
          data:x.status === "success"?{
              reference:x.details.reference,
              customer_reference:x.details.ref,
              network:data.network_operator,
              phone_number:data.phoneNumber,
              number_of_recipients: 1,
              amount:data.amount,
              unit_cost:x.details.unit_cost,
              total_cost:x.details.total_cost,
              currency: "NGN"
          }:{}
            })
        } catch (error) {
          resolve({
            status:false,
            message:"Oops! Data purchase not successful.",
            data:{}
            })
        }
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
module.exports = {BuyData};
