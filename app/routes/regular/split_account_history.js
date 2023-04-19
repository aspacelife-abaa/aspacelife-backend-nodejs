const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/split_payment_history`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.SplitAccountHistory(params).then((response)=>{
        res.json(response);
        })
    })
}