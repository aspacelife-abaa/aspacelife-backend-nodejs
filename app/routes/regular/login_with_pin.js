const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/login_with_PIN`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.LoginWithPIN(params).then((response)=>{
        res.json(response);
        })
    })
}