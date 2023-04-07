const {version,DocumentUploadLimit} = require('../../includes/config');

module.exports = (app)=>{
    app.post(`/${version}/verify_cash`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.MerchantVerifyCash(params).then((response)=>{
        res.json(response);
        })
    })
}