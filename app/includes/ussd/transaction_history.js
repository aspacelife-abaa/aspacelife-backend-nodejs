const moment = require("moment");
const { generateRandomNumber, MaskNumber, returnComma } = require("../utils");
const md5 = require("md5");
const { EnCrypPassword } = require("../security");
const TransactionHistory = (code,phoneNumber,DBQuery,mainOptions,u)=>{
    return new Promise((resolve)=>{
        UserExist(phoneNumber,DBQuery).then((res)=>{
        if(res.status)
        {
            if(EnCrypPassword(code[1]) !== String(u.TransactionPin))
            {
                resolve({
                    status:false,
                    message:`END Invalid transaction PIN`,
                    data:{}
                }) 
                return ;
            }
            DBQuery(`select * from transactions where PhoneNumber='${phoneNumber}' order by transaction_id desc limit 5`).then((res)=>{
            if(res.status)
            {
                resolve({
                    status:true,
                    message:res.data.length == 0?`END No transation found.`:`END Recent transactions:\n${res.data.map((a,i)=>`${i+1}. Amnt.: NGN${returnComma(a.amount)} - Date:${moment(a.transaction_date).format("DD/MM/YYYY")} Ref:${a.transaction_ref}`).join("\n")}`,
                    data:{}
                })
            }else{
                resolve({
                    status:false,
                    message:`END No transation found.`,
                    data:{}
                })
            }
        })
        }else{
            resolve({
                status:true,
                message:`END Oops! sorry no transaction found.`,
                data:{}
            })   
        }
    })
    })
}
const UserExist = (recepientNumber,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * from users where PhoneNumber='${recepientNumber}' limit 1`).then((res)=>{
          resolve(res)
        })
    })
}
module.exports = {TransactionHistory};

