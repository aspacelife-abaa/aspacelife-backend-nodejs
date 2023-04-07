const {version} = require('../../includes/config');

module.exports = (app)=>{
    app.post(`/${version}/delete_upload`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.DeleteUploads(params).then((response)=>{
        res.json(response);
        })
    })
}