const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret, AIRTIMENG_APIToken, AppName} = require('../config');
const fs  = require('fs');
const {
    BinToHex,
    CountryList,
    CountryModel,
    DataDecryption,
    DataEncryption,
    HexToBin,
    generateRandomNumber,
    returnComma,
    ValidateBOD,
    MaskNumber
  }  = require('../utils');
const {GetWalletBalance} = require("./getWalletBalance");
const {GetUserDetails} = require("./GetUserDetails");
const {CreateAccount} = require("./CreateAccount");
const {USSDPayment} = require("./payment");
const {TransactionHistory} = require("./transaction_history");
const { EnCrypPassword } = require("../security");

const USSDEventCallback = async(data,DBQuery)=>{
return new Promise((resolve)=>{
let {text,phoneNumber} = data;
const Option = fs.readFileSync(__dirname+"/options.json",{encoding:'utf8', flag:'r'})
const OptionsList = JSON.parse(Option); 
const code = String(text).split("*");
var mainOptions = Object.keys(OptionsList);

if(typeof DBQuery == 'function')
   {
      
    phoneNumber = phoneNumber.replace("+234","0");
    const creatAccountObj  = mainOptions.filter((a,i)=>i == 3).map((a,i)=>OptionsList[a]);
    GetUserDetails(phoneNumber,DBQuery).then((res)=>{
    if(res.status)
    {
    const currentuser = res.data[0];
    if(text === "")
    {
        resolve({
            status:true,
            message:`CON Welcome ${currentuser.FirstName}\nMain menu:\n`+mainOptions.filter((a,i)=>i < 3).map((a,i)=>`${a}. ${OptionsList[a].title}`).join("\n"),
            data:{}
        })
    }else{
    if(OptionsList.hasOwnProperty(text))
    {
        const Optionobj = OptionsList[parseInt(text)];
        resolve({
            status:true,
            message:`CON ${Optionobj.description != ""?Optionobj.description+"\n":""}`+Optionobj.options.map((a,i,self)=>{
                // const obj = Object.keys(a);
                return `${a.show?i+1+". ":""}${a.title}`
            }).join("\n"),
            data:{}
        })
    }else if(String(code[0]) == "1")
    {
        const Pin = String(code[1]).trim();
        if(String(currentuser.TransactionPin) !== EnCrypPassword(Pin))
        {
            resolve({
                status:false,
                message:`END Invalid transaction PIN`,
                data:{}
            });  
         return ;   
        }
        GetWalletBalance(phoneNumber,DBQuery).then((res)=>{
            if(res.status)
            {
            if(res.data)
            {
            res.data = res.data[0];
            res.message = `END Hi ${currentuser.FirstName}, \nYour ${AppName} Wallet balance is: NGN${returnComma(res.data.balance)}`
            // save to ussd table
            } 
            resolve(res);
            }else{
            res.message = `END Your balance is:NGN0.00`
            resolve(res);
            }
        })
    }else if(String(code[0]) == "2")
    {
    USSDPayment(code,phoneNumber,DBQuery,OptionsList,currentuser).then((res)=>{
     resolve(res);
    })
    }else if(String(code[0]) == "3")
    {
     TransactionHistory(code,phoneNumber,DBQuery,OptionsList,currentuser).then((res)=>{
        resolve(res);
     })
    }else{
        var options = Object.keys(OptionsList);
        resolve({
            status:false,
            message:`CON ${text} Main menu:\n`+options.map((a,i)=>`${a}.${OptionsList[a].title}`).join("\n"),
            data:{}
        })    
    }
    }
    }else{
     CreateAccount(text,creatAccountObj,DBQuery,data).then((res)=>{
        resolve(res);
     })
    }
    })
}else{
    resolve({
        status:false,
        message:"END DBQuery function is required.",
        data:{}
    })
}
})  


}
module.exports = {USSDEventCallback}
