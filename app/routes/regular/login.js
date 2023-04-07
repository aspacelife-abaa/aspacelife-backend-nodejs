
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/login`,(req, res) =>{
        const params = Object.assign(req.params,req.query,req.body)
        req.BaseFunctions.UserLogin(params).then((response)=>{
        res.json(response);
        })
    })
}