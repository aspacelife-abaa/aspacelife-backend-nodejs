const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/pickup_cash`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.PickUpCash(params).then((response)=>{
        res.json(response);
        })
    })
}