const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/confirm_payment`,(req, res) =>{
        const params  = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.ConfirmPayment(params).then((response)=>{
        res.json(response);
        })
    })
}