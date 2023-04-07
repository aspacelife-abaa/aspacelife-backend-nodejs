const Moment = require('moment');

const CountryList = ()=>{
    //https://emojipedia.org/flags/
var countries = [];
countries.push(CountryModel("AFG", "Afghanistan", "+93", "�9�6�9�1"))
countries.push(CountryModel("ALB", "Albania", "+355", "�9�6�9�7"))
countries.push(CountryModel("DZA", "Algeria", "+213", "�9�9�9�1"))
countries.push(CountryModel("ASM", "American Samoa", "+1684", "�9�6�9�4"))
countries.push(CountryModel("AND", "Andorra", "+376", "�9�6�9�9"))
countries.push(CountryModel("AGO", "Angola", "+244", "�9�6�9�0"))
countries.push(CountryModel("AIA", "Anguilla", "+1264", "�9�6�9�4"))
countries.push(CountryModel("ATA", "Antarctica", "+672", "�9�6�9�2"))
countries.push(CountryModel("ATG", "Antigua and Barbuda", "+1268", "�9�6�9�2"))
countries.push(CountryModel("ARG", "Argentina", "+54", "�9�6�9�3"))
countries.push(CountryModel("ARM", "Armenia", "+374", "�9�6�9�8"))
countries.push(CountryModel("ABW", "Aruba", "+297", "�9�6�9�8"))
countries.push(CountryModel("AUS", "Australia", "+61", "�9�6�9�6"))
countries.push(CountryModel("AUT", "Austria", "+43", "�9�6�9�5"))
countries.push(CountryModel("AZE", "Azerbaijan", "+994", "�9�6�9�1"))
countries.push(CountryModel("BHS", "Bahamas", "+1242", "�9�7�9�4"))
countries.push(CountryModel("BHR", "Bahrain", "+973", "�9�7�9�3"))
countries.push(CountryModel("BGD", "Bangladesh", "+880", "�9�7�9�9"))
countries.push(CountryModel("BRB", "Barbados", "+1242", "�9�7�9�7"))
countries.push(CountryModel("BLR", "Belarus", "+375", "�9�7�9�0"))
countries.push(CountryModel("BEL", "Belgium", "+32", "�9�7�9�0"))
countries.push(CountryModel("BLZ", "Belize", "+501", "�9�7�9�1"))
countries.push(CountryModel("BEN", "Benin", "+229", "�9�7�9�5"))
countries.push(CountryModel("BMU", "Bermuda", "+1441", "�9�7�9�8"))
countries.push(CountryModel("BTN", "Bhutan", "+975", "�9�7�9�5"))
countries.push(CountryModel("BOL", "Bolivia", "+591", "�9�7�9�0"))
countries.push(CountryModel("BIH", "Bosnia and Herzegovina", "+387", "�9�7�9�6"))
countries.push(CountryModel("BWA", "Botswana", "+267", "�9�7�9�8"))
countries.push(CountryModel("BRA", "Brazil", "+55", "�9�7�9�3"))
countries.push(CountryModel("IOT", "British Indian Ocean Territory", "+246", "�9�4�9�0"))
countries.push(CountryModel("VGB", "Virgin Islands (British)", "+1284", "�9�7�9�2"))
countries.push(CountryModel("BRN", "Brunei Darussalam", "+673", "�9�7�9�9"))
countries.push(CountryModel("BGR", "Bulgaria", "+359", "�9�7�9�2"))
countries.push(CountryModel("BFA", "Burkina Faso", "+226", "�9�7�9�1"))
countries.push(CountryModel("BDI", "Burundi", "+257", "�9�7�9�4"))
countries.push(CountryModel("KHM", "Cambodia", "+855", "�9�6�9�3"))
countries.push(CountryModel("CMR", "Cameroon", "+237", "�9�8�9�8"))
countries.push(CountryModel("CAN", "Canada", "+1", "�9�8�9�6"))
countries.push(CountryModel("CPV", "Cape Verde", "+238", "�9�8�9�7"))
countries.push(CountryModel("CYM", "Cayman Islands", "+345", "�9�6�9�0"))
countries.push(CountryModel("RCA", "Central African Republic", "+236", "�9�8�9�1"))
countries.push(CountryModel("TCD", "Chad", "+235", "�9�5�9�9"))
countries.push(CountryModel("RCH", "Chile", "+56", "�9�8�9�7"))
countries.push(CountryModel("CHN", "China", "+86", "�9�8�9�9"))
countries.push(CountryModel("CXR", "Christmas Island", "+61", "�9�8�9�9"))
countries.push(CountryModel("CCK", "Cocos (Keeling) Islands", "+61", "�9�8�9�8"))
countries.push(CountryModel("COL", "Colombia", "+57", "�9�8�9�0"))
countries.push(CountryModel("COM", "Comoros", "+269", "�9�6�9�8"))
countries.push(CountryModel("COG", "Congo (Congo-Brazzaville)", "+242", "�9�8"))
countries.push(CountryModel("COK", "Cook Islands", "+682", "�9�8�9�6"))
countries.push(CountryModel("CRI", "Costa Rica", "+506", "�9�8�9�3"))
countries.push(CountryModel("HRV", "Croatia (Hrvatska)", "+385", "�9�3�9�3"))
countries.push(CountryModel("CUB", "Cuba", "+53", "�9�8�9�6"))
countries.push(CountryModel("CYP", "Cyprus", "+357", "�9�8�9�0"))
countries.push(CountryModel("CZE", "Czech Republic", "+420", "�9�8�9�1"))
countries.push(CountryModel("CIV", "Cote d'Ivoire", "+225", "�9�8�9�4"))
countries.push(CountryModel("COD", "Democratic Republic of the Congo", "+243", "�9�8�9�9"))
countries.push(CountryModel("DNK", "Denmark", "+45", "�9�9�9�6"))
countries.push(CountryModel("DJI", "Djibouti", "+253", "�9�9�9�5"))
countries.push(CountryModel("DMA", "Dominica", "+1767", "�9�9�9�8"))
countries.push(CountryModel("DOM", "Dominican Republic", "+1849", "�9�9�9�0"))
countries.push(CountryModel("ECU", "Ecuador", "+593", "�9�0�9�8"))
countries.push(CountryModel("EGY", "Egypt", "+20", "�9�0�9�2"))
countries.push(CountryModel("SLV", "El Salvador", "+503", "�9�4�9�7"))
countries.push(CountryModel("GNQ", "Equatorial Guinea", "+240", "�9�2�9�2"))
countries.push(CountryModel("ERI", "Eritrea", "+291", "�9�0�9�3"))
countries.push(CountryModel("EST", "Estonia", "+372", "�9�0�9�0"))
countries.push(CountryModel("ETH", "Ethiopia", "+251", "�9�0�9�5"))
countries.push(CountryModel("FLK", "Falkland Islands (Malvinas)", "+500", "�9�1�9�6"))
countries.push(CountryModel("FRO", "Faroe Islands", "+298", "�9�1�9�0"))
countries.push(CountryModel("FJI", "Fiji", "+679", "�9�1�9�5"))
countries.push(CountryModel("FIN", "Finland", "+358", "�9�1�9�4"))
countries.push(CountryModel("FRA", "France", "+33", "�9�1�9�3"))
countries.push(CountryModel("GUF", "French Guiana", "+594", "�9�2�9�1"))
countries.push(CountryModel("ATF", "French Southern Territories", "+262", "�9�5�9�1"))
countries.push(CountryModel("PYF", "French Polynesia", "+689", "�9�1�9�1"))
countries.push(CountryModel("GAB", "Gabon", "+241", "�9�2�9�6"))
countries.push(CountryModel("GMB", "Gambia", "+220", "�9�2�9�8"))
countries.push(CountryModel("GEO", "Georgia", "+995", "�9�2�9�0"))
countries.push(CountryModel("DEU", "Germany", "+49", "�9�9�9�0"))
countries.push(CountryModel("GHA", "Ghana", "+233", "�9�2�9�3"))
countries.push(CountryModel("GIB", "Gibraltar", "+350", "�9�2�9�4"))
countries.push(CountryModel("GBR", "Great Britain (UK)", "+44", "�9�2�9�7"))
countries.push(CountryModel("GRC", "Greece", "+30", "�9�2�9�3"))
countries.push(CountryModel("GRL", "Greenland", "+299", "�9�2�9�7"))
countries.push(CountryModel("GRD", "Grenada", "+1473", "�9�2�9�9"))
countries.push(CountryModel("GLP", "Guadeloupe", "+590", "�9�2�9�1"))
countries.push(CountryModel("GUM", "Guam", "+1671", "�9�2�9�6"))
countries.push(CountryModel("GCA", "Guatemala", "+502", "�9�2�9�5"))
countries.push(CountryModel("GBG", "Guernsey", "+44", "�9�2�9�2"))
countries.push(CountryModel("GIN", "Guinea", "+224", "�9�2�9�9"))
countries.push(CountryModel("GNB", "Guinea-Bissau", "+245", "�9�2�9�8"))
countries.push(CountryModel("GUY", "Guyana", "+592", "�9�2�9�0"))
countries.push(CountryModel("HTI", "Haiti", "+509", "�9�3�9�5"))
countries.push(CountryModel("VAT", "Holy See (Vatican City State)", "+379", "�9�7�9�6"))
countries.push(CountryModel("HND", "Honduras", "+504", "�9�3�9�9"))
countries.push(CountryModel("HKG", "Hong Kong", "+852", "�9�3�9�6"))
countries.push(CountryModel("HUN", "Hungary", "+36", "�9�3�9�6"))
countries.push(CountryModel("ISL", "Iceland", "+354", "�9�4�9�4"))
countries.push(CountryModel("IND", "India", "+91", "�9�4�9�9"))
countries.push(CountryModel("IDN", "Indonesia", "+62", "�9�4�9�9"))
countries.push(CountryModel("IRN", "Iran", "+98", "�9�4�9�3"))
countries.push(CountryModel("IRQ", "Iraq", "+964", "�9�4�9�2"))
countries.push(CountryModel("IRL", "Ireland", "+353", "�9�4�9�0"))
countries.push(CountryModel("GBM", "Isle Of Man", "+44", "�9�4�9�8"))
countries.push(CountryModel("ISR", "Israel", "+972", "�9�4�9�7"))
countries.push(CountryModel("ITA", "Italy", "+39", "�9�4�9�5"))
countries.push(CountryModel("JAM", "Jamaica", "+1876", "�9�5�9�8"))
countries.push(CountryModel("JPN", "Japan", "+81", "�9�5�9�1"))
countries.push(CountryModel("GBJ", "Jersey", "+44", "�9�5�9�0"))
countries.push(CountryModel("HKJ", "Jordan", "+962", "�9�5�9�0"))
countries.push(CountryModel("KAZ", "Kazakhstan", "+7", "�9�6�9�1"))
countries.push(CountryModel("KEN", "Kenya", "+254", "�9�6�9�0"))
countries.push(CountryModel("KIR", "Kiribati", "+686", "�9�6�9�4"))
countries.push(CountryModel("UNK", "Kosovo", "+383", "�9�9�9�6"))
countries.push(CountryModel("KWT", "Kuwait", "+965", "�9�6�9�8"))
countries.push(CountryModel("KGZ", "Kyrgyzstan", "+996", "�9�6�9�2"))
countries.push(CountryModel("LAO", "Lao People's Democratic Republic", "+856", "�9�7�9�6"))
countries.push(CountryModel("LVA", "Latvia", "+371", "�9�7�9�7"))
countries.push(CountryModel("LBN", "Lebanon", "+961", "�9�7�9�7"))
countries.push(CountryModel("LSO", "Lesotho", "+266", "�9�7�9�4"))
countries.push(CountryModel("LBR", "Liberia", "+231", "�9�7�9�3"))
countries.push(CountryModel("LBY", "Libya", "+218", "�9�7�9�0"))
countries.push(CountryModel("LIE", "Liechtenstein", "+423", "�9�7�9�4"))
countries.push(CountryModel("LTU", "Lithuania", "+370", "�9�7�9�5"))
countries.push(CountryModel("LUX", "Luxembourg", "+352", "�9�7�9�6"))
countries.push(CountryModel("MAC", "Macao", "+853", "�9�8�9�0"))
countries.push(CountryModel("MKD", "Macedonia", "+389", "�9�8�9�6"))
countries.push(CountryModel("MDG", "Madagascar", "+261", "�9�8�9�2"))
countries.push(CountryModel("MWI", "Malawi", "+265", "�9�8�9�8"))
countries.push(CountryModel("MYS", "Malaysia", "+60", "�9�8�9�0"))
countries.push(CountryModel("MDV", "Maldives", "+960", "�9�8�9�7"))
countries.push(CountryModel("MLI", "Mali", "+223", "�9�8�9�7"))
countries.push(CountryModel("MLT", "Malta", "+356", "�9�8�9�5"))
countries.push(CountryModel("MHL", "Marshall Islands", "+692", "�9�8�9�3"))
countries.push(CountryModel("MTQ", "Martinique", "+596", "�9�8�9�2"))
countries.push(CountryModel("MRT", "Mauritania", "+222", "�9�8�9�3"))
countries.push(CountryModel("MUS", "Mauritius", "+230", "�9�8�9�6"))
countries.push(CountryModel("MYT", "Mayotte", "+262", "�9�0�9�5"))
countries.push(CountryModel("MEX", "Mexico", "+52", "�9�8�9�9"))
countries.push(CountryModel("FSM", "Federated States of Micronesia", "+691", "�9�1�9�8"))
countries.push(CountryModel("MDA", "Moldova", "+373", "�9�8�9�9"))
countries.push(CountryModel("MCO", "Monaco", "+377", "�9�8�9�8"))
countries.push(CountryModel("MNG", "Mongolia", "+976", "�9�8�9�9"))
countries.push(CountryModel("MNE", "Montenegro", "+382", "�9�8�9�0"))
countries.push(CountryModel("MSR", "Montserrat", "+1664", "�9�8�9�4"))
countries.push(CountryModel("MAR", "Morocco", "+212", "�9�8�9�6"))
countries.push(CountryModel("MOZ", "Mozambique", "+258", "�9�8�9�1"))
countries.push(CountryModel("MMR", "Myanmar", "+95", "�9�8�9�8"))
countries.push(CountryModel("NAM", "Namibia", "+264", "�9�9�9�6"))
countries.push(CountryModel("NRU", "Nauru", "+674", "�9�9�9�3"))
countries.push(CountryModel("NPL", "Nepal", "+977", "�9�9�9�1"))
countries.push(CountryModel("NLD", "Netherlands", "+31", "�9�9�9�7"))
countries.push(CountryModel("NCL", "New Caledonia", "+687", "�9�9�9�8"))
countries.push(CountryModel("NZL", "New Zealand (Aotearoa)", "+64", "�9�9�9�1"))
countries.push(CountryModel("NIC", "Nicaragua", "+505", "�9�9�9�4"))
countries.push(CountryModel("NER", "Niger", "+227", "�9�9�9�0"))
countries.push(CountryModel("NGA", "Nigeria", "+234", "�9�9�9�2"))
countries.push(CountryModel("NIU", "Niue", "+683", "�9�9�9�6"))
countries.push(CountryModel("NFK", "Norfolk Island", "+1670", "�9�9�9�1"))
countries.push(CountryModel("PRK", "North Korea", "+672", "�9�6�9�1"))
countries.push(CountryModel("MNP", "Northern Mariana Islands", "+850", "�9�8�9�1"))
countries.push(CountryModel("NOR", "Norway", "+47", "�9�9�9�0"))
countries.push(CountryModel("OMN", "Oman", "+968", "�9�0�9�8"))
countries.push(CountryModel("PAK", "Pakistan", "+92", "�9�1�9�6"))
countries.push(CountryModel("PLW", "Palau", "+680", "�9�1�9�8"))
countries.push(CountryModel("PSE", "Palestinian Territory", "+970", "�9�1�9�4"))
countries.push(CountryModel("PAN", "Panama", "+507", "�9�1�9�6"))
countries.push(CountryModel("PNG", "Papua New Guinea", "+675", "�9�1�9�2"))
countries.push(CountryModel("PRY", "Paraguay", "+595", "�9�1�9�0"))
countries.push(CountryModel("PER", "Peru", "+51", "�9�1�9�0"))
countries.push(CountryModel("PHL", "Philippines", "+63", "�9�1�9�3"))
countries.push(CountryModel("PCN", "Pitcairn Islands", "+870", "�9�1�9�9"))
countries.push(CountryModel("POL", "Poland", "+48", "�9�1�9�7"))
countries.push(CountryModel("PRT", "Portugal", "+351", "�9�1�9�5"))
countries.push(CountryModel("PRI", "Puerto Rico", "+1939", "�9�1�9�3"))
countries.push(CountryModel("QAT", "Qatar", "+974", "�9�2�9�6"))
countries.push(CountryModel("RCB", "Republic of the Congo - Brazzaville", "+242", "�9�8�9�2"))
countries.push(CountryModel("ROU", "Romania", "+40", "�9�3�9�0"))
countries.push(CountryModel("RUS", "Russian Federation", "+7", "�9�3�9�6"))
countries.push(CountryModel("RWA", "Rwanda", "+250", "�9�3�9�8"))
countries.push(CountryModel("REU", "Reunion", "+262", "�9�3�9�0"))
countries.push(CountryModel("BLM", "Saint Barth��lemy", "+590", "�9�7�9�7"))
countries.push(CountryModel("SHN", "Saint Helena", "+290", "�9�4�9�3"))
countries.push(CountryModel("KNA", "Saint Kitts and Nevis", "+1869", "�9�6�9�9"))
countries.push(CountryModel("LCA", "Saint Lucia", "+1758", "�9�7�9�8"))
countries.push(CountryModel("MAF", "Saint Martin", "+590", "�9�8�9�1"))
countries.push(CountryModel("SPM", "Saint Pierre and Miquelon", "+508", "�9�1�9�8"))
countries.push(CountryModel("VCT", "Saint Vincent and the Grenadines", "+1784", "�9�7�9�8"))
countries.push(CountryModel("WSM", "Samoa", "+685", "�9�8�9�4"))
countries.push(CountryModel("RSM", "San Marino", "+378", "�9�4�9�8"))
countries.push(CountryModel("STP", "Sao Tome and Principe", "+239", "�9�4�9�5"))
countries.push(CountryModel("SAU", "Saudi Arabia", "+966", "�9�4�9�6"))
countries.push(CountryModel("SEN", "Senegal", "+221", "�9�4�9�9"))
countries.push(CountryModel("SRB", "Serbia", "+381", "�9�3�9�4"))
countries.push(CountryModel("SYC", "Seychelles", "+248", "�9�4�9�8"))
countries.push(CountryModel("WAL", "Sierra Leone", "+232", "�9�4�9�7"))
countries.push(CountryModel("SGP", "Singapore", "+65", "�9�4�9�2"))
countries.push(CountryModel("SXM", "Sint Maarten", "+1", "�9�4�9�9"))
countries.push(CountryModel("SVK", "Slovakia", "+421", "�9�4�9�6"))
countries.push(CountryModel("SVN", "Slovenia", "+386", "�9�4�9�4"))
countries.push(CountryModel("SLB", "Solomon Islands", "+677", "�9�4�9�7"))
countries.push(CountryModel("SOM", "Somalia", "+252", "�9�4�9�0"))
countries.push(CountryModel("ZAF", "South Africa", "+27", "�9�1�9�6"))
countries.push(CountryModel("SGS","S. Georgia and S. Sandwich Islands","+500","�9�2�9�4"))
countries.push(CountryModel("ROK", "South Korea", "+82", "�9�6�9�3"))
countries.push(CountryModel("SSD", "South Sudan", "+211", "�9�4�9�4"))
countries.push(CountryModel("ESP", "Spain", "+34", "�9�0�9�4"))
countries.push(CountryModel("LKA", "Sri Lanka", "+94", "�9�7�9�6"))
countries.push(CountryModel("SDN", "Sudan", "+249", "�9�4�9�9"))
countries.push(CountryModel("SUR", "Suriname", "+597", "�9�4�9�3"))
countries.push(CountryModel("SWZ", "Swaziland", "+268", "�9�4�9�1"))
countries.push(CountryModel("SWE", "Sweden", "+46", "�9�4�9�0"))
countries.push(CountryModel("SJM", "Svalbard and Jan Mayen", "+47", "�9�4�9�5"))
countries.push(CountryModel("CHE", "Switzerland", "+41", "�9�8�9�3"))
countries.push(CountryModel("SYR", "Syrian Arab Republic", "+963", "�9�4�9�0"))
countries.push(CountryModel("TWN", "Taiwan", "+886", "�9�5�9�8"))
countries.push(CountryModel("TJK", "Tajikistan", "+992", "�9�5�9�5"))
countries.push(CountryModel("TZA", "Tanzania", "+255", "�9�5�9�1"))
countries.push(CountryModel("THA", "Thailand", "+66", "�9�5�9�3"))
countries.push(CountryModel("TLS", "Timor-Leste", "+670", "�9�5�9�7"))
countries.push(CountryModel("TGO", "Togo", "+228", "�9�5�9�2"))
countries.push(CountryModel("TKL", "Tokelau", "+690", "�9�5�9�6"))
countries.push(CountryModel("TON", "Tonga", "+676", "�9�5�9�0"))
countries.push(CountryModel("TTO", "Trinidad and Tobago", "+1868", "�9�5�9�5"))
countries.push(CountryModel("TUN", "Tunisia", "+216", "�9�5�9�9"))
countries.push(CountryModel("TUR", "Turkey", "+90", "�9�5�9�3"))
countries.push(CountryModel("TMN", "Turkmenistan", "+993", "�9�5�9�8"))
countries.push(CountryModel("TCA", "Turks and Caicos Islands", "+1649", "�9�5�9�8"))
countries.push(CountryModel("TUV", "Tuvalu", "+688", "�9�5�9�7"))
countries.push(CountryModel("UGA", "Uganda", "+256", "�9�6�9�2"))
countries.push(CountryModel("UKR", "Ukraine", "+380", "�9�6�9�6"))
countries.push(CountryModel("ARE", "United Arab Emirates", "+971", "�9�6�9�0"))
countries.push(CountryModel("USA", "United States of America", "+1", "�9�6�9�4"))
countries.push(CountryModel("URY", "Uruguay", "+598", "�9�6�9�0"))
countries.push(CountryModel("VIR", "Virgin Islands (U.S.)", "+1340", "�9�7�9�4"))
countries.push(CountryModel("UZB", "Uzbekistan", "+998", "�9�6�9�1"))
countries.push(CountryModel("VUT", "Vanuatu", "+678", "�9�7�9�6"))
countries.push(CountryModel("VEN", "Venezuela", "+58", "�9�7�9�0"))
countries.push(CountryModel("VNM", "Vietnam", "+84", "�9�7�9�9"))
countries.push(CountryModel("WLF", "Wallis and Futuna", "+681", "�9�8�9�1"))
countries.push(CountryModel("YEM", "Yemen", "+967", "�9�0�9�0"))
countries.push(CountryModel("ZMB", "Zambia", "+260", "�9�1�9�8"))
countries.push(CountryModel("ZWE", "Zimbabwe", "+263", "�9�1�9�8"))
countries.push(CountryModel("ALA", "�0�3land Islands", "+358", "�9�6�9�9"))
return countries;
}
const CountryModel = (iso,name,code,flag)=>{
return {iso3:iso,name:name,dial_code:code,flag:flag}
}
const generateRandomNumber = (int)=> {
if(int == undefined)
{
    int = 4;
}
return String(Math.floor((Math.random() * 99999999) + 1000000)).substring(0,int) ;
} 
const DataEncryption = (data)=>{
// first step bin-to-hex of real data
// second step  
return BinToHex(data).then((result)=>{
 return result
})
}
const DataDecryption = (data)=>{
// second step  
// first step bin-to-hex of real data
return HexToBin(data).then((result)=>{
  return result;
})
}
 const BinToHex = (data)=>{
return new Promise((resolve)=>{
resolve("");
})
}
const HexToBin = (data)=>{
return new Promise((resolve)=>{
resolve("");
})
}
function returnComma(str){
    if(str === "") {
      return str;
    }
    if(str === ".") {
      return String(str).replace('.','');
    }
    if(String(str) === "00"){
      return "0";
    }
    str = String(str).replace(/[^0-9.]/g,'');
    var getDot = String(str).split(".");
    var firstPart = getDot[0];
    if(firstPart.length >= 4) {
       firstPart = firstPart.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  }
    if(getDot.length >= 2){
      return firstPart+"."+getDot[1];
    }
    return firstPart;
  }
function ValidateBOD(str){
    const d = Moment(str);
    return d.isValid();
  }
  function MaskNumber(str){
    let firstPart = String(str).substring(0,3);
    let lastPart = String(str).substring(String(str).length-3,String(str).length);
    let middlePart = String(str).substring(String(firstPart).length,String(lastPart).length+4).split("").map((a,i)=>{
      return "X";
    }).join("");
    return firstPart+middlePart+lastPart;
  }
  module.exports = {
    CountryList,
    MaskNumber,
    ValidateBOD,
    returnComma,
    HexToBin,
    BinToHex,
    DataDecryption,
    DataEncryption,
    generateRandomNumber
  }