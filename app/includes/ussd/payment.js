const moment = require("moment");
const { NairaSymbol } = require("../config");
const {SendSMS} = require("../sms");
const { generateRandomNumber, MaskNumber, returnComma } = require("../utils");
const { uuid } = require('uuidv4');
const { EnCrypPassword } = require("../security");
const USSDPayment = (code,phoneNumber,DBQuery,mainOptions,u)=>{
    return new Promise((resolve)=>{
        let Options = mainOptions[2].options[0].options;
        // resolve({
        //     status:true,
        //     message:`CON ${JSON.stringify(Options)}`,
        //     data:{}
        //  })
        //  return ;
        if(String(code[1]) == "1")
        {
            if(String(code[2]) == "undefined")
            {  
                resolve({
                    status:true,
                    message:`CON ${Options[0]}`,
                    data:{}
                 })
            }else{ 
            const recepientNumber = String(code[2]);  
            if(recepientNumber.length != 11)
            {
                resolve({
                    status:true,
                    message:`END Wallet ID must be 11 characters`,
                    data:{}
                 })
            }else{
             if(String(code[3]) == "undefined")
            {  
                resolve({
                    status:true,
                    message:`CON ${Options[1]}`,
                    data:{}
                 })
            }else{
                if(String(code[4]) == "undefined")
                {  
                    resolve({
                        status:true,
                        message:`CON ${Options[2]}`,
                        data:{}
                     })
                }else{
                    if(String(u.TransactionPin) !== EnCrypPassword(String(code[4])))  
                    {
                        resolve({
                            status:true,
                            message:`END Invalid transaction PIN`,
                            data:{}
                         })
                    }else{
                   // tranfer wallet to wallet
                   VerifyWallet(String(u.PhoneNumber),DBQuery).then((UResponse)=>{   
                    const currentUserData = Object.assign(u,UResponse.data);
                    const amount = String(code[3]);  
                    if(phoneNumber == recepientNumber)
                    {
                        resolve({
                            status:false,
                            message:`END You cannot transfer to your wallet`,
                            data:{}
                        }) 
                    }else if(parseFloat(amount) > parseFloat(currentUserData.balance))
                    {
                    resolve({
                      status:false,
                      message:`END Insufficient balance. (Balance: NGN${returnComma(currentUserData.balance)})`,
                      data:{}
                      }) 
                    }else{
              const ref = String(md5(String(generateRandomNumber(20)))).toUpperCase().substring(0,5);
              // transfer to merchant wallet, update current user wallet
              const mainBalance = parseFloat(currentUserData.balance) - parseFloat(amount);
             
              DBQuery(`update wallets set balance='${mainBalance}' where phone_number='${currentUserData.PhoneNumber}' limit 1`).then((rse)=>{
                       if(rse.status)
                       {
                       // send sms 
                       SaveTransactionHistory({
                        amount:amount,
                        beneficiary_account:(currentUserData.PhoneNumber),
                        beneficiary_bank_name:"AbaaPay Wallet",
                        customer_name:currentUserData.FirstName+" "+currentUserData.LastName,
                        memo:"Wallet transfer",
                        PhoneNumber:(currentUserData.PhoneNumber),
                        token:"",
                        transaction_ref:ref,
                        transaction_type:"transfer",
                        status:"success"
                        },DBQuery);
                    }
                    resolve({
                        status:true,
                        message:rse.status?`END transfer was successful (Balance: NGN${mainBalance})`:'Oops! something when wrong, try again later',
                        data:{}
                        }) 
                })
                    }
                    } )
                    }
                }   
            }
            }
            }
        }else if(String(code[1]) == "2")
        {
            Options = mainOptions[2].options[1].options;
            if(String(code[2]) == "undefined")
            {  
                resolve({
                    status:true,
                    message:`CON ${Options[0]}`,
                    data:{}
                 })
            }else{  
            VerifyWallet(String(u.PhoneNumber),DBQuery).then((UResponse)=>{   
            let currentuserData = Object.assign(u,UResponse.data);
            const recipientPhone = String(code[2]);
            if(recipientPhone.length != 11)
            {
                resolve({
                    status:false,
                    message:`END recepient phone number must be 11 characters.`,
                    data:{}
                    }) 
                return ;
            }
          
            UserExist(recipientPhone,DBQuery).then((RCres)=>{
             
         let recipientData = RCres.status?RCres.data[0]:{PhoneNumber:recipientPhone};
         let recipientExist = RCres.status;
           
            if(String(code[3]) == "undefined")
            {  
                resolve({
                    status:true,
                    message:`CON ${Options[1]}`,
                    data:{}
                 })
            }else{ 
                const amount = code[3];
                if(String(code[4]) == "undefined")
                {  
                    resolve({
                        status:true,
                        message:`CON ${Options[2]}`,
                        data:{}
                     })
                }else{ 
            if(EnCrypPassword(String(code[4])) !== String(currentuserData.TransactionPin))
            {
                resolve({
                    status:true,
                    message:`END Invalid transaction PIN`,
                    data:{}
                 })
            }else{
             VerifyWallet(String(recipientData.PhoneNumber),DBQuery).then((MResponse)=>{   
            recipientData = Object.assign(recipientData,MResponse.data);
            
            if(recipientData.PhoneNumber == currentuserData.Password)
            {
                resolve({
                    status:false,
                    message:`END You cannot transfer to your wallet`,
                    data:{}
                    }) 

            }else if(parseFloat(amount) > parseFloat(currentuserData.balance))
            {
            resolve({
              status:false,
              message:`END Insufficient balance. (Balance: NGN${returnComma(currentuserData.balance)})`,
              data:{}
              }) 
            }else{
      const ref = uuid(); //String(md5(String(generateRandomNumber(20)))).toUpperCase().substring(0,5);
      // transfer to merchant wallet, update current user wallet
      const mainBalance = parseFloat(currentuserData.balance) - parseFloat(amount);
                DBQuery(`update wallets set balance='${mainBalance}' where phone_number='${currentuserData.PhoneNumber}' limit 1`).then((rse)=>{
               if(rse.status)
               {
               // send sms 
               SaveTransactionHistory({
                amount:amount,
                beneficiary_account:(currentuserData.PhoneNumber),
                beneficiary_bank_name:"AbaaPay Wallet",
                customer_name:currentuserData.FirstName+" "+currentuserData.LastName,
                memo:"Wallet transfer",
                PhoneNumber:(currentuserData.PhoneNumber),
                token:"",
                transaction_ref:ref,
                transaction_type:"transfer",
                status:"success"
                },DBQuery);
                // update merchant wallet
                  
         if(!recipientExist) 
         {
            let sms1 = `Hi, ${NairaSymbol}${returnComma(amount)} from ${currentuserData.FirstName} ${currentuserData.LastName} (${currentuserData.PhoneNumber})\n is ready for pick-up on AbaaPay Platform \nall you need is CODE:${ref} \nTime:${moment().format("DD/MM/YYYY hh:mm A")}`;
            SendSMS(String(recipientData.PhoneNumber),sms1); 
            // update transaction history
            InsertCompanyAccount({
              amount:amount,
              transactionFrom:(currentuserData.PhoneNumber),
              transactionTo:(recipientData.PhoneNumber),
              transactionRef:ref,
              transactionStatus:"pending"
            },DBQuery)
         }else{
          const RecepientMainBalance = parseFloat(recipientData.balance) + parseFloat(amount);
          DBQuery(`update wallets set balance='${RecepientMainBalance}' where phone_number='${recipientData.PhoneNumber}' limit 1`).then((mse)=>{
          if(mse.status)
         {
        // send sms 
        let sms1 = `Credit\nAmt:${NairaSymbol}${returnComma(amount)}\nAcc:${MaskNumber(String(recipientData.PhoneNumber))}\nDesc: transfer to Merchant ID (${recipientData.PhoneNumber} \nTime:${moment().format("DD/MM/YYYY hh:mm A")}\nTotal Bal:${NairaSymbol}${returnComma(String(RecepientMainBalance))}`;
        SendSMS(String(recipientData.PhoneNumber),sms1);
        SaveTransactionHistory({
        amount:amount,
        beneficiary_account:String(recipientData.PhoneNumber),
        beneficiary_bank_name:"AbaaPay Wallet",
        customer_name:recipientData.FirstName+" "+recipientData.LastName,
        memo:"Wallet funding",
        PhoneNumber:String(recipientData.PhoneNumber),
        token:"",
        transaction_ref:ref,
        transaction_type:"funding",
        status:"success"
        },DBQuery);
        // send sms to current user
        const sms2 = `Debit\nAmt:${NairaSymbol}${returnComma(amount)}\nAcc:${MaskNumber(String(currentuserData.PhoneNumber))}\nDesc: transfer to Merchant (${recipientData.FirstName} ${recipientData.LastName} ID: ${recipientData.PhoneNumber}\nRef:${ref} \nTime:${moment().format("DD/MM/YYYY hh:mm A")}\nTotal Bal:${NairaSymbol}${returnComma(String(mainBalance))}`;
        SendSMS(String(currentuserData.PhoneNumber),sms2);
        }
        
       resolve({
                status:true,
                message:`END NGN${returnComma(amount)} amount successfully sent`,
                data:{}
                }) 
              })
            }
       }
resolve({
        status:true,
        message:`END NGN${returnComma(amount)} amount successfully sent`,
        data:{}
        }) 
       });   
     }
    })
    }
    }
    }       
    })
    })
        }
        }else{
          resolve({
            status:true,
            message:`CON Welcome ${u.FirstName}\nMain menu:\n`+Object.values(mainOptions).filter((a,i)=>i < 3).map((a,i)=>`${i+1}. ${a.title}`).join("\n"),
            data:{}
        })
        }
    })
}
const VerifyWallet = (phoneNumber,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * from wallets where phone_number='${phoneNumber}' limit 1`).then((res)=>{
          if(res.status)
          {
            res.data = res.data[0];
          }else{
            res.data = {
                balance:0
            }
          }
          resolve(res)
        })
        
    })
}
const MerchantExist = (merchantId,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * from merchant_profile inner join users on merchant_profile.PhoneNumber=users.PhoneNumber where merchant_profile.merchantId='${merchantId}' limit 1`).then((res)=>{
          resolve(res)
        })
    })
}
const SaveTransactionHistory = (data,DBQuery)=>{
    return new Promise((resolve)=>{
    DBQuery(`INSERT INTO transactions(beneficiary_account,transaction_type,amount,PhoneNumber,memo,customer_name, beneficiary_bank_name, transaction_ref, transaction_status) VALUES ('${data.beneficiary_account}','${data.transaction_type}','${data.amount}','${data.PhoneNumber}','${data.memo}','${data.customer_name}', '${data.beneficiary_bank_name}', '${data.transaction_ref}', '${data.status}')`).then((res)=>{
      resolve(res);
    });
  })
  }
  const UserExist = (recepientNumber,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * from users where PhoneNumber='${recepientNumber}' limit 1`).then((res)=>{
          resolve(res)
        })
    })
}
const InsertCompanyAccount = (data,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * into BaseAccount transactionTo='${data.transactionRef}' and refNo='${data.transactionRef}' limit`).then((res)=>{
            if(!res.status)
            {
            DBQuery(`insert into BaseAccount (transactionFrom,transactionTo,refNo,transactionStatus,transactionAmount) values('${data.transactionFrom}','${data.transactionTo}','${data.transactionRef}','${data.transactionStatus}','${data.amount}')`);
            }
            resolve(res);
            })
    })
}
module.exports = {USSDPayment};



