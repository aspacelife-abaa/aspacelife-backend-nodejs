
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/number_validation`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.NumberValidation(params).then((response)=>{
        res.json(response);
        })
    })
}