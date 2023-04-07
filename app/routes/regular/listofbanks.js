
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/listofbanks`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.ListBanks(params).then((response)=>{
        res.json(response);
        })
    })
}