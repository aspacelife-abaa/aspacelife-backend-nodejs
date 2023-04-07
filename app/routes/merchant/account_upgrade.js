const {version,DocumentUploadLimit} = require('../../includes/config');
const multer = require('multer');
const upload = multer({dest:"public/temp"})
module.exports = (app)=>{
    app.post(`/${version}/account_upgrade`,upload.array('files', DocumentUploadLimit),(req, res) =>{
        const params = Object.assign({token:req.headers["token"]},req.body);
        params.files = req.files;
        req.BaseFunctions.AccountUpgrade(params).then((response)=>{
        res.json(response);
        })
    })
}