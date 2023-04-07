const {SMSBaseUrl,SMSFolder,SenderID,DefaultSMS,TwilioAccID,TwilioToken} = require('../config');

const {SendSMSAfricaTalking} = require('./Africatalking');
const client = require('twilio')(TwilioAccID, TwilioToken);
const SendSMS = (numbers,message)=>{
  return new Promise((resolve)=>SendSMSAfricaTalking(
      numbers,
      message
    ).then((res)=>{
  //     console.log("SendSMSAfricaTalking:",res);
  //     if(!res.status)
  //     {
  //   client.messages.create({
  //   body:message,
  //   to: numbers, 
  //   from:SenderID, // From a valid Twilio number
  //  }).then((message) =>{
  //   resolve(message);
  //     })
  //   }else{
      resolve(res);
    // }
    }))
}

module.exports = {SendSMS};