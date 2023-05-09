
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/remove_bank_account`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.RemoveLinkedAccount(params).then((response)=>{
        res.json(response);
        })
    })
}