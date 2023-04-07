
const GetWalletBalance = (phoneNumber,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * from wallets where phone_number='${phoneNumber}' limit 1`).then((res)=>{
         resolve(res)
        }) 
    })
}
module.exports = { GetWalletBalance};