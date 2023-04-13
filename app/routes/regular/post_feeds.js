const {version} = require('../../includes/config');
const cloudary = require('../../includes/cloudiray');
module.exports = (app)=>{
    app.post(`/${version}/create_social_feed`,(req, res) =>{
        let params  = Object.assign({token:req.headers["token"]},req.body);
        const clres = cloudary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',{
         public_id: "social_feed",
         folder:"social_feed",
        })
        clres.then((data) => {
            params.imageString = JSON.stringify({
            id:data.public_id,
            url:data.secure_url
            })
            console.log(params);
            req.BaseFunctions.PostSocialFeed(params).then((response)=>{
             res.json(response);
            })
        })
    })
}