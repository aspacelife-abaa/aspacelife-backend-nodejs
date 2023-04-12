const {version} = require('../../includes/config');
const multer = require('multer');
const upload = multer({dest:"public/temp"})
module.exports = (app)=>{
    const fileFilter = (req) => {
        return new Promise((resolve)=>{
        if(req.file)
        {
        let extSplit = String(req.file.originalname).split(".");
        let extn = extSplit[extSplit.length - 1];
        if(["png","jpeg","jpg"].includes(String(extn).toLowerCase())){
         
         resolve({
            status:true,
            message:"",
            data:req.file.path
        });
       }else{
        resolve({
            status:false,
            message:"",
            data:{}
        });
       }
    }
    })
    }
   
    app.post(`/${version}/create_social_feed`,upload.single('imageUpload'),(req, res) =>{
         
        let params  = Object.assign({token:req.headers["token"]},req.body);
        fileFilter(req).then((e)=>{
            if(e.status)
            {
            params.imageUpload = e.data;
            req.BaseFunctions.PostSocialFeed(params).then((response)=>{
             res.json(response);
            })
            }else{
             res.json(e);
            }
        })
    })
}