const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/nin_verification_img`,(req, res) =>{
        const params  = Object.assign(req.body);
        req.BaseFunctions.NINVerificationImage(params).then((response)=>{
        res.json(response);
        })
    })
}