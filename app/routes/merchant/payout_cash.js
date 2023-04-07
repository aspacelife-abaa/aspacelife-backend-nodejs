const {version,DocumentUploadLimit} = require('../../includes/config');

module.exports = (app)=>{
    app.post(`/${version}/payout_cash`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.MerchantAcceptCash(params).then((response)=>{
        res.json(response);
        })
    })
}