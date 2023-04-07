const {version} = require('../../includes/config');

module.exports = (app)=>{
    app.post(`/${version}/transactions`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.AdminTransactions(params).then((response)=>{
        res.json(response);
        })
    })
}