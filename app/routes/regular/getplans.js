const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/get_subscription_plans`,(req, res) =>{
        const params  = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetSubscriptionPlans(params).then((response)=>{
        res.json(response);
        })
    })
}