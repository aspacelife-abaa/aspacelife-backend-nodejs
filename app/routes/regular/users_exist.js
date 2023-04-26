const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/users_exist`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetExistingContacts(params).then((response)=>{
        res.json(response);
        })
    })
}