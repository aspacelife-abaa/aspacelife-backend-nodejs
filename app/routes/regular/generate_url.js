const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/payment_url`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GeneratePaymentLink(params).then((response)=>{
        res.json(response);
        })
    })
}