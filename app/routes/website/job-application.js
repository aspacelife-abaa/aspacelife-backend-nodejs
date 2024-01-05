const {version} = require('../../includes/config');
const multer = require("multer");
const upload = multer({ dest: 'uploads/'})
module.exports = (app)=>{
    app.post(`/${version}/job-application`,upload.single('resume'),(req, res) =>{
       
        const params = Object.assign(req.params,req.query,req.body,{doc:req.file});
        req.BaseFunctions.JobApplication(params).then((response)=>{
        res.json(response);
        })
    })
}