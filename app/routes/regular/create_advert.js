const {version} = require('../../includes/config');
module.exports = (app)=>{
    app.post(`/${version}/create_advert`,(req, res) =>{
        const params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.CreateAdvert(params).then((response)=>{
        res.json(response);
        })
    })
}