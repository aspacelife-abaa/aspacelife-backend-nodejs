
const GetUserDetails = (phoneNumber,DBQuery)=>{
    return new Promise((resolve)=>{
        DBQuery(`select * from users where PhoneNumber='${phoneNumber}' limit 1`).then((res)=>{
         resolve(res)
        }) 
    })
}
module.exports = {GetUserDetails};