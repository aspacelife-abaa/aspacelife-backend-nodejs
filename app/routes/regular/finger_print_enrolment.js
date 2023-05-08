
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/finger_print_enrolment`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.FingerPrintEnrol(params).then((response)=>{
        res.json(response);
        })
    })
}