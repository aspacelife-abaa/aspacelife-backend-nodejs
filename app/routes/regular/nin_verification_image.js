const {version} = require('../../includes/config');
const multer = require("multer");
const upload = multer({ dest: 'uploads/'})
module.exports = (app)=>{
    app.post(`/${version}/nin_verification_img`,upload.single('faceImage'),(req, res) =>{
        const params  = Object.assign({faceImage:req.file},req.body);
        req.BaseFunctions.NINVerificationImage(params).then((response)=>{
        res.json(response);
        })
    })
}