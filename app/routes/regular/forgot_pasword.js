const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/forgot_password`,(req, res) =>{
        const params  = req.body;
        req.BaseFunctions.ForgotPassword(params).then((response)=>{
        res.json(response);
        })
    })
}