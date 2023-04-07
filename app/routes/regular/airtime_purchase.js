
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/airtime_purchase`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.PurchaseAirtime(params).then((response)=>{
        res.json(response);
        })
    })
}