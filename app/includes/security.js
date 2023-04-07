
const Md5 = require('md5');
const EnCrypPassword = (password)=>{
    return Md5(Md5(String(password)));
  }
const EmailValidator = require('email-validator');
const AntiHacking = (data)=>{
    return new Promise((resolve)=>{
      let checkedData = data;
      const whitelist = ["oldPassword","newPassword","Password"];
      
      Object.keys(checkedData).forEach((a,i)=>{
        if(!whitelist.includes(a) || !EmailValidator.validate(checkedData[a]))
        {
        let checkString = String(checkedData[a]);
        checkString = String(checkString).replace(/[&\/\\#,+()$~%=.'`"%!;?|:*?<>{}]/g, '');
        checkString = String(checkString).replace(/ or /g, '');
        checkedData[a] = checkString;
        }
      })
      resolve({error:false,data:checkedData})
    });
  }
  module.exports = {
    AntiHacking,
    EnCrypPassword
  }