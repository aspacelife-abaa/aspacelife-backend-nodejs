const {version} = require('../../includes/config');
const {CloudinaryCall} = require('../../includes/cloudiray');
module.exports = (app)=>{
    app.post(`/${version}/create_social_feed`,(req, res) =>{
        let params  = Object.assign({token:req.headers["token"]},req.body);
        CloudinaryCall(params).then((data) => {
            params.imageString = JSON.stringify(data)
            console.log(params);
            req.BaseFunctions.PostSocialFeed(params).then((response)=>{
             res.json(response);
            })
        })
    })
}