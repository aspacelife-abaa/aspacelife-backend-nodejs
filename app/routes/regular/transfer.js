
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/transfer`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.Transfer(params).then((response)=>{
        res.json(response);
        })
    })
}