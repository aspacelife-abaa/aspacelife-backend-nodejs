
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/transfer_to_merchant`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.TransferToMerchant(params).then((response)=>{
        res.json(response);
        })
    })
}