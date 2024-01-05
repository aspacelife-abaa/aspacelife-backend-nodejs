const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/contact-us`,(req, res) =>{
       
        const params = Object.assign(req.params,req.query,req.body);
        req.BaseFunctions.ContactUs(params).then((response)=>{
        res.json(response);
        })
    })
}