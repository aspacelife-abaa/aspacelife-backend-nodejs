
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/get_airtime_providers`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetAirtimeProviders(params).then((response)=>{
        res.json(response);
        })
    })
}