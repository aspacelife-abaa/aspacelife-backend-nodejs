const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/nin_verification_image`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.NINVerificationImage(params).then((response)=>{
        res.json(response);
        })
    })
}