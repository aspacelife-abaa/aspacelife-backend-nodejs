const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/link_account_payment_url`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GeneratePaymentLinkAccount(params).then((response)=>{
        res.json(response);
        })
    })
}