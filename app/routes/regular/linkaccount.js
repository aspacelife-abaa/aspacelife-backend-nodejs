
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/link_bank_account`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
       if(params.platform == "android" || params.platform == "ios")
       {
        req.BaseFunctions.LinkAccountMobile(params).then((response)=>{
          res.json(response);
        })
       }else{
        req.BaseFunctions.LinkAccount(params).then((response)=>{
        res.json(response);
        })
    }
    })
}