const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/get_split_payment`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetSplitIndividualHistory(params).then((response)=>{
        res.json(response);
        })
    })
}