const {version,jwtSecret} = require('../config');
// const jwt = require('express-jwt');
module.exports = (app)=>{
    app.post(`/${version}/ussd`,(req, res)=>{
        const params  = Object.assign(req.body,req.params);
        req.BaseFunctions.USSD(params).then((response)=>{
        res.send(response.message);
        })
    })
}