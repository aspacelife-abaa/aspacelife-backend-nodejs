const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/userdetails`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        if(params.PhoneNumber != undefined)
        {
            req.BaseFunctions.NonAuthGetUserDetails(params).then((response)=>{
            res.json(response);
            })
        }else{
        req.BaseFunctions.GetUserDetails(params).then((response)=>{
        res.json(response);
        })
    }
    })
}