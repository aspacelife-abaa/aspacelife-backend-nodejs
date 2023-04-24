
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/payment_confirm_pin`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"],platform:req.headers["platform"]},req.body);
        req.BaseFunctions.LinkAccountSubmitPIN(params).then((response)=>{
        res.json(response);
        })
    })
}