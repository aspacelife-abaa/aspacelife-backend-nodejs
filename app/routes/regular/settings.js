
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/settings`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.UserSettings(params).then((response)=>{
        res.json(response);
        })
    })
}