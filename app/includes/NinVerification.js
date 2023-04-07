
const NinVerification = (Nin)=>{
  return new Promise((resolve)=>{
    resolve({
        status:true,
        message:"END calling NIN server",
        data:{
          firstName:"Hoo",
          lastName:"Max",
          email:"text@textmail.com"
        }
    })
  })
}
module.exports = {NinVerification};