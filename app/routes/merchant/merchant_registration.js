const {version,DocumentUploadLimit} = require('../../includes/config');

module.exports = (app)=>{
    app.post(`/${version}/merchant_registration`,(req, res) =>{
        const params = req.body;
        req.BaseFunctions.MerchantRegistration(params).then((response)=>{
        res.json(response);
        })
    })
}