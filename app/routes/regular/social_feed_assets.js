const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/social_feed_assets`,(req, res) =>{
        req.BaseFunctions.PostAssets().then((response)=>{
        res.json(response);
        })
    })
}