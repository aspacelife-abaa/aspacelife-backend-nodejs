const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/account_activation`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.ActivateBankAccounts(params).then((response)=>{
        res.json(response);
        })
    })
}