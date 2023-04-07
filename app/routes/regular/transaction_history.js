
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/transaction-history`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetTransactionHistory(params).then((response)=>{
        res.json(response);
        })
    })
}