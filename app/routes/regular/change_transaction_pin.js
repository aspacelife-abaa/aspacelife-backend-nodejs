
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/change_transaction_pin`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.ChangeTransactionPIN(params).then((response)=>{
        res.json(response);
        })
    })
}