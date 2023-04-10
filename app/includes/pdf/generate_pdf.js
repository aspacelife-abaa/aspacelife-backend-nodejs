// var pdf = require("pdf-creator-node");
var fs = require("fs");
const GeneratePDF = async(data)=>{
var html = await fs.readFileSync(`${__dirname}/template.html`, "utf8");
 return new Promise((resolve)=>{
  resolve({})
  // var options = {
  //   format: "A3",
  //   orientation: "portrait",
  //   border: "10mm",
  //   header: {
  //       height: "45mm",
  //       contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
  //   },
  //   footer: {
  //       height: "28mm",
  //       contents: {
  //           first: 'Cover page',
  //           2: 'Second page', // Any page number is working. 1-based index
  //           default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
  //           last: 'Last Page'
  //       }
  //   }
  // };
  // var users = [
  //   {
  //     name: "Shyam",
  //     age: "26",
  //   },
  //   {
  //     name: "Navjot",
  //     age: "26",
  //   },
  //   {
  //     name: "Vitthal",
  //     age: "26",
  //   },
  // ];
  // var doc = {
  //   html:html,
  //   data: {
  //     users: users,
  //   },
  //   path:`./public/transaction_history.pdf`,
  //   type: "",
  // };
  // pdf.create(doc, options).then((res) => {
  //   // send email
  //   console.log(res);
  //   resolve(res)
  // }).catch((error) => {
  //   console.error(error);
  //   resolve(error)
  // })
})
}
module.exports = {GeneratePDF};