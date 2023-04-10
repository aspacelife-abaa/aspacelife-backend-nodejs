const {SMSBaseUrl,SMSFolder,SenderID,AFRICATALKING_APIKEY,AFRICATALKING_USERNAME, AppName} = require('../config');
const Axios = require('axios');
const xml = require('xml-js');
var FormData = require('form-data');

const BuyAirtimeAfricaTalking = async(numbers,message)=>{
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
        data.append('recipients',JSON.stringify([{phoneNumber:"+234"+parseInt(String(body.numbers).replace("+234","")),amount:"NGN"}]));
        var config = {
        method: 'post',
        url: "https://api.africastalking.com/version1/airtime/send",
        headers: { 
            'apiKey': AFRICATALKING_APIKEY, 
            ...data.getHeaders()
        },
        data : data
        };

        Axios(config).then(function (response) {
        resolve({
            status:true,
            message:"",
            data:JSON.parse(xml.xml2json(response.data))
        })
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

module.exports = {BuyAirtimeAfricaTalking};