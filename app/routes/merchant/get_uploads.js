const {version,DocumentUploadLimit} = require('../../includes/config');

module.exports = (app)=>{
    app.post(`/${version}/get_uploads`,(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        req.BaseFunctions.GetAllUploads(params).then((response)=>{
        res.json(response);
        })
    })
}