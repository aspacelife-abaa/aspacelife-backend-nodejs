
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/token_verification`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.TokenVerification(params).then((response)=>{
        res.json(response);
        })
    })
}