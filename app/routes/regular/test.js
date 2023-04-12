const {version} = require('../../includes/config');
const { SendEmail } = require('../../includes/email');
const { GeneratePDF } = require('../../includes/pdf/generate_pdf');
const { AntiHacking } = require('../../includes/security');
const { SendSMS } = require('../../includes/sms');
const { SendSMSAfricaTalking } = require('../../includes/sms/Africatalking');

module.exports = (app)=>{
    app.post(`/${version}/test`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        // AntiHacking(params).then((resp)=>{
        //     res.json(resp) 
        // })
    //  SendSMS("08161235924","Your token xxxx xxxx is").then((ress)=>{
     res.json({
        tsau:"spsppsp"
     });
    // })
    // GeneratePDF("").then((ress)=>{
    //  res.json(ress); 
    // })
    
    // req.BaseFunctions.UpdateWalletBalance(
    //     {PhoneNumber:"08161235924"},"2000","credit","shsjjs92992"
    // ).then((ress)=>{
    //     res.json(ress);  
    // })
    // req.BaseFunctions.PickUpCash({
    // }).then((response)=>{
    //     res.json(response);
    // })
    })
}