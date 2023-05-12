
const {version} = require('../../includes/config');
const multer = require("multer");
const upload = multer({ dest: 'uploads/'})
module.exports = (app)=>{
    app.post(`/${version}/user_verify_cash_pickup`,upload.single('image_upload'),(req, res,next) =>{
        let params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        req.BaseFunctions.UserVerifyCash(params).then((response)=>{
        res.json(response);
        })
    })
}