
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/data_purchase`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.DataPurchase(params).then((response)=>{
        res.json(response);
        })
    })
}