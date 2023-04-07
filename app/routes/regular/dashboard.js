
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/dashboard`,(req, res) =>{
        req.BaseFunctions.Dashboard(req.headers["token"]).then((response)=>{
        res.json(response);
        })
    })
}