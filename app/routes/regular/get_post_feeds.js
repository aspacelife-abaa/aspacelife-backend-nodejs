const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/get_social_feed`,(req, res) =>{
        let params  = Object.assign({token:req.headers["token"]},req.body);
           req.BaseFunctions.GetSocialFeed(params).then((response)=>{
           res.json(response);
        })
    })
}