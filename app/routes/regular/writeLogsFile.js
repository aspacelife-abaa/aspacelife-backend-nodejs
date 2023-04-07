const {version} = require('../../includes/config');
const SendSMS = require('../../includes/sms');

module.exports = (app)=>{
app.use(function(req, res, next){
    const logLine = `UserAgent:${req.headers['user-agent']},URL:${req.url},Body:${JSON.stringify(req.body)}`;
    // const x = await SendSMS("399393993","djjdjd");
    // console.log(x);
    next();
 })
}
