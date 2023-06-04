const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/login_with_pin_toggle`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.LoginWithPINToggle(params).then((response)=>{
        res.json(response);
        })
    })
}