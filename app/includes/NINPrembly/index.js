
const axios = require('axios');
const {SMSBaseUrl,SMSFolder,SenderID,FlutterWaveTestSecret} = require('../config');
const FormData = require('form-data');

const NINImageVerification = async(data)=>{
   const response = await Post(data)
    return response;
}
async function  Post(data){
let fdata = new FormData();
fdata.append('number', data.nin);
fdata.append('image',data.image);
console.log("<<data>>:",data);
    return new Promise((resolve)=>{
        let config = {
            method: 'post',
            url: 'https://api.prembly.com/identitypass/verification/nin_w_face',
            headers: { 
              'X-Api-Key': 'sandbox_sk_nFpcm8RrZ4ZiMgsDFCFsU8h6yg9MhuKTkzKjgTz', 
              'app_id': 'b9c83b51-a22a-4ff0-a9ec-0d1f7e4c0d53',
              'accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            data : fdata
          };
          axios.request(config).then((response) => {
            console.log(JSON.stringify(response.data));
            resolve(JSON.stringify(response.data))
          })
          .catch((error) => {
            console.error(error);
            resolve({
            status:false,
            message:error.message,
            data:{}
            })
          });
        })
    }
    module.exports = {NINImageVerification};
