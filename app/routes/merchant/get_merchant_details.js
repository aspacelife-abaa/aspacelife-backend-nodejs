const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/merchant_details`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetMerchantDetails(params).then((response)=>{
        res.json(response);
        })
    })
}