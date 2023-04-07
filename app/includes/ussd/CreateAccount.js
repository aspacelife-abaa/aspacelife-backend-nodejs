const {NinVerification} = require("../NinVerification");
const {EnCrypPassword} = require('../security');
const {SendSMS} = require("../sms");
const CreateAccount = (text,createAccountObj,DBQuery,resquestData)=>{
    return new Promise((resolve)=>{
    if(String(text) == "")
    {
      resolve({
         status:false,
         message:`CON Main menu\n`+createAccountObj[0].options.map((a,i)=>`${i+1}. ${a.title}`).join("\n"),
         data:{}
      });
    }else{
     const code = String(text).split("*");
    if(String(code[0]) == "1")
     {
        if(code[1] !== undefined) 
        {
            // verify NIN
            if(code[1].length == 11)
            {
            NinVerification(String(code[1])).then((res)=>{
            // save data in users table
            if(res.status)
             {
             const {firstName,lastName,email} = res.data;
             // check if nin exist
             DBQuery(`select * from users where Nin='${code[1]}' limit 1`).then((ni)=>{
              if(ni.status)
             {
                resolve({
                    status:true,
                    message:`END NIN already registered.`,
                    data:{}
                 }); 
                return ;
             }
           if(code[2] !== undefined) 
            {
             if(String(code[2]).length >= 8) 
            { 
            if(code[3] !== undefined) 
            {
               if(String(code[3]).length != 4) 
               {
                  resolve({
                     status:false,
                     message:`END Transaction PIN must be 4 digits`,
                     data:{}
                  }); 
               }else{
               // create user account
               const msg = `Your have successfully created account on AbaaPay, your account No. is ${resquestData.phoneNumber}`;
               const nin = code[1];
               const password = EnCrypPassword(code[2]);
               const txPIN = EnCrypPassword(code[3]);
               resquestData.phoneNumber = "0"+resquestData.phoneNumber.replace("+234","");
               DBQuery(`insert into users(FirstName, LastName, PhoneNumber, EmailAddress, Password, Nin, TransactionPin, account_type,default_PhoneNumber) values('${firstName}','${lastName}','${resquestData.phoneNumber}','${email}','${password}','${nin}','${txPIN}','regular','${resquestData.phoneNumber}')`).then((res)=>{
               // send message
               if(res.status)
               {
               SendSMS(String(resquestData.phoneNumber),msg)
               } 
               resolve({
                  status:res.status,
                  message:`END ${res.status?msg:'Oops! account number not created.'}`,
                  data:{}
               }); 
            })
               }
            }else{
               resolve({
                  status:false,
                  message:`CON Enter transaction PIN`,
                  data:{}
               }); 
            //  DBQuery(`insert into users (FirstName,LastName,EmailAddress,PhoneNumber,Nin) values('${firstName}','${lastName}','${email}','${resquestData.phoneNumber}','${code[1]}')`);
            //  resolve({
            //     status:true,
            //     message:`CON Enter your Password`,
            //     data:{}
            //  }); 
            }
             }else{
                  resolve({
                     status:false,
                     message:`CON Password must be 8 characters and above`,
                     data:{}
                  }); 
               }
            }else{
               resolve({
                  status:false,
                  message:`CON \nEnter your password`,
                  data:{}
               });   
            }
            
            })
            }else{
               resolve({
                  status:false,
                  message:`END \nInvalid NIN number`,
                  data:{}
               });    
            }
            })
            }else{
                resolve({
                    status:true,
                    message:`END \nNIN must be 11 digits`,
                    data:{}
                 });   
            } 
        }else{
            resolve({
                status:false,
                message:`CON \nEnter your NIN`,
                data:{}
          });
        }
     }else if(String(code[0]) == "2")
     {
     
     }else if(String(text).includes("1*2"))
     {
     if(String(code).length == 2)
     {
     
     }else{
     
     }
     }else{
        
     }
    }
   })
}
module.exports = {CreateAccount};