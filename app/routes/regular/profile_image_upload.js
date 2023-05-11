
const {version} = require('../../includes/config');
const multer = require("multer");
const upload = multer({ dest: 'uploads/'})
module.exports = (app)=>{
    app.post(`/${version}/profile_image_upload`,upload.single('image_upload'),(req, res,next) =>{
        let params = Object.assign(req.params,{token:req.headers["token"]},req.query,req.body)
        if(!req.file)
        {
        res.json({
            status:false,
            message:`Please upload an image`,
            data:{}
        })
        return ;
        }
        let extn = "";
        if(req.file?.mimetype)
        {
            let extnSplt = String(req.file?.mimetype).split("/");  
            extn = extnSplt[extnSplt.length - 1];  
        }
        params.image_path = req.file.path+"."+extn;
        req.BaseFunctions.ProfileImageUpload(params).then((response)=>{
        res.json(response);
        })
    })
}