
const CheckUser = (phoneNumber,DBQuery)=>{
   return new Promise((resolve)=>{
    // res.data = {}
    // if(res.data.TransactionPIN == null || res.data.Password == null)
    // {
    //     CreateAccount(text,creatAccountObj,DBQuery,data,currentuser).then((res)=>{
    //         resolve(res);
    //      })
    //   return;  
    // }
    // // save to ussd table
    // DBQuery(`select * from ussd where PhoneNumber='${phoneNumber}' limit 1`).then((res)=>{
    //  if(!res.status)
    //  {
    //  DBQuery(`insert into ussd (PhoneNumber,accessToken) values('${phoneNumber}','${accessToken}') `)
    //  }else{
    //  DBQuery(`update ussd set accessToken='${accessToken}' where PhoneNumber='${phoneNumber}' limit 1`);
    //  }
    // })
    // res.message = `CON Welcome ${currentuser.FirstName}\nMain menu:\n`+mainOptions.filter((a,i)=>i < 3).map((a,i)=>`${a}. ${OptionsList[a].title}`).join("\n");
    // resolve(res);
})
}

module.exports = {CheckUser};