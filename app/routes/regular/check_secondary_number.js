const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/verify_secondary_number`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.SecondaryNumberVerification(params).then((response)=>{
        res.json(response);
        })
    })
}