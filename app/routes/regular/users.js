
const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/valid_users`,(req, res) =>{
        req.BaseFunctions.ValidUSERS().then((response)=>{
        res.json(response);
        })
    })
}