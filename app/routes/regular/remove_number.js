
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/remove_phone_number`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.RemoveSecondaryNumber(params).then((response)=>{
        res.json(response);
        })
    })
}