
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/send_push_msg`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.SendPushNotification(params).then((response)=>{
        res.json(response);
        })
    })
}