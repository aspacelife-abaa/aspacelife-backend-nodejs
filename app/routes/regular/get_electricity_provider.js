
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/get_electricty_providers`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body,req.query);
        req.BaseFunctions.GetListElectricityProvider(params).then((response)=>{
        res.json(response);
        })
    })
}