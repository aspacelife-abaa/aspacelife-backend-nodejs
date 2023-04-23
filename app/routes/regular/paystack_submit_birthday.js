
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/confirm_birthday`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"],platform:req.headers["platform"]},req.body);
        req.BaseFunctions.LinkAccountSubmitBirthday(params).then((response)=>{
        res.json(response);
        })
    })
}