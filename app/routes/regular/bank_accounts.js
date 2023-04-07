
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/bank_accounts`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.BankAccounts(params).then((response)=>{
        res.json(response);
        })
    })
}