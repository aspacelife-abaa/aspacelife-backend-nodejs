
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/sendtoken`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.SendToken(params).then((response)=>{
          res.json(response);
        })
    })
}