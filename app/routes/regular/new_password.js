const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/new_password`,(req, res) =>{
        const params  = req.body
        req.BaseFunctions.NewPassword(params).then((response)=>{
        res.json(response);
        })
    })
}