const {SMSBaseUrl,SMSFolder,SenderID,DefaultSMS,TwilioAccID,TwilioToken} = require('../config');
const {SendSMSAfricaTalking} = require('./Africatalking');
// const client = require('twilio')(TwilioAccID, TwilioToken);
const SendSMS = (numbers,message)=>{
  return new Promise((resolve)=>SendSMSAfricaTalking(
      numbers,
      message
    ).then((res)=>{
      console.log("SendSMSAfricaTalking:",JSON.stringify(res));
      resolve(res);
    }))
}
module.exports = {SendSMS};