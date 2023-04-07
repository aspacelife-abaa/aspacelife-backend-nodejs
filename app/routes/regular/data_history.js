
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/data_history`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetDataHistory(params).then((response)=>{
        res.json(response);
        })
    })
}