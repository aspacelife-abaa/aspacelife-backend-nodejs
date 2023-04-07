
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/purchase_electricity`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.ElectricityPurchase(params).then((response)=>{
        res.json(response);
        })
    })
}