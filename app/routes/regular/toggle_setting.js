
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/toggle_settings`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.ToggleSettings(params).then((response)=>{
        res.json(response);
        })
    })
}