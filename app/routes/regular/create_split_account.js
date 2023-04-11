const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/create_split_payment`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.CreateSplitAccount(params).then((response)=>{
        res.json(response);
        })
    })
}