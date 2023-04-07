
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/register`,(req, res) =>{
        const params = Object.assign(req.params,req.query,req.body)
        req.BaseFunctions.Registration(params).then((response)=>{
        res.json(response);
        })
    })
}