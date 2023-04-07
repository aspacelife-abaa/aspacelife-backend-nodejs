const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/account_rules`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.AccountTypes(params).then((response)=>{
        res.json(response);
        })
    })
}