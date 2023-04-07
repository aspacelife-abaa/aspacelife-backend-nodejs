
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/account_verification`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.AccountVerification(params).then((response)=>{
        res.json(response);
        })
    })
}