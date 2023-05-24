
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/send_msg_to_seller`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.SendSMSToSeller(params).then((response)=>{
        res.json(response);
        })
    })
}