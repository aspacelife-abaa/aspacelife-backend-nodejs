const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/change_password`,(req, res) =>{
        const params  = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.ChangePassword(params).then((response)=>{
        res.json(response);
        })
    })
}