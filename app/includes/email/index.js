const mailer = require('nodemailer');
const { 
    version,
    AppName,
    CustomerServiceEmail,
    CustomerServicePhoneNumber,
    DefaultEmail,
    DefaultEmailpassword,
    MailServerHost,
    MailServerPort
    } = require('../config');
    const os = require("os");
    console.log(os.homedir());
const {readFile} = require('fs');
const SendEmail = async(subject,body,user)=>{
    var options = {
        from:String(DefaultEmail),
        to:String(user.EmailAddress),
        subject,
        text:body,
        html:body
      };
      const html = await getTemplate(options,user);
      options.text = html;
      options.html = html;
     return await email_server_config(options);
}

const email_server_config = async(emailObj)=>{
  return new Promise((resolve)=>{ 
    const transporter = mailer.createTransport({
        host: MailServerHost,
        port: MailServerPort,
        secure: false, 
        auth: {
          user:DefaultEmail, 
          pass:DefaultEmailpassword 
        },
        tls: {
            rejectUnauthorized: false
          }
      });
      transporter.sendMail(emailObj, (error, info) => {
        if (error) {
            resolve({
              status:false,
              data:{},
              message:error.message
            })
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        resolve({
            status:true,
            data:info,
            message:`Email sent to ${emailObj.to}`
        })
      });
    })
}
const getTemplate = (options,user)=>{
  return new Promise((resolve)=>{
    readFile(__dirname+"/template.html",'utf8', function(err, data){
    if(err)
    {
      resolve("")
    }else{
      var html = data.replace(":subject",options.subject).replace(":body",options.text).replace(":name",user.FirstName)
      html = String(html).split(":email_assets_url").map((a)=>{
        return String(a).replace(":email_assets_url",os.hostname())
      }).join("");
      resolve(html)
    }
    })
  })
}
module.exports = {
  SendEmail
}