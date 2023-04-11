const {SMSBaseUrl,SMSFolder,SenderID,AFRICATALKING_APIKEY,AFRICATALKING_USERNAME, AppName} = require('../config');
const Axios = require('axios');
const xml = require('xml-js');
var FormData = require('form-data');

const SendSMSAfricaTalking = async(numbers,message)=>{
    return Post({
        numbers,
        message
    });
}
async function  Post(body){
    return new Promise((resolve)=>{
       if(body.numbers === "" || body.numbers === undefined)
       {
       return {
            message:"Oops! mobile number(s) is required.",
            data:null,
            status:false
        };
       }else if(body.message === "" || body.message === undefined)
       {
        return{
            message:"Oops! message is required.",
            data:null,
            status:false
        };
       }else{
        var data = new FormData();
        data.append('username', AFRICATALKING_USERNAME);
        data.append('to',"+234"+parseInt(String(body.numbers).replace("+234","")));
        data.append('message',body.message);
        var config = {
        method:'post',
        url: 'https://api.africastalking.com/version1/messaging',
        headers: { 
            'apiKey': AFRICATALKING_APIKEY+"k", 
            ...data.getHeaders()
        },
        data : data
        };

        Axios(config).then(function (response) {
            const rep = {
                status:true,
                message:"",
                data:JSON.parse(xml.xml2json(response.data))
            }
        console.log(rep,"|",JSON.stringify(data));
        resolve(rep)
        }).catch(function (error) {
        console.log(error);
        resolve({
            status:false,
            message:"",
            data:error.message
        })
        });
}
 })
}

module.exports = {SendSMSAfricaTalking};