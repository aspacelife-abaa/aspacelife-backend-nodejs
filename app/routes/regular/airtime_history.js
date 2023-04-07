
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/airtime_history`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetAirtimeHistory(params).then((response)=>{
        res.json(response);
        })
    })
}