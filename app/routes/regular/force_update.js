const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/force_update`,(req, res) =>{
        req.BaseFunctions.ForceUpdate().then((response)=>{
        res.json(response);
        })
    })
}