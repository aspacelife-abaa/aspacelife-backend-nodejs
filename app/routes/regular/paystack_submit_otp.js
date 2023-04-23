
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/payment_confirm_otp`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"],platform:req.headers["platform"]},req.body);
        req.BaseFunctions.LinkAccountSubmitOTP(params).then((response)=>{
        res.json(response);
        })
    })
}