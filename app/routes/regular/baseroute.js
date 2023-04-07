
const {version} = require('../../includes/config');
module.exports = (app)=>{
app.get("*",(req, res) =>{
    res.send("welcome to AbaaPay API-"+version)
})
app.post("*",(req, res) =>{
    res.send("welcome to AbaaPay API")
})
}