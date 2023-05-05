
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/finger_print_login`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.FingerPrintLogin(params).then((response)=>{
        res.json(response);
        })
    })
}