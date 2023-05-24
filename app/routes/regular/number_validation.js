
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/meter_number_verification`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.NumberMeterValidation(params).then((response)=>{
        res.json(response);
        })
    })
}