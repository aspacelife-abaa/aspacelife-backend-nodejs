
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/add_phonenumber`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.SecondaryNumber(params).then((response)=>{
        res.json(response);
        })
    })
}