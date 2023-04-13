
const Md5 = require('md5');
const EnCrypPassword = (password)=>{
    return Md5(Md5(String(password)));
  }
const EmailValidator = require('email-validator');
const AntiHacking = (data)=>{
    return new Promise((resolve)=>{
      let checkedData = data;
      let blackList = [];
      let blackListRegex = /^[\/\\,+()$~%='`"%!;-?|:*?<>{}]/g;
      let whitelist = ["imageString"];
      Object.keys(checkedData).forEach((a,i)=>{
        if(String(checkedData[a]).match(blackListRegex) && whitelist.indexOf(a) == -1)
        {
          blackList.push({a:checkedData[a]});
        }
      })
      console.log(blackList.length != 0);
      resolve({error:blackList.length != 0,data:blackList.length !== 0?{}:checkedData})
    });
  }
  module.exports = {
    AntiHacking,
    EnCrypPassword
  }