const {version} = require('../../includes/config');
const { SendEmail } = require('../../includes/email');
const { AntiHacking } = require('../../includes/security');
const { SendSMS } = require('../../includes/sms');
const { SendSMSAfricaTalking } = require('../../includes/sms/Africatalking');

module.exports = (app)=>{
    app.post(`/${version}/test`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        // AntiHacking(params).then((resp)=>{
        //     res.json(resp) 
        // })
        SendEmail("Test Email","Your token is : 2377373",{EmailAddress:"marshalgfx@gmail.com",FirstName:"Marshal"}).then((ress)=>{
            res.json(ress);
      })
    })
}