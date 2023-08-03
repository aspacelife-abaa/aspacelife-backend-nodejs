
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/valid_users`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.ValidUSERS(params).then((response)=>{
        res.json(response);
        })
    })
}