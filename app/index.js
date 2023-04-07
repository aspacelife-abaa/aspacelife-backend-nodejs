const express = require('express');
const cors  = require('cors');
// const rateLimit = require('express-rate-limit');
const app = express();
const bodyParser = require("body-parser");

require('dotenv').config();
const port = process.env.PORT || 6001;
let  appsetting = (req, res, next)=>{
    req.settings = process.env;
    req.BaseFunctions = require("./includes/functions");
    next();
}
const ErrorHandler = (Error,req, res)=>{
    res.status(Error.status || 500);
    res.send({status:false,message:Error.message || "Internal server Error",data:{}})
}
const ServerCalls = (req, res,next)=>{
 var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
next();
}
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, 
// 	max: 100,
// 	standardHeaders: true,
// 	legacyHeaders: false
// })

// app.use(limiter);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(ServerCalls);
app.use(express.static('./public'));
app.use(appsetting);
require("./router")(app);

app.use(ErrorHandler);
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))