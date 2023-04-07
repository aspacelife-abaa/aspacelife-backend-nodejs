
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/wallet-funding`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.WalletFunding(params).then((response)=>{
        res.json(response);
        })
    })
}