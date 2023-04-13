require('dotenv').config();
const accountSid = process.env.Twilio_account_id;
const authToken = process.env.Twilio_token;
console.log(accountSid,"|",authToken);
const client = require('twilio')(accountSid, authToken);
const TWILIO_SMS = ()=>{
return new Promise((resolve)=>{
client.messages
  .create({
    body: 'Hello from twilio-node',
    to: '+12345678901', // Text your number
    from: '+12345678901', // From a valid Twilio number
  }).then((message) =>{
    resolve({
        status:true,
        data:message,
        message:""
  });
})
})
}
module.exports = {TWILIO_SMS};