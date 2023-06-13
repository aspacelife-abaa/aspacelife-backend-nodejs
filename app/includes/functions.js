const {
  ConnectionConfig,
  createConnection
} = require('mysql');
const Moment = require('moment');
const EmailValidator = require('email-validator');
const Md5 = require('md5');
const {
  AFRICATALKING_BASEURL,
  jwtSecret,
  DatabaseName,
  DatabaseHost,
  DatabasePassword,
  DatabaseUser,
  DatabasePort,
  SMSBaseUrl,
  SMSApiKey,
  NINNumberSize,
  PhoneNumberSize,
  SMSFolder,
  TxnPINSize,
  SenderID,
  DefaultSMS,
  VerifiedPINSize,
  TokenValidity,
  PaystackPublickey,
  PaystackSecretKey,
  AppName,
  AFRICATALKING_USERNAME,
  AFRICATALKING_APIKEY,
  AFRICATALKING_USERNAME_SANDBX,
  AFRICATALKING_APIKEY_SANDBX,
  PaymentRefundableAmount,
  CustomerServiceEmail,
  CustomerServicePhoneNumber,
  DefaultEmail,
  DefaultEmailpassword,
  MailServerHost,
  MailServerPort,
  DocumentUploadLimit,
  NairaSymbol,
  FlutterWaveTestSecret,
  FlutterWaveTestPublic,
  AIRTIMENG_APIKey,
  AIRTIMENG_APIToken,
  ReloadlySecret,
  ReloadlyClientID,
  BillPaymentProvider,
  SMS_TimeOut
} = require('./config');
const {
  BinToHex,
  CountryList,
  CountryModel,
  DataDecryption,
  DataEncryption,
  HexToBin,
  generateRandomNumber,
  returnComma,
  ValidateBOD,
  MaskNumber
} = require('./utils');
const {
  EnCrypPassword,
  AntiHacking
} = require('./security');
const {
  SendSMS
} = require('./sms/index');
const {
  SendEmail
} = require('./email/index');
const {
  NinVerification
} = require('./NinVerification');
const {
  VerifyBankAccount
} = require('./AccountVerification');
const {
  ListOfBanks
} = require('./AccountVerification/listofbanks');
const {
  VerifyTransaction
} = require('./AccountVerification/VerifyTransaction');
const {
  WithdrawToBank
} = require('./AccountVerification/withdraw_to_bank');
const {
  VerifyCAC
} = require('./cac');
const {
  unlink,
  rename
} = require('fs');
const {
  BuyData
} = require('./data-puchase');
const {
  GetElectricityList
} = require('./electricity/providers');
const {
  GetDataPlans
} = require('./data-puchase/plans');
const {
  GetAirtimeServices
} = require('./airtime');
const {
  ValidateServiceNumber
} = require('./numberValidation');
const {
  AirtimePurchase
} = require('./airtime/buy_airtime');
const {
  GetAIRTIMENGDataPlans
} = require('./data-puchase/airtime_plans');
const {
  GetElectricityListReloadly
} = require('./electricity/providers_reloadly');
const {
  ReloadlyAccessToken
} = require('./reloadly/access_token');
const {
  GetBillersReloadly
} = require('./electricity/providers_reloadly');
const {
  BuyElectricityReloadly
} = require('./electricity/purchase_electricty_reloadly');
const {
  USSDEventCallback
} = require('./ussd/callback');
// user login function
const os = require("os");
const {
  PaystackURL
} = require('./paystack');
const {
  PaystackTransactionConfirmation
} = require('./paystack/confirm_payment');
const {
  PaystackChargeCard
} = require('./paystack/charge_card');
const {
  PaystackSubmitBirthday
} = require('./paystack/submit_birthday');
const {
  PaystackSubmitOTP
} = require('./paystack/submit_otp');
const {
  PaystackSubmitPIN
} = require('./paystack/submit_pin');
const {
  VTPASSVerifyMeterNumber
} = require('./electricity/vtpass_verify_meter');
const { sha512 } = require('js-sha512');
const { SendPush } = require('./firebase/push');
const { NINImageVerification } = require('./NINPrembly');

const UserLogin = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const Logindata = data.data;
      CheckEmptyInput(Logindata, ["Password", "PhoneNumber","fcmtoken"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
          // encrypt password
          const Password = EnCrypPassword(Logindata.Password);
          QueryDB(`select * from users where PhoneNumber='${Logindata.PhoneNumber}' and Password='${Password}' limit 1`).then((result) => {
            if (result.status && result.data.length !== 0) {
              let user = result.data[0];
              delete user.Password;
              delete user.fingerPrintData;
              delete user.TransactionPin;
              user.ussd_code = "*345*10#";
              user.AccessToken = sha512(Moment().toISOString() + Logindata.PhoneNumber);
              user.PaystackPublicKey = PaystackPublickey;
              result.data = user;
              result.message = "Login successful.";
              result.data.privacyUrl = process.env.privacyUrl;
              result.data.termsUrl = process.env.termsUrl;
              result.data.CloudinaryUpload_preset = process.env.CloudinaryUpload_preset; 
              result.data.CloudinaryFolder = process.env.CloudinaryFolder; 
              result.data.CloudinaryCloud_name = process.env.CloudinaryCloud_name; 
              result.data.enableLoginPIN =  String(result.data.enableLoginPIN) == "1";
                // update AccessToken
              QueryDB(`update users set AccessToken='${user.AccessToken}',PushToken='${Logindata.fcmtoken}' where PhoneNumber='${user.PhoneNumber}' limit 1 `)
              // send email
              SendEmail(`${AppName} LOG IN CONFIRMATION`, ``, user);
              createFolder(`public/fld-${user.PhoneNumber}/images`);
              createFolder(`public/fld-${user.PhoneNumber}/documents`);
            } else {
              result.message = "Oops! Invalid login credentails.";
            }
            if (result.status && result.data.account_type == "merchant") {
              const qr = `select * from merchant_profile where PhoneNumber='${result.data.PhoneNumber}' limit 1`;
              QueryDB(qr).then((res) => {
                if (res.status) {
                  const merchantData = res.data[0];
                  result.data = Object.assign(result.data, {
                    cac_number: merchantData.cac_number,
                    company_name: merchantData.company_name,
                    company_address: merchantData.company_address,
                    registration_date: merchantData.registration_date,
                    merchantId: merchantData.merchantId
                  })
                }
                resolve(result);
              })
            } else {
              resolve(result);
            }
          })
        }
      })
    })
  });
}
// registration function
const Registration = (userInfo) => {
  return new Promise((resolve) => {
    AntiHacking(userInfo).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const userData = data.data;
      let checkList = ["FirstName", "LastName", "PhoneNumber", "Password", "EmailAddress", "Nin", "dob", "TransactionPin", "account_type"];
      if (userData["MiddleName"] !== undefined) {
        checkList.push("MiddleName")
      }
      if (userData["code"] !== undefined) {
        checkList.push("code")
      }
      const list = ["cac_number", "company_name", "company_address", "registration_date"];
      if (userData.account_type == "merchant") {
        checkList = checkList.concat(list).filter((a, i) => !["Nin", "dob"].includes(a));
        delete userData.Nin;
        delete userData.dob;
      }

      CheckEmptyInput(userData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }

        // check email existence, check NIN existence, check mobile number existence
        QueryDB(`select * from users where PhoneNumber='${userData.PhoneNumber}' or EmailAddress='${userData.EmailAddress}' or Nin='${userData.Nin}' limit 1`).then((response) => {
          if (response.status) {
            let user = response.data[0];
            user.ussd_code = "*384*80535#";
            resolve({
              status: false,
              data: {},
              message: `Oops! ${user.EmailAddress == userData.EmailAddress?'Email address':user.PhoneNumber == userData.PhoneNumber?"phone number":user.Nin == userData.Nin?"NIN":""} already in use.`
            })
            return;
          }
          let upassword = "";
          let merchantId = "";
          if (userData.Password) {
            upassword = userData.Password;
            userData.Password = EnCrypPassword(userData.Password);
          }

          if (userData.account_type == "merchant") {
            merchantId = String(generateRandomNumber(6));
            const qy = `insert into merchant_profile (cac_number,company_name,company_address,registration_date,merchantId,PhoneNumber) values('${userData.cac_number}','${userData.company_name}','${userData.company_address}','${userData.registration_date}','${merchantId}','${userData.PhoneNumber}')`;

            QueryDB(`select * from merchant_profile where cac_number='${userData.cac_number}' limit 1`).then((a) => {
              if (!a.status) {
                QueryDB(qy);
              }
            })
            userData.FirstName = userData.company_name;
            userData.LastName = "null";
            userData.TransactionPin = EnCrypPassword(String(userData.TransactionPin));
            delete userData.cac_number;
            delete userData.company_name;
            delete userData.company_address;
            delete userData.registration_date;
            checkList = checkList.filter((a) => !list.includes(a))
          }
          QueryDB(GetQueryString(checkList, userData, 'insert', 'users')).then((res) => {
            if (res.status) {
              res.message = "Registration was successful.";
              res.data = {};
              // send email
              SendEmail(`Registration at ${AppName}`, `Hi ${userData.account_type == "merchant"?userData.company_name:userData.FirstName}, <br/>your registration was successful, the following are your login details:<br/><b>Phone number</b>:${userData.PhoneNumber}<br/><b>Password</b>:${upassword}<br/>`, userData);
              // send sms
              SendSMS(GetDefaultPhoneNumber(userData, String(userData.PhoneNumber)), `Hi ${userData.FirstName}, registration at ${AppName} was successfull.`);
            }
            resolve(res);
          })
        })
      })
    })
  });
}
// database query string converter
const GetQueryString = (checkList, params, type, tableName, indentifier) => {
  let query = "";
  if (type == 'insert') {
    query = `insert into ${tableName} (${checkList.join(",")}) values('${checkList.map((a,i)=>{
      return params[`${a}`]
    }).join("','")}')`;
  } else if (type == 'update') {
    let indentifierColumn = "";
    query = `update ${tableName} set ${Object.values(params).map((a,i)=>{
      const columnname = Object.keys(params);
      if(indentifier)
      {
        indentifierColumn = JSON.stringify(indentifier).replace(/{"/g,"").replace(/:"/g,"='").replace(/"}/g,"'").replace(/"/g,"");
      } 
      return `
    $ {
      columnname[i]
    } = '${a}'
    `
    }).join(",")} where ${indentifierColumn} limit 1`;

  } else if (type == 'select') {
    let indentifierColumn = "";
    query = `select * from ${tableName} where ${Object.values(params).map((a,i)=>{
      const columnname = Object.keys(params);
      if(indentifier)
      {
        indentifierColumn = JSON.stringify(indentifier).replace(/{"/g,"").replace(/:"/g,"='").replace(/"}/g,"'").replace(/"/g,"");
      } 
      return `
    $ {
      columnname[i]
    } = '${a}'
    `
    }).join(" and ")} `;
  }
  return query;
}
// use this method to get user details 
const GetUserDetails = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      let params = result.data;
      let checkList = ["PhoneNumber"];
      if (data.EmailAddress) {
        checkList.push("EmailAddress");
      }
      if (data.Nin) {
        checkList.push("Nin");
      }
if(params.token && params.token == "x")
{
  if (params.token) {
    delete params.token;
  }
  if (response.status) {
    CheckEmptyInput(params, checkList).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: (errorMessage),
          data: null
        });
      } else {
        let queryString = `select * from users where PhoneNumber='${params.PhoneNumber}' `;
        if (params.EmailAddress) {
          queryString += `or EmailAddress='${params.EmailAddress}'`;
        }
        if (params.Nin) {
          queryString += ` or Nin='${params.Nin}' `;
        }
        queryString += " limit 1";
        QueryDB(queryString).then((res) => {
          if (!res.status) {
            res.message = `Account does not exist`;
            res.data = {}
            resolve(res)
          } else {
            let user = res.data[0];
            if (user.Password) {
              delete user.Password;
            }

            if (user.TransactionPin) {
              delete user.TransactionPin;
            }
            if (user.AccessToken) {
              delete user.AccessToken;
            }
            if (user.Nin) {
              delete user.Nin;
            }
            if (user.verificationToken) {
              delete user.verificationToken;
            }
            res.message = "Account found.";
            res.data = user;
            res.data.secondary_number = user.PhoneNumber_Secondary;
            res.data.settings = {
              email_notification: user.email_notification,
              sms_notification: user.sms_notification
            }
            delete res.data.email_notification;
            delete res.data.sms_notification;
            delete res.data.PhoneNumber_Secondary;
            delete res.data.default_PhoneNumber;
            resolve(res)
          }
        })
      }
    })
  } else {
    resolve(response)
  }
}else{
  CheckAccess(String(result.data.token)).then((response) => {
        if (params.token) {
          delete params.token;
        }
        if (response.status) {
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: (errorMessage),
                data: null
              });
            } else {
              let queryString = `select * from users where PhoneNumber='${params.PhoneNumber}' `;
              if (params.EmailAddress) {
                queryString += `or EmailAddress='${params.EmailAddress}'`;
              }
              if (params.Nin) {
                queryString += ` or Nin='${params.Nin}' `;
              }
              queryString += " limit 1";
              QueryDB(queryString).then((res) => {
                if (!res.status) {
                  res.message = `Account does not exist`;
                  res.data = {}
                  resolve(res)
                } else {

                  let user = res.data[0];
                  if (user.Password) {
                    delete user.Password;
                  }

                  if (user.TransactionPin) {
                    delete user.TransactionPin;
                  }
                  if (user.AccessToken) {
                    delete user.AccessToken;
                  }
                  if (user.Nin) {
                    delete user.Nin;
                  }
                  if (user.verificationToken) {
                    delete user.verificationToken;
                  }
                  res.message = "Account found.";
                  res.data = user;
                  res.data.secondary_number = user.PhoneNumber_Secondary;
                  res.data.settings = {
                    email_notification: user.email_notification,
                    sms_notification: user.sms_notification
                  }
                  delete res.data.email_notification;
                  delete res.data.sms_notification;
                  delete res.data.PhoneNumber_Secondary;
                  delete res.data.default_PhoneNumber;
                  resolve(res)
                }
              })
            }
          })
        } else {
          resolve(response)
        }
  })
}
})
  })
}
// inputs validation method
const CheckEmptyInput = (data, list) => {
  return new Promise((resolve) => {
    var params = Object.keys(data);
    var keyExist = list.filter((a, i) => !params.includes(a));
    var unwantedKeys = params.filter((a, i) => !list.includes(a));
    if (keyExist.length == 0) {
      if (data["EmailAddress"] && !EmailValidator.validate(data["EmailAddress"])) {
        resolve(`Oops! a valid email address is required.`);
      } else if (data["PhoneNumber"] && data["PhoneNumber"].length < parseInt(String(PhoneNumberSize))) {
        resolve(`Oops! a valid phone number is required`);
      } else if (data["Nin"] && data["Nin"].length != parseInt(String(NINNumberSize))) {
        resolve(`Oops! a valid NIN is required`);
      } else if (unwantedKeys.length == 0) {
        resolve(false);
      } else if (data["TransactionPin"] && String(data["TransactionPin"]).length !== parseInt(String(TxnPINSize))) {
        resolve(`Oops! TransactionPIN must be 6 digits`);
      } else if (data["dob"] && !ValidateBOD(data["dob"])) {
        resolve(`Oops! a valid date of birth is required`);
      } else {
        resolve(`Oops! ${unwantedKeys[0]} not required`);
      }
    } else {
      resolve(`Oops! ${keyExist[0]} is required`);
    }
  })
}
// this method returns dashboard data
const Dashboard = (token) => {
  return new Promise((resolve) => {
    CheckAccess(token).then((response) => {
      if (response.status) {
        if (response.data[0]) {
          response.data = response.data[0];
        }
        GetWalletBalance(response.data.PhoneNumber).then((res) => {
          if (res.status) {
            response.data.wallet = res.data;
            delete response.data.wallet.created_at;
            delete response.data.wallet.phone_number;
          }
          GetMerchantDetails({
            token: token
          }).then((mch) => {
            if (mch.status && response.data.account_type == "merchant") {
              response.data = {
                ...response.data,
                ...mch.data
              }
            }
            resolve(response);
          })
        })
      } else {
        resolve(response);
      }
    })
  })
}
// this method handles wallet funding
const WalletFunding = (data) => {
  return new Promise((resolve) => {
    let params = data;
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(data.data.token).then((response) => {
        if (response.status) {
          let checkList = ["amount", "channel", "reference", "transaction_status"];
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              const user = response.data;
              QueryDB(`select * from transactions where transaction_ref='${params.reference}' and PhoneNumber='${user.PhoneNumber}' limit 1`).then((chTx) => {
                if (chTx.status) {
                  resolve({
                    status: false,
                    message: "Duplicate transaction.",
                    data: params.reference
                  })
                  return;
                }
                VerifyTransaction(params.reference).then((txn) => {
                  if (!txn.status) {
                    resolve(txn);
                  } else {
                    UpdateWalletBalance(user, data.data.amount, "credit", data.data.reference).then((res) => {
                      if (res.status) {
                        const sms = `Credit Amt:${NairaSymbol}${returnComma(data.data.amount)} Acc:${MaskNumber(String(String(user.PhoneNumber)))} Desc: wallet funding via Paystack Time:${Moment().format("DD/MM/YYYY hh:mm A")} Total Bal:${NairaSymbol}${returnComma(res.data.balance)}`;
                        console.log(sms);
                        SendSMS(GetDefaultPhoneNumber(user, String(user.PhoneNumber)), sms);
                        // SendEmail
                        SendEmail(`${AppName} Credit alert`, sms, user);
                        SaveTransactionHistory({
                          amount: data.data.amount,
                          beneficiary_account: String(user.PhoneNumber),
                          beneficiary_bank_name: "Paystack",
                          customer_name: user.FirstName + " " + user.LastName,
                          memo: "Wallet funding (self)",
                          PhoneNumber: String(user.PhoneNumber),
                          token: "",
                          transaction_ref: params.reference,
                          transaction_type: "credit",
                          status: String(txn.status)
                        })
                      }
                      resolve(res)
                    })
                  }
                })
              })
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
// this method handles funds transfer from wallet to wallet
const Transfer = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: result.data
        });
        return;
      }
      let checkList = ["amount", "memo", "transactionPIN", "token", "beneficiary"];
      let params = data;
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: errorMessage,
            data: null
          });
        } else {
          CheckAccess(result.data.token, result.data.transactionPIN).then((sender) => {
            if (sender.status) {
              let senderData = sender.data;
              if (params.beneficiary != undefined && params.beneficiary == senderData.PhoneNumber) {
                resolve({
                  status: false,
                  message: `Oops! you cannot transfer money to your own wallet`,
                  data: null
                });
                return;
              }
              NonAuthGetUserDetails({
                PhoneNumber: params.beneficiary
              }).then((beneficiaryResponse) => {
                if (beneficiaryResponse.status) {
                  let beneficiaryData = beneficiaryResponse.data;
                  if (String(beneficiaryData.account_type) === "merchant") {
                    resolve({
                      status: false,
                      message: `Oops! we suggest you use the merchantId instead.`,
                      data: null
                    });
                  } else {
                    GetWalletBalance(String(senderData.PhoneNumber)).then((senderWalletResponse) => {
                      if (senderWalletResponse.status) {
                        let senderWalletData = senderWalletResponse.data;
                        let WalletData = senderWalletData;
                        // transfer to wallet
                        delete WalletData.wallet_id;
                        delete WalletData.phone_number;
                        delete WalletData.created_at;

                        if (parseFloat(params.amount) > parseFloat(WalletData.balance)) {
                          resolve({
                            status: false,
                            message: `Your wallet balance is too low for this transaction`,
                            data: data
                          });
                          return;
                        }
                        SendMoney({
                          sender: senderData,
                          reciever: beneficiaryData,
                          amount: params.amount
                        }).then((paymentResponse) => {
                          resolve(paymentResponse)
                        });
                      } else {
                        resolve(senderWalletResponse);
                      }
                    })
                  }
                } else {
                  resolve(beneficiaryResponse);
                }
              })
            } else {
              resolve(sender);
            }
          })
        }
      })
    })
  })
}
const TransferToMerchant = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: result.data
        });
        return;
      }
      let checkList = ["amount", "memo", "transactionPIN", "token", "merchantId"];
      let params = data;
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: errorMessage,
            data: null
          });
        } else {
          CheckAccess(result.data.token, result.data.transactionPIN).then((sender) => {
            if (sender.status) {
              let senderData = sender.data;
              GetMerchantDetails({
                merchantId: String(params.merchantId),
                token: result.data.token
              }).then((merchantResponse) => {

                if (merchantResponse.status) {
                  const merchantData = merchantResponse.data;
                  if (senderData.PhoneNumber === merchantData.PhoneNumber) {
                    resolve({
                      status: false,
                      message: `Oops! you cannot transfer money to your own wallet`,
                      data: null
                    });
                    return;
                  }
                  GetWalletBalance(String(senderData.PhoneNumber)).then((senderWalletResponse) => {
                    if (senderWalletResponse.status) {
                      let senderWalletData = senderWalletResponse.data;
                      let WalletData = senderWalletData;
                      // transfer to wallet
                      delete WalletData.wallet_id;
                      delete WalletData.phone_number;
                      delete WalletData.created_at;
                      if (parseFloat(params.amount) > parseFloat(senderWalletData.balance)) {
                        resolve({
                          status: false,
                          message: `Insufficient balance (NGN${senderWalletData.balance})`,
                          data: data
                        });
                        return;
                      }
                      SendMoney({
                        sender: senderData,
                        reciever: merchantData,
                        amount: params.amount
                      }).then((paymentResponse) => {
                        resolve(paymentResponse)
                      });
                    } else {
                      resolve(senderWalletResponse);
                    }
                  })
                } else {
                  resolve(merchantResponse);
                }
              })
            } else {
              resolve(sender);
            }
          })
        }
      })
    })
  })
}
const SendMoney = (data) => {
  const referenceNumber = EnCrypPassword(Moment().format("DDMMYYYYhhmmss"));
  return new Promise((resolve) => {
    // check is transaction exist
    QueryDB(`select *  from transactions where transaction_ref='${referenceNumber}' limit 1 `).then((res)=>{
      if(res.status)
      {
        resolve({
          status:false,
          message:"Oops! duplicate transaction.",
          data:{}
        })
        return;
      }
    UpdateWalletBalance(data.sender, String(data.amount), "debit", referenceNumber).then((res) => {
      if (res.status) {
        // send email ans sms
        const sms = `${AppName} Debit\nAmt:${NairaSymbol}${returnComma(String(data.amount))}\nAcc:${MaskNumber(String(data.sender.PhoneNumber))}\nDesc: wallet-to-wallet transfer to ${data.reciever.FirstName} ${data.reciever.LastName}\nTime:${Moment().format("DD/MM/YYYY hh:mm A")}\nTotal Bal:${NairaSymbol}${returnComma(res.data.balance)}`;
        SendSMS(GetDefaultPhoneNumber(data.sender, String(data.sender.PhoneNumber_Secondary)), sms);
        SendEmail(`Debit transaction`, `${AppName} Debit<br/>
     Amt:${NairaSymbol}${returnComma(String(data.amount))}<br/>
     Acc:${MaskNumber(String(data.sender.PhoneNumber))}
     Desc:wallet-to-wallet transfer to ${data.reciever.FirstName} ${data.reciever.LastName}<br/>
     Time:${Moment().format("DD/MM/YYYY hh:mm A")}<br/>
     Total Bal:${NairaSymbol}${returnComma(res.data.balance)}`, data.sender);
        SaveTransactionHistory({
          amount: String(data.amount),
          beneficiary_account: String(data.reciever.PhoneNumber),
          customer_name: data.sender.FirstName + " " + data.sender.LastName,
          beneficiary_bank_name: `${AppName} wallet`,
          PhoneNumber: String(data.sender.PhoneNumber),
          memo: `wallet-to-wallet transfer to ${data.reciever.FirstName} ${data.reciever.LastName}`,
          token: "",
          transaction_ref: referenceNumber,
          transaction_type: "debit",
          status: "success"
        })
      UpdateWalletBalance(data.reciever, String(data.amount), "credit", referenceNumber).then((recieverWalletResponse) => {
        if (recieverWalletResponse.status) {
          const rsms = `Credit\nAmt:${NairaSymbol}${returnComma(String(data.amount))}\nAcc:${MaskNumber(String(data.reciever.PhoneNumber))}\nDesc: wallet-to-wallet from ${data.sender.FirstName} ${data.sender.LastName}(${data.sender.PhoneNumber})\nTime:${Moment().format("DD/MM/YYYY hh:mm A")}\nTotal Bal:${NairaSymbol}${returnComma(recieverWalletResponse.data.balance)}`;
          console.log(rsms);
          SendSMS(GetDefaultPhoneNumber(data.reciever, String(data.reciever.PhoneNumber_Secondary)), rsms);
          SendEmail("Credit transaction", `Credit<br/>
        Amt:${NairaSymbol}${returnComma(String(data.amount))}<br/>
        Acc:${MaskNumber(String(data.reciever.PhoneNumber))}
        Desc:wallet-to-wallet from ${data.sender.FirstName} ${data.sender.LastName}<br/>
        Time:${Moment().format("DD/MM/YYYY hh:mm A")}<br/>
        Total Bal:${NairaSymbol}${returnComma(recieverWalletResponse.data.balance)}`, data.reciever);
          SaveTransactionHistory({
            amount: String(data.amount),
            beneficiary_account: String(data.reciever.PhoneNumber),
            customer_name: data.reciever.FirstName + " " + data.reciever.LastName,
            beneficiary_bank_name: `${AppName} wallet`,
            PhoneNumber: String(data.reciever.PhoneNumber),
            memo: `wallet-to-wallet from ${data.sender.FirstName} ${data.sender.LastName}`,
            token: "",
            transaction_ref: referenceNumber,
            transaction_type: "credit",
            status: "success"
          })
          resolve({
            status:true,
            message:"Transaction was successful",
            data:{}
          })
        }else{
          resolve({
            status:false,
            message:"Oops! Transaction was not successful",
            data:{}
          })
        }
      })
    }else{
      resolve(res)
    }
    })
    })
  })
}
// this method returns wallet balance
const GetWalletBalance = (PhoneNumber) => {
  return new Promise((resolve) => {
    if (PhoneNumber == "" || PhoneNumber == undefined) {
      resolve({
        status: false,
        message: "Oops! Phone number is required.",
        data: {
          balance: 0
        }
      })
    } else {
      QueryDB(`select * from wallets where phone_number='${PhoneNumber}' limit 1`).then((res) => {
        if (res.status) {
          if (Array.isArray(res.data)) {
            res.data = res.data[0];
          } else {
            res.data = {
              balance: 0
            }
          }
        } else {
          res.data = {
            balance: 0
          }
        }
        resolve(res)
      })
    }
  })
}
// this method handle access control by verifying access token
const CheckAccess = (token, transactionPIN) => {
  return new Promise((resolve) => {
    if (token == undefined || token == "") {
      resolve({
        status: false,
        data: {},
        message: "Oops! access token is required."
      })
    } else {
      QueryDB(`select * from users where AccessToken='${token}' limit 1`).then((res) => {
        if (!res.status) {
          res.message = "Oops! Access denied.";
          res.status = false;
          res.data = {}
          resolve(res);
          return
        }
        res.data = res.data[0];
        const user = res.data;
        if (transactionPIN != undefined && EnCrypPassword(String(transactionPIN)) !== String(user.TransactionPin)) {
          res.message = "Oops! Invalid transaction PIN.";
          res.status = false;
          res.data = {}
          resolve(res);
        } else {
          resolve(res);
        }
      })
    }
  })
}
const CheckPassword = (Password, phoneNumber) => {
  return new Promise((resolve) => {
    if (Password == undefined || Password == "") {
      resolve({
        status: false,
        data: {},
        message: "Oops! Password is required."
      })
    } else {
      QueryDB(`select * from users where PhoneNumber='${phoneNumber}' and Password='${EnCrypPassword(Password)}' limit 1`).then((res) => {
        if (!res.status) {
          res.message = "Oops! Invalid password.";
        } else {
          const user = res.data[0];
          res.data = user;
        }
        resolve(res);
      })
    }
  })
}
// this method handles all queries to the database
const QueryDB = (q) => {
  return new Promise((resolve, reject) => {
    let dbSettings = {
      host: DatabaseHost,
      user: DatabaseUser,
      password: DatabasePassword,
      database: DatabaseName
    }
    if (String(os.homedir().toString()).includes("/Users/")) {
      dbSettings = Object.assign(dbSettings, {
        port: DatabasePort,
        password: "root",
        user: "root",
        database: process.env.DB_database_Local
      });
    }
    console.log(q)
    console.log("dbSettings|", dbSettings)

    const connection = createConnection(dbSettings);
    connection.connect();
    connection.query(q, function (error, results, fields) {
      connection.end();
      if (error) {
        resolve({
          status: false,
          data: {},
          message: error.message
        });
      } else {
        const queryString = String(q).toLowerCase();
        let responseStatus = true;
        let responseData = [];
        let message = "data fetched.";
        if (queryString.includes("select")) {
          responseData = results;
          console.log(responseData)
          if (responseData.length == 0) {
            responseStatus = false;
          }
        }
        try {
          if (results.length == 0) {
            responseStatus = false;
            responseData = [];
          }
        } catch (error) {
          responseStatus = false;
          responseData = [];
        }
        resolve({
          status: responseStatus,
          data: responseData,
          message: message
        });
      }
    });
  })
}
// this method handles insert and update of users wallet balance
const UpdateWalletBalance = (receiver, amount, updateType, refNo) => {
  return new Promise((resolve) => {
    // update sender's balane and history
    NonAuthGetUserDetails({
      PhoneNumber: String(receiver.PhoneNumber)
    }).then((u) => {
   
      if (u.status) {
        GetWalletBalance(String(receiver.PhoneNumber)).then((res) => {
          if (!res.status) {
            QueryDB(GetQueryString(["balance", "phone_number"], {
              balance: amount,
              phone_number: receiver.PhoneNumber
            }, 'insert', 'wallets', {
              phone_number: receiver.PhoneNumber
            })).then((res) => {
              res.message = "Wallet not funded.";
              resolve(res);
            });
          } else {
            const WalletData = res.data;
            const balance = updateType == 'credit' ? String(parseFloat(WalletData.balance) + parseFloat(amount)) : String(parseFloat(WalletData.balance) - parseFloat(amount));
            QueryDB(`UPDATE wallets SET balance='${balance}' WHERE phone_number='${receiver.PhoneNumber}'`).then((res) => {
              if (res.status) {
                res.data = {
                  balance
                }
                res.message = updateType == 'credit' ? "Wallet successfully funded." : "Wallet successfully debited.";
              } else {
                res.message = "Wallet not funded.";
              }
              resolve(res);
            });
          }
        })
      } else {
        resolve(u)
      }
    })
  })
}
const SaveTransactionHistory = (data) => {
  return new Promise((resolve) => {
    const checkList = ["amount", "memo", "PhoneNumber", "transaction_ref", "transaction_type", "beneficiary_account", "customer_name", "beneficiary_bank_name"];
    let x = {
      amount: data.amount,
      memo: data.memo,
      PhoneNumber: data.PhoneNumber,
      transaction_ref: data.transaction_ref,
      transaction_type: data.transaction_type,
      beneficiary_account: data.beneficiary_account,
      customer_name: data.customer_name,
      beneficiary_bank_name: data.beneficiary_bank_name
    }
    if (data.split_payment_ref != undefined) {
      checkList.push("split_payment_ref");
      x.split_payment_ref = data.split_payment_ref;
    }
    CheckEmptyInput(x, checkList).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          data: {},
          message: errorMessage.toString()
        })
        return;
      }
      let qry = {
        ...data
      }
      qry.transaction_status = data.status;
      delete qry.status;
      checkList.push("transaction_status");
      QueryDB(GetQueryString(checkList, qry, 'insert', 'transactions')).then((res) => {
        resolve(res);
      });
    })
  })
}
const GetTransactionHistory = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: result.data
        });
        return;
      }
      let checkList = ["token"];
      let params = data;
      let limit = "0,50";
      if (params.PhoneNumber != undefined) {
        checkList.push("PhoneNumber");
      }
      if(params.limit)
      {
        checkList.push("limit");
        limit = params.limit;
      }
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: null
          });
        } else {
          CheckAccess(result.data.token).then((sender) => {
            if (sender.status) {
              let currentuser = sender.data;
              let query = `select * from transactions where PhoneNumber='${currentuser.PhoneNumber}' order by transaction_id desc limit ${limit}  `;;
              if (params.PhoneNumber != undefined) {
                query = `select * from transactions where PhoneNumber='${params.PhoneNumber}' order by transaction_id desc limit ${limit}  `;
              }
              QueryDB(query).then((res) => {
                resolve(res);
              });
            } else {
              resolve(sender)
            }
          })
        }
      })
    })
  })
}

const GetDataHistory = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: result.data
        });
        return;
      }
      let checkList = ["token"];
      let params = data;
      if (params.PhoneNumber != undefined) {
        checkList.push("PhoneNumber");
      }
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: null
          });
        } else {
          CheckAccess(result.data.token).then((sender) => {
            if (sender.status) {
              let currentuser = sender.data;
              let limit = "0,50";
              let query = `select * from data_purchase where PhoneNumber='${currentuser.PhoneNumber}' order by dId desc limit ${limit}`;;
              if (data.limit) {
                limit = data.limit;
              }
              if (params.PhoneNumber != undefined) {
                // query = `select * from data_purchase where PhoneNumber='${params.PhoneNumber}' order by dId desc limit ${limit} `;
              }
              QueryDB(query).then((res) => {
                res.data = res.data.map((a, i) => {
                  return {
                    id: a.dId,
                    recepient: a.PhoneNumber,
                    status: a.dStatus,
                    dataPlanId: a.DataPlanId,
                    referenceNo: a.dReferenceNo,
                    date: Moment(a.dDate).format("Do,MMM,YYYY"),
                    provider: a.nameServiceProvider,
                    amount: a.amount
                  }
                })
                resolve(res);
              });
            } else {
              resolve(sender)
            }
          })
        }
      })
    })
  })
}

const SendToken = (data) => {
  let params = data;
  return new Promise((resolve) => {
    CheckEmptyInput({
      PhoneNumber: data.PhoneNumber
    }, ["PhoneNumber"]).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: String(errorMessage),
          data: null
        });
        return;
      }
      // if(data.notLoggedIn)
      // {
      delete params.token;
      const pin = generateRandomNumber(parseInt(String(VerifiedPINSize)));
      QueryDB(`select * from tokens where PhoneNumber='${params.PhoneNumber}' limit 1`).then((res) => {
        QueryDB(!res.status ? `insert into tokens (verificationToken,PhoneNumber) values ('${pin}','${params.PhoneNumber}')` : `update tokens set verificationToken='${pin}' where PhoneNumber='${params.PhoneNumber}' `).then((rse) => {
          if (rse.status) {
            SendSMS(params.PhoneNumber, `${params.hash?"<#>":""}Your ${pin.length}-digit TOKEN:${pin} from ${AppName}, it is only valid for ${TokenValidity}mins ${params.hash?"/"+params.hash:""}`);
            // CronJob({});
          }
          rse.message = rse.status ? `Your ${pin.length}-digit PIN from ${AppName} has been sent to your mobile number, it is only valid for ${TokenValidity}mins` : "";
          rse.data = {}
          resolve(rse);
        })
      })
    })
  })
}
const TokenVerification = (data) => {
  let params = data;
  return new Promise((resolve) => {
    CheckEmptyInput({
      PhoneNumber: data.PhoneNumber,
      verificationToken: data.verificationToken,
    }, ["PhoneNumber", "verificationToken"]).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: String(errorMessage),
          data: null
        });
      } else {
        delete params.token;
        delete params.notLoggedIn;
        const qrString = `select * from tokens where verificationToken='${params.verificationToken}' and PhoneNumber='${params.PhoneNumber}' limit 1`;
        QueryDB(qrString).then((rse) => {
          if (rse.status) {
            SendSMS(params.PhoneNumber, `Your ${String(data.verificationToken).length}-digit PIN from ${AppName} has been verified.`);
          }
          rse.message = rse.status ? `Your ${String(data.verificationToken).length}-digit PIN from ${AppName} has been verified.` : `Invalid ${String(data.verificationToken).length}-digit Token.`;
          rse.data = {}
          if (rse.status) {
            // update token
            const pin = generateRandomNumber(parseInt(String(VerifiedPINSize) + 3));
            QueryDB(GetQueryString(["verificationToken"], {
              verificationToken: pin
            }, 'update', 'tokens', {
              PhoneNumber: params.PhoneNumber
            }));
          }
          resolve(rse);
        })
      }
    })
  })
}
const CronJob = (data) => {

}
const LinkAccount = (data) => {
  const token = data.token;
  let params = data;
  return new Promise((resolve) => {
    CheckAccess(data.token).then((userData) => {
      if (userData.status) {
        const user = userData.data;
        const checklist = ["account_number", "bank_code", "bank_name", "txRef"];
        delete params.token;
        CheckEmptyInput(params, checklist).then((errorMessage) => {
          if (errorMessage) {
            resolve({
              status: false,
              message: String(errorMessage),
              data: null
            });
          } else {
            QueryDB(GetQueryString(["account_number"], {
              account_number: params.account_number
            }, 'select', 'bank', {
              account_number: params.account_number,
              phone_number: String(user.PhoneNumber)
            })).then((resp) => {
              if (resp.status) {
                resolve({
                  status: false,
                  message: "Account already linked.",
                  data: []
                })
                return;
              }
              QueryDB(`insert into bank (phone_number,account_number,bank_code,bank_name,txRef) values ('${user.PhoneNumber}','${params.account_number}','${params.bank_code}','${params.bank_name}','${params.txRef}')`).then((res) => {
                res.message = res.status ? "Bank details saved" : "Oops! Bank details not saved, try again later."
                if (res.status) {
                  // const pr = {
                  //   amount:String(PaymentRefundableAmount),
                  //   phone_number:params.account_number,
                  //   txRef:params.txRef,
                  //   txStatus:"pending",
                  //   token
                  // }
                  GetWalletBalance(user.PhoneNumber).then((uBalance) => {
                    if (uBalance.status) {
                      const balance = parseFloat(uBalance.data.balance) + parseFloat(PaymentRefundableAmount);
                      QueryDB(`update wallets set balance='${balance}' where phone_number='${user.PhoneNumber}' limit 1`);
                    }
                  });
                  SaveTransactionHistory({
                    amount: String(PaymentRefundableAmount),
                    PhoneNumber: String(user.PhoneNumber),
                    transaction_ref: String(params.txRef),
                    customer_name: user.FirstName + " " + user.LastName,
                    token: "",
                    memo: `Card transaction`,
                    transaction_type: "credit",
                    beneficiary_account: String(user.PhoneNumber),
                    beneficiary_bank_name: "Paystack",
                    status: "success"
                  })
                }
                resolve(res);
              })
            })
          }
        })
      } else {
        resolve(userData);
      }
    })
  })
}
const AccountVerification = (data) => {
  return new Promise((resolve) => {
    const params = data;
    const checkList = ["account_number", "bank_code", "token"];
    CheckEmptyInput(params, checkList).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          data: {},
          message: errorMessage.toString()
        })
        return;
      }
      CheckAccess(params.token).then((res) => {
        if (res.status) {
          VerifyBankAccount(data).then((res) => {
            resolve(res);
          })
        } else {
          resolve(res)
        }
      })
    })
  })
}
const ListBanks = (data) => {
  return new Promise((resolve) => {
    const checkList = ["token"];
    CheckEmptyInput(data, checkList).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          data: {},
          message: errorMessage.toString()
        })
        return;
      }
      ListOfBanks(data).then((res) => {
        resolve(res);
      })
    })
  })
}
const BankAccounts = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckAccess(result.data.token).then((userData) => {
        if (userData.status) {
          const user = userData.data;
          const checklist = ["token"];
          CheckEmptyInput(result.data, checklist).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              const qry = `select * from bank inner join users on bank.phone_number=users.PhoneNumber where bank.phone_number='${user.PhoneNumber}' order by id desc`;
              // console.log(qry);
              QueryDB(qry).then((resp) => {
                resp.message = resp.status ? "Bank(s) fetched." : "bank(s) not found.";
                resp.data = resp.data.map((a, i) => {
                  delete a.Password;
                  delete a.Nin;
                  delete a.TransactionPin;
                  delete a.CreatedAt;
                  delete a.verificationToken;
                  delete a.dob;
                  delete a.PhoneNumber;
                  delete a.EmailAddress;
                  delete a.AccessToken;
                  return a;
                }).filter((a, i) => String(a.is_active) == "1")
                resolve(resp);
              })
            }
          })
        } else {
          resolve(userData);
        }
      })
    })
  })
}
const DeleteBankAccount = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckAccess(result.data.token).then((userData) => {
        if (userData.status) {
          let params = result.data;
          if (params.token) {
            delete params.token;
          }
          let checklist = ["account_number", "Password"];
          CheckEmptyInput(params, checklist).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              const user = userData.data;
              let qry = `select * from users where PhoneNumber='${user.PhoneNumber}' and Password='${EnCrypPassword(params.Password)}' limit 1`;
              QueryDB(qry).then((res) => {
                if (res.status) {
                  qry = `select * from bank where phone_number='${user.PhoneNumber}' and account_number='${params.account_number}' limit 1`;
                  QueryDB(qry).then((resp) => {
                    if (resp.status) {
                      qry = `update bank set is_active='0' where phone_number='${user.PhoneNumber}' and account_number='${params.account_number}' limit 1`;
                      QueryDB(qry).then((dl) => {
                        dl.message = dl.status ? "Bank account deleted." : "bank account not deleted.";
                        resolve(dl);
                      })
                    } else {
                      resp.message = "bank account not found.";
                      resolve(resp);
                    }
                  })
                } else {
                  resolve({
                    status: false,
                    message: "Oop! invalid passowrd.",
                    data: {}
                  });
                }
              })
            }
          })
        } else {
          resolve(userData);
        }
      })
    })
  })
}
const NonAuthGetUserDetails = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      let params = result.data;
      let checkList = ["PhoneNumber"];
      if (data.EmailAddress) {
        checkList.push("EmailAddress");
      }
      if (data.Nin) {
        checkList.push("Nin");
      }
      if (params.token) {
        delete params.token;
      }
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: null
          });
        } else {

          let queryString = `select * from users where PhoneNumber='${params.PhoneNumber}' `;
          if (params.EmailAddress) {
            queryString += `or EmailAddress='${params.EmailAddress}'`;
          }
          if (params.Nin) {
            queryString += ` or Nin='${params.Nin}' `;
          }
          queryString += " limit 1";
          QueryDB(queryString).then((res) => {
            if (!res.status) {
              res.message = `Account does not exist`;
              res.data = {}
            } else {
              let user = res.data[0];
              if (user.Password) {
                delete user.Password;
              }

              if (user.TransactionPin) {
                delete user.TransactionPin;
              }
              if (user.AccessToken) {
                delete user.AccessToken;
              }
              if (user.Nin) {
                // delete user.Nin;
              }
              if (user.verificationToken) {
                delete user.verificationToken;
              }
              res.message = "Account found.";
              res.data = user;
            }
            resolve(res);
          })
        }
      })
    })
  })
}
const SaveFunds = (data) => {
  let params = data;
  return new Promise((resolve) => {
    CheckAccess(data.token).then((userData) => {
      if (userData.status) {
        const user = userData.data;
        const checklist = ["amount", "phone_number", "txRef", "txStatus"];
        delete params.token;
        CheckEmptyInput(params, checklist).then((errorMessage) => {
          if (errorMessage) {
            resolve({
              status: false,
              message: String(errorMessage),
              data: null
            });
          } else {
            QueryDB(`select * from refunds where txRef='${params.txRef}' limit 1 `).then((resp) => {
              if (resp.status) {
                resolve({
                  status: false,
                  message: "Duplcate transaction.",
                  data: []
                })
                return;
              }
              QueryDB(`insert into refunds (amount,phone_number,txRef,txStatus) values ('${params.amount}','${params.phone_number}','${params.txRef}','pending')`).then((res) => {
                res.message = res.status ? "data saved" : "Oops! data not saved, try again later."
                resolve(res);
              })
            })
          }
        })
      } else {
        resolve(userData);
      }
    })
  })
}
const Withdrawal = (data) => {
  return new Promise((resolve) => {
    let params = data;
    AntiHacking(params).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token, result.data.transactionPIN).then((response) => {
        if (response.status) {
          let checkList = ["amount", "bank_id", "transactionPIN"];
          let params = result.data;
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              if (response.status) {
                const user = response.data;
                CheckBankAccount(params.bank_id).then((bnk) => {
                  if (!bnk.status) {
                    resolve(bnk)
                  } else {
                    const bank = bnk.data[0];
                    GetWalletBalance(String(user.PhoneNumber)).then((senderResponse) => {
                      if (senderResponse.status) {
                        // transfer to wallet
                        senderResponse.data = senderResponse.data
                        delete senderResponse.data.wallet_id;
                        delete senderResponse.data.phone_number;
                        delete senderResponse.data.created_at;
                        if (parseFloat(params.amount) > parseFloat(senderResponse.data.balance)) {
                          resolve({
                            status: false,
                            message: `Your wallet balance is too low for this transaction (Balance: ${NairaSymbol}${returnComma(senderResponse.data.balance)})`,
                            data: senderResponse.data
                          });
                          return;
                        }
                        const txfe = Md5(Moment().format("DDMMYYYYhhmmss"));
                        const balance = parseFloat(senderResponse.data.balance) - params.amount;
                        QueryDB(`update wallets set balance='${balance}' where phone_number='${user.PhoneNumber}' limit 1`).then((res) => {
                          if (res.status) {
                            res.data = {
                              balance
                            }
                            res.message = "Withdrawal was successful.";
                          } else {
                            res.message = "Wallet not funded.";
                          }

                          SaveTransactionHistory({
                            amount: String(params.amount),
                            PhoneNumber: String(user.PhoneNumber),
                            transaction_ref: String(txfe),
                            customer_name: user.FirstName + " " + user.LastName,
                            token: result.data.token,
                            memo: `Cash withdrawal to bank`,
                            transaction_type: "withdrawal",
                            beneficiary_account: bank.account_number,
                            beneficiary_bank_name: bank.bank_name,
                            status: "pending"
                          }).then((s) => {
                            // send email ans sms
                            const sms = `${AppName} Debit Amt:${NairaSymbol}${returnComma(params.amount)} Acc:${MaskNumber(String(user.PhoneNumber))} Desc:withdrawal to bank account (${bank.account_number} - ${bank.bank_name}) Time:${Moment().format("DD/MM/YYYY hh:mm A")} Total Bal:${NairaSymbol}${returnComma(String(balance))}`;
                            SendSMS(GetDefaultPhoneNumber(user, String(user.PhoneNumber)), sms);
                            SendEmail(`Debit transaction`, `Debit<br/>
          Amt:${NairaSymbol}${returnComma(params.amount)}<br/>
          Acc:${MaskNumber(String(user.PhoneNumber))}
          Desc:withdrawal to bank account (${bank.account_number} - ${bank.bank_name})<br/>
          Time:${Moment().format("x hh:mm A")}<br/>
          Total Bal:${NairaSymbol}${returnComma(String(balance))}`, user);
                          })

                          WithdrawToBank({
                            amount: params.amount,
                            memo: `Cash withdrawal to bank account (${bank.account_number} - ${bank.bank_name})`,
                            recipient: bank.account_number,
                            ref: String(txfe),
                            bank_code: bank.bank_code,
                            name: user.FirstName + " " + user.LastName
                          }).then((res) => {
                            // if(res.status)
                            // {
                            //   // update transaction status
                            //   QueryDB(`update transactions set transaction_status='${res.data.status}' where PhoneNumber='${user.PhoneNumber}' and 	transaction_ref='${txfe}' limit 1`)
                            // }
                            resolve(res);
                          })
                        })
                      } else {
                        resolve({
                          status: false,
                          message: `Oops! your wallet balance is low please top-up (balance: ${NairaSymbol}0)`,
                          data: {
                            balance: 0
                          }
                        });
                      }
                    })
                  }
                })
              } else {
                resolve(response);
              }
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const CheckBankAccount = (id) => {
  return new Promise((resolve) => {
    QueryDB(`select * from bank where id='${id}' limit 1`).then((rse) => {
      rse.message = rse.status ? "Bank account exist." : "Bank account not exist.";
      resolve(rse)
    })
  })
}
const ActivateBankAccounts = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckAccess(result.data.token).then((userData) => {
        if (userData.status) {
          const user = userData.data;
          const checkList = ["token", "id"];
          CheckEmptyInput(result.data, checklist).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              const qry = `select * from bank where phone_number='${user.PhoneNumber}' and id='${result.data.id}' limit 1`;
              // console.log(qry);
              QueryDB(qry).then((resp) => {
                if (resp.status) {
                  QueryDB(`update bank set is_active='1' where phone_number='${user.PhoneNumber}' and id='${result.data.id}'`).then((resp) => {
                    resp.message = resp.status ? "Bank account now active" : "Oops! something went wrong try again later."
                    resolve(resp);
                  })
                } else {
                  resp.message = "Bank Account deos not exist."
                  resolve(resp);
                }
              })
            }
          })
        } else {
          resolve(userData);
        }
      })
    })
  })
}
const ChangePassword = (data) => {
  return new Promise((resolve) => {
    const params = data;
    AntiHacking(params).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }

      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["oldPassword", "newPassword"];
          let params = result.data;
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              const user = response.data;
              if (user.Password === EnCrypPassword(params.oldPassword)) {
                if (user.Password === EnCrypPassword(params.newPassword)) {
                  resolve({
                    status: false,
                    data: {},
                    message: `Use a new pasword that is different from the previous password.`
                  })
                  return;
                }
                let PStrength = PasswordStrength(data.newPassword);
                if (PStrength.status) {
                  QueryDB(`update users set Password='${EnCrypPassword(params.newPassword)}' where EmailAddress='${user.EmailAddress}' `).then((res) => {
                    if (res.status) {
                      SendEmail(`New password`, `Your password has been changed, if you did not perform this action please contact us imidiately. <br/> <b>New Password: </b><br/> ${params.newPassword}`, user);
                      SendSMS(user.PhoneNumber, "Password successfully changed and detail sent to email, if you did not perform this action please contact us imidiately.");
                    }
                    res.message = res.status ? "Password updated successfully." : "Password not updated";
                    resolve(res);
                  })
                } else {
                  resolve({
                    status: false,
                    data: {},
                    message: PStrength.message
                  })
                }
              } else {
                resolve({
                  status: false,
                  data: {},
                  message: `Oops! Invalid password`
                })
              }
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const PasswordStrength = (password) => {
  let regex = /[a-z]/;
  let regexCap = /[A-Z]/;
  let regexSp = /[!@#$%^&*()\-_=+{};:,<.>]/;
  let regexNum = /[0-9]/;
  let message = "Your password must be of at least 8 alphanumeric character and can reach to maximum length of 12 alphanumeric characters.";
  let strength = 0;
  if (String(password).length < 8) {
    return {
      status: false,
      message: message
    }
  }
  if (regex.test(password) || regexCap.test(password)) {
    strength += 1;
  }
  if (regexSp.test(password)) {
    strength += 1;
  }
  if (regexNum.test(password)) {
    strength += 1;
  }
  return {
    strength: strength,
    password: password,
    status: strength == 3,
    message: strength == 3 ? "" : message
  }
}
const ChangeTransactionPIN = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {

          let checkList = ["Password", "newTransactionPIN"];
          let params = result.data;
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              const u = response.data;
              CheckPassword(result.data.Password, u.PhoneNumber).then((pw) => {
                if (!pw.status) {
                  resolve(pw);
                  return;
                }
                if (response.status) {
                  const user = response.data;
                  if (user.Password === EnCrypPassword(params.Password)) {
                    if (user.TransactionPin === EnCrypPassword(params.newTransactionPIN)) {
                      resolve({
                        status: false,
                        data: {},
                        message: `Use a new Transaction Pin that is different from the previous Transaction Pin.`
                      })
                      return;
                    }
                    if (isNaN(params.newTransactionPIN)) {
                      resolve({
                        status: false,
                        data: {},
                        message: `Use a new Transaction Pin must be digits.`
                      })
                      return;
                    }
                    if (String(params.newTransactionPIN).length == TxnPINSize) {
                      QueryDB(`update users set TransactionPin='${EnCrypPassword(params.newTransactionPIN)}' where EmailAddress='${user.EmailAddress}' `).then((res) => {
                        //   SendSMS(user.PhoneNumber,sms);
                        if (res.status) {
                          SendEmail("New Transaction Pin", `Your new transaction PIN is :<b>${MaskNumber(params.newTransactionPIN)}</b> <br/> if you did not perform this action please contact us imidiately.`, user);
                        }
                        res.message = res.status ? "Transaction PIN updated successfully." : "Transaction PIN not updated";
                        resolve(res);
                      })
                    } else {
                      resolve({
                        status: false,
                        data: {},
                        message: `Transaction PIN must be ${TxnPINSize} digits length`
                      })
                    }
                  } else {
                    resolve({
                      status: false,
                      data: {},
                      message: `Oops! Invalid Transaction PIN`
                    })
                  }
                } else {
                  resolve({
                    status: false,
                    data: {},
                    message: `Invalid password`
                  })
                }
              })
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const EmailNotification = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["status"];
          let params = result.data;
          delete params.token;
          if (typeof params.status !== 'boolean') {
            resolve({
              status: false,
              message: `Oops! status must be a boolean ( true OR false).`,
              data: {}
            });
            return;
          }
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              if (response.status) {
                const user = response.data;
                QueryDB(`update users set email_notification='${params.status?1:0}' where PhoneNumber='${user.PhoneNumber}' limit 1`).then((res) => {
                  res.message = res.status ? "Settings updated successfull." : "Oops! settings not updated try again later.";
                  resolve(res)
                })
              } else {
                resolve({
                  status: false,
                  data: {},
                  message: `Invalid access token.`
                })
              }
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const SMSNotification = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["status"];
          let params = result.data;
          delete params.token;
          if (typeof params.status !== 'boolean') {
            resolve({
              status: false,
              message: `Oops! status must be a boolean ( true OR false).`,
              data: {}
            });
            return;
          }
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              if (response.status) {
                const user = response.data;
                QueryDB(`update users set sms_notification='${params.status?1:0}' where PhoneNumber='${user.PhoneNumber}' limit 1`).then((res) => {
                  res.message = res.status ? "Settings updated successfull." : "Oops! settings not updated try again later.";
                  resolve(res)
                })
              } else {
                resolve({
                  status: false,
                  data: {},
                  message: `Invalid access token.`
                })
              }
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const AccountUpgrade = (data) => {
  return new Promise((resolve) => {

    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      let params = result.data;
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["files", "doc_type"];
          delete params.token;
          const user = response.data;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              // move files
              MoveFiles(data.files, String(user.PhoneNumber)).then((fl) => {
                fl.data.forEach((path) => {
                  QueryDB(`insert into documents_upload (url,user_phoneNumber,document_type) values ('${path}','${user.PhoneNumber}','${params.doc_type.replace(/[^a-zA-Z 0-9]/g,'')}')`)
                })
                resolve(fl);
              })
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const AccountTypes = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = [];
          let params = result.data;
          delete params.token;
          if (data.name) {
            checkList.push("r_name");
            params.r_name = params.name;
            delete params.name;
          }
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: null
              });
            } else {
              if (response.status) {
                let sql = `select * from account_rules order by aid desc`;
                if (data.name) {
                  sql = `select * from account_rules where r_name='${params.name}' limit 1`;
                }
                QueryDB(sql).then((res) => {
                  res.message = res.status ? `Account rule${res.data.length > 1?"s":""} succesfully fetched.` : "Oops! Account rules not try again later.";
                  if (data.name) {
                    res.data = {
                      title: res.data[0].name,
                      privilages: String(res.data[0].privileges).split(",")
                    }
                  } else {
                    if (res.data.length != 0)
                      res.data = res.data.map((a, i) => {
                        return {
                          title: a.name,
                          privilages: String(a.privileges).split(",")
                        }
                      })
                  }
                  resolve(res)
                })
              } else {
                resolve({
                  status: false,
                  data: {},
                  message: `Invalid access token.`
                })
              }
            }
          })
        } else {
          resolve(response);
        }
      })
    })
  })
}
const UserSettings = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["token"];
          CheckEmptyInput(result.data, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: {}
              });
            } else {
              const user = response.data;
              resolve({
                status: true,
                message: `Settings fetched.`,
                data: {
                  email_notification: user.email_notification,
                  sms_notification: user.sms_notification,
                  account_type: String(user.account_type).toLowerCase()
                }
              });
            }
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
const SecondaryNumber = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      let params = result.data;
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {

          let checkList = ["PhoneNumber", "verifyToken"];
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                data: {},
                message: String(errorMessage)
              });
            } else {
              QueryDB(`select * from users where PhoneNumber='${params.PhoneNumber}' or PhoneNumber_Secondary='${params.PhoneNumber}' limit 1`).then((n) => {
                if (n.status) {
                  resolve({
                    status: false,
                    data: {},
                    message: `Phone number already in used.`
                  });
                  return;
                }
                TokenVerification({
                  PhoneNumber: params.PhoneNumber,
                  verificationToken: params.verifyToken
                }).then((rse) => {
                  if (!rse.status) {
                    resolve(rse);
                    return;
                  }
                  const user = response.data;
                  QueryDB(`update users set PhoneNumber_Secondary='${params.PhoneNumber}' where PhoneNumber='${user.PhoneNumber}' limit 1`).then((res) => {
                    res.message = res.status ? "Phone number saved." : "Oops! Phone number not saved try again later.";
                    resolve(res);
                  })
                })
              })
            }
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
const createFolder = (name) => {
  var fs = require('fs');
  var dir = `${name}`;
  return new Promise((resolve) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
      resolve({
        status: true,
        message: "Created",
        data: ""
      })
    } else {
      resolve({
        status: false,
        message: "Directory exists",
        data: ""
      })
    }
  })
}
const GetDefaultPhoneNumber = (user, SecondaryNumber) => {
  if (String(SecondaryNumber).toLowerCase() == "null") {
    return String(user.PhoneNumber);
  }
  return SecondaryNumber;
}
const removeQuotes = (s) => {
  if (s == "true") {
    return true
  }
  return false;
}
const ToggleSettings = (data) => {

  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      let params = result.data;

      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          const user = response.data;
          let checkList = [];
          delete params.token;
          let columns = [];
          Object.keys(params).forEach((a) => {
            if (a !== "account_type") {
              params[`${a}`] = removeQuotes(params[`${a}`]);
            }
          })

          if (params.account_type != undefined) {
            checkList.push("account_type");
            columns.push(`account_type='${params.account_type}'`);
          }
          if (params.secondary_phone_number_default != undefined) {
            checkList.push("secondary_phone_number_default");
            let d = params.default_phone_number ? user.PhoneNumber : user.PhoneNumber_Secondary;
            if (String(user.PhoneNumber_Secondary).toLowerCase() == "null") {
              d = user.PhoneNumber;
            }
            columns.push(`default_PhoneNumber='${d}'`);
          }
          if (params.email_notification != undefined) {
            checkList.push("email_notification");
            columns.push(`email_notification='${params.email_notification?1:0}'`);
          }
          if (params.sms_notification != undefined) {
            checkList.push("sms_notification");
            columns.push(`sms_notification='${params.sms_notification?1:0}'`);
          }
          if (checkList.length == 0) {
            resolve({
              status: false,
              data: {},
              message: `Some parameters are missing (email_notification,account_type,default_phone_number,sms_notification).`
            });
            return;
          }
          let qry = `update users set ${columns.join(",")} limit 1`;
          if (params.account_type != undefined && !["regular", "merchant"].includes(String(params.account_type).toLowerCase())) {
            resolve({
              status: false,
              message: `Oops! account type must be either (regular, merchant)`,
              data: params.account_type
            });
            return;
          }
          if (params.email_notification !== undefined && typeof params.email_notification !== "boolean") {
            resolve({
              status: false,
              message: `Oops! email_notification must be either (true or false)`,
              data: {}
            });
            return;
          }
          if (params.sms_notification !== undefined && typeof params.sms_notification !== "boolean") {
            resolve({
              status: false,
              message: `Oops! sms_notification must be either (true or false)`,
              data: {}
            });
            return;
          }
          if (params.secondary_phone_number_default !== undefined && typeof params.secondary_phone_number_default != "boolean") {
            resolve({
              status: false,
              message: `Oops! secondary_phone_number_default must be either (true or false)`,
              data: {}
            });
            return;
          }
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                data: {},
                message: String(errorMessage)
              });
            } else {
              QueryDB(`select * from documents_upload where user_phoneNumber='${user.PhoneNumber}' limit 1`).then((doc) => {
                if (!doc.status && checkList.includes("account_type") && params.account_type == "merchant") {
                  resolve({
                    status: false,
                    data: {},
                    message: `Please upload your CAC Certificate before swicthing to merchant account.`
                  });
                  return;
                }
                QueryDB(qry).then((n) => {
                  if (n.status) {
                    n.message = `The following updates were successful (${checkList.join(",").replace(/[_]/g,' ').replace("secondary","")})`;
                  }
                  resolve(n);
                })
              })
            }
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
const RemoveSecondaryNumber = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          const user = response.data;
          QueryDB(`update users set PhoneNumber_Secondary='null',default_PhoneNumber='${user.PhoneNumber}' where PhoneNumber='${user.PhoneNumber}' limit 1`).then((res) => {
            res.message = res.status ? "Phone number removed." : "Oops! Phone number not removed try again later.";
            if (String(user.PhoneNumber_Secondary) == "null") {
              resolve({
                status: false,
                message: "Secondary Phone number not avaliable.",
                data: {}
              });
              return;
            }
            resolve(res);
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
const CACVerification = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      // CheckAccess(result.data.token).then((response)=>{
      //   if(response.status)
      //   {
      let checkList = ["cac_number"];
      let params = result.data;
      delete params.token;

      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          VerifyCAC(params.cac_number).then((re) => {
            resolve(re);
          })
        }
      })
      // }else{
      // resolve(response)
      // }
      // })
    })
  })
}
const MoveFiles = (files, PhoneNumber, type = "documents") => {
  return new Promise((resolve) => {
    const filesPaths = files.map((a, i) => {
      let ext = "";
      let splext = String(a.originalname).split(".");
      ext = splext[splext.length - 1];
      return `${a.path}.${ext}`;
    });
    var newPaths = [];
    filesPaths.forEach((f, i) => {
      let newfilePath = String(f).replace("public/temp/", `public/fld-${PhoneNumber}/${type}/`)
      let oldfilePath = String(f).replace(".JPG", "").replace(".JPEG", "").replace(".PNG", "");
      console.log(newfilePath);
      newPaths.push(newfilePath);
      rename(oldfilePath, newfilePath, function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
      })
    })
    resolve({
      status: true,
      data: newPaths,
      message: ''
    })
  })
}
const GetAllUploads = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["searchBy"];
          let params = result.data;
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: {}
              });
            } else {
              const user = response.data;
              let qy = `select * from documents_upload where user_phoneNumber='${user.PhoneNumber}'`;
              if (params.searchBy !== "all") {
                qy += ` and document_type like '%${params.searchBy}%' `;
              }
              qy += ` order by dId desc`;
              QueryDB(qy).then((res) => {
                res.message = res.status ? "Documents listed successfully" : 'Documents not found.';
                resolve(res)
              })
            }
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
const DeleteUploads = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          let checkList = ["id", "Password"];
          let params = result.data;
          delete params.token;
          CheckEmptyInput(params, checkList).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: {}
              });
            } else {
              if (isNaN(params.id)) {
                resolve({
                  status: false,
                  message: "The parameter (id) must be a number.",
                  data: {}
                });
                return;
              }
              const user = response.data;
              CheckPassword(result.data.Password, user.PhoneNumber).then((pw) => {
                if (!pw.status) {
                  resolve(pw);
                  return;
                }
                const user = response.data;
                let qy = `delete from documents_upload where user_phoneNumber='${user.PhoneNumber}' and dId='${params.id}' `;
                QueryDB(qy).then((res) => {
                  res.message = res.status ? "Documents deleted successfully" : 'Documents not found.';
                  resolve(res)
                })
              })
            }
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
const SecondaryNumberVerification = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      CheckAccess(result.data.token).then((response) => {
        if (response.status) {
          CheckEmptyInput(result.data, ["token"]).then((errorMessage) => {
            if (errorMessage) {
              resolve({
                status: false,
                message: String(errorMessage),
                data: {}
              });
            } else {
              var user = response.data;
              NonAuthGetUserDetails({
                PhoneNumber: String(user.PhoneNumber)
              }).then((u) => {
                resolve({
                  status: String(user.PhoneNumber_Secondary) !== "null",
                  data: user.PhoneNumber_Secondary,
                  message: String(user.PhoneNumber_Secondary) === "null" ? "Secondary number not avaliable" : "Secondary number  found."
                });
              })
            }
          })
        } else {
          resolve(response)
        }
      })
    })
  })
}
// merchants
const GetMerchantDetails = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      let checkList = ["token"];
      let params = result.data;
      if (params.merchantId != undefined) {
        checkList.push("merchantId");
      }

      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          CheckAccess(params.token).then((response) => {
            let queryString = "";
            if (response.status) {
              let merchantData = response.data;
              if (params.merchantId == undefined) {
                queryString = `select * from users inner join merchant_profile on users.PhoneNumber=merchant_profile.PhoneNumber where users.account_type='merchant' and merchant_profile.PhoneNumber='${merchantData.PhoneNumber}' limit 1`;
              } else {
                queryString = `select * from merchant_profile inner join users on merchant_profile.PhoneNumber=users.PhoneNumber where merchant_profile.merchantId='${params.merchantId}' limit 1`;
              }
              QueryDB(queryString).then((res) => {
                if (!res.status) {
                  res.message = `Account does not exist `;
                  res.data = {}
                } else {
                  let user = res.data[0];
                  delete user.Password;
                  delete user.TransactionPin;
                  delete user.dob;
                  delete user.mId;
                  delete user.mDate;
                  delete user.Nin;
                  delete user.AccessToken;
                  delete user.verificationToken;

                  res.message = "Account found.";
                  res.data = user;
                  res.data.FirstName = user.company_name;
                  res.data.LastName = "";
                  GetWalletBalance(user.PhoneNumber).then((rse) => {
                    if (rse.status) {
                      let wallet = rse.data;
                      delete wallet.phone_number;
                      delete wallet.created_at;
                      res.data.wallet = wallet;
                    } else {
                      res.data.wallet = {
                        wallet_id: null,
                        balance: "0.00"
                      };
                    }
                    resolve(res);
                  })
                  return;
                }
                resolve(res);
              })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const DataPurchase = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      let checkList = ["token", "dataPlanId", "network_operator", "amount", "phoneNumber", "transactionPIN"];
      let params = result.data;
      const ref = Md5(Moment().toISOString() + (generateRandomNumber(18)));
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          CheckAccess(result.data.token, result.data.transactionPIN).then((response) => {
            if (response.status) {
              const {
                phoneNumber,
                dataPlanId,
                network_operator,
                amount
              } = params;
              const currentuser = response.data;
              UpdateWalletBalance(
                currentuser,
                String(params.amount),
                'debit',
                String(ref)
              ).then((bal) => {
                if (!bal.status) {
                  resolve(bal);
                } else {
                  BuyData(params, ref).then((res) => {
                    if (res.status) {
                      // save record to data purchase table
                      QueryDB(GetQueryString(["PhoneNumber", "DataPlanId", "dStatus", "dReferenceNo", "nameServiceProvider", "amount"], {
                        PhoneNumber: currentuser.PhoneNumber,
                        DataPlanId: dataPlanId,
                        dStatus: "success",
                        dReferenceNo: ref,
                        nameServiceProvider: network_operator,
                        recipient: phoneNumber,
                        amount: amount
                      }, 'insert', 'data_purchase'))
                    } else {
                      UpdateWalletBalance(currentuser, amount, 'credit', ref);
                    }
                    SaveTransactionHistory({
                      amount: params.amount,
                      beneficiary_account: String(currentuser.PhoneNumber),
                      beneficiary_bank_name: `${AppName} Wallet`,
                      customer_name: currentuser.FirstName + " " + currentuser.LastName,
                      memo: `Data top-up of ${NairaSymbol}${params.amount} to ${params.PhoneNumber}`,
                      PhoneNumber: String(currentuser.PhoneNumber),
                      token: "",
                      transaction_ref: ref,
                      transaction_type: 'debit',
                      status: res.status ? "success" : "failed"
                    })
                    resolve(res);
                  })
                }
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const GetListElectricityProvider = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      let checkList = ["token"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          // resolve({
          //   status:false,
          //   message:"String(errorMessage)",
          //   data:result.data
          // });
          // return ;
          CheckAccess(result.data.token).then((response) => {
            if (response.status) {

              if (BillPaymentProvider == "reloadly") {
                GetBillersReloadly({
                  type: 'ELECTRICITY_BILL_PAYMENT'
                }).then((res) => {
                  if (res.status) {
                    if (res.data) {
                      res.data = res.data.map((a, i) => {
                        // "id": 1,
                        // "name": "Ikeja Electricity Postpaid",
                        // "countryCode": "NG",
                        // "countryName": "Nigeria",
                        // "type": "ELECTRICITY_BILL_PAYMENT",
                        // "serviceType": "POSTPAID",
                        // "localAmountSupported": true,
                        // "localTransactionCurrencyCode": "NGN",
                        // "minLocalTransactionAmount": 1000,
                        // "maxLocalTransactionAmount": 300000,
                        // "localTransactionFee": 2023.5,
                        // "localTransactionFeeCurrencyCode": "NGN",
                        // "localDiscountPercentage": 0,
                        // "internationalAmountSupported": true,
                        // "internationalTransactionCurrencyCode": "NGN",
                        // "minInternationalTransactionAmount": 1000,
                        // "maxInternationalTransactionAmount": 300000,
                        // "internationalTransactionFee": 2023.5,
                        // "internationalTransactionFeeCurrencyCode": "NGN",
                        // "internationalDiscountPercentage": 0,
                        return {
                          id: a.id,
                          biller_code: a.id,
                          name: a.name,
                          default_commission: 0.3,
                          date_added: "2020-09-17T15:57:09.017Z",
                          country: a.countryCode,
                          is_airtime: false,
                          biller_name: a.name,
                          item_code: a.id,
                          short_name: a.type,
                          fee: a.localDiscountPercentage,
                          commission_on_fee: true,
                          amount: 0,
                          min_amount: a.minLocalTransactionAmount,
                          max_amount: a.maxLocalTransactionAmount
                        }
                      })
                    }
                  }
                  resolve(res);
                })
              } else if (BillPaymentProvider == "flutterwave") {
                GetElectricityList().then((res) => {
                  resolve(res);
                })
              } else {
                resolve({
                  status: false,
                  message: "Provider not set.",
                  data: []
                });
              }
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const GetListDataBundles = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckEmptyInput(result.data, ["token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          // resolve({
          //   status:false,
          //   message:"String(errorMessage)",
          //   data:result.data
          // });
          // return ;
          CheckAccess(result.data.token).then((response) => {
            if (response.status) {
              //  GetDataPlans(result.data.bill_code).then((res)=>{
              //   let list = {}
              //     res.data.forEach((a,i)=>{
              //       delete  a.commission_on_fee;
              //       delete  a.label_name;
              //       delete  a.fee;
              //       delete  a.is_airtime;
              //       delete  a.country;
              //       delete  a.default_commission;

              //       if(!list.hasOwnProperty(`${a.biller_code}`))
              //       {
              //       list[`${a.biller_code}`] = {name:a.name,list:[a]};
              //       }else{
              //         list[`${a.biller_code}`].list.push(a)
              //       }
              //   })
              //   res.data = list;
              //   resolve(res);
              //  })
              GetAIRTIMENGDataPlans().then((res) => {
                let list = {}
                res.data.forEach((a, i) => {
                  const obj = {
                    id: i,
                    dataPlanId: a.package_code,
                    name: a.network_operator,
                    biller_name: a.plan_summary,
                    item_code: a.package_code,
                    short_name: a.plan_summary,
                    amount: a.regular_price
                  };
                  const nd = String(a.network_operator).toUpperCase();
                  if (!list.hasOwnProperty(`${nd}`)) {
                    list[`${nd}`] = {
                      name: nd,
                      list: [obj]
                    };
                  } else {
                    list[`${nd}`].list.push(obj)
                  }
                })
                res.data = list;
                resolve(res);
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const GetAirtimeProviders = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckEmptyInput(result.data, ["token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          CheckAccess(result.data.token).then((response) => {
            if (response.status) {
              GetAirtimeServices().then((res) => {
                res.data.map((a, i) => {
                  delete a.commission_on_fee;
                  delete a.label_name;
                  delete a.fee;
                  delete a.is_airtime;
                  delete a.country;
                  delete a.default_commission;
                  delete a.date_added;
                  delete a.default_commission;
                  return a
                })
                resolve(res);
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const NumberMeterValidation = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckEmptyInput(result.data, ["token", "meter_number", "type", "serviceID"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          CheckAccess(result.data.token).then((response) => {
            if (response.status) {
              VTPASSVerifyMeterNumber({
                meterNumber: result.data.meter_number,
                type: result.data.type,
                serviceID: "ikeja-electric"
              }).then((res) => {
                resolve(res);
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const PurchaseAirtime = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckEmptyInput(result.data, ["token", "phone_number", "amount", "biller_name", "transactionPIN"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          CheckAccess(result.data.token, result.data.transactionPIN).then((response) => {
            if (response.status) {
              let params = result.data;
              const currentuser = response.data;
              const ref = Md5(Moment().toISOString() + generateRandomNumber(16));
              UpdateWalletBalance(
                currentuser,
                String(params.amount),
                'debit',
                String(ref)
              ).then((bal) => {
                if (!bal.status) {
                  resolve(bal);
                } else {
                  // send email
                  AirtimePurchase(data, ref).then((airtimeres) => {
                    if (airtimeres.status) {
                      const sms = `${AppName} Debit Amt: ${NairaSymbol}${returnComma(params.amount)} \nAcc: ${MaskNumber(String(currentuser.PhoneNumber))} Desc: Airtime purchase \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(String(bal.data.balance))}`;
                      SendSMS(GetDefaultPhoneNumber(currentuser, String(currentuser.PhoneNumber)), sms);
                      SendEmail(`${AppName} Debit transaction`, `Debit<br/>
          Amt: ${NairaSymbol}${returnComma(params.amount)}<br/>
          Acc: ${MaskNumber(String(currentuser.PhoneNumber))}
          Desc: Airtime purchase<br/>
          Time:${Moment().format("x hh:mm A")}<br/>
          Total Bal:${NairaSymbol}${returnComma(String(result.data.balance))}`, currentuser);
                      // update transaction history and airtime history
                      const resp = airtimeres.data;
                      QueryDB(`INSERT INTO airtime_purchase (amount,recipient,PhoneNumber,memo, network, flw_ref, tx_ref,reference) VALUES ('${params.amount}','${resp.phone_number}','${currentuser.PhoneNumber}','Airtime recharge to ${currentuser.PhoneNumber}','${resp.network}','${resp.reference}','${resp.reference}','${resp.reference}')`);
                      SaveTransactionHistory({
                        amount: params.amount,
                        beneficiary_account: String(params.phone_number),
                        beneficiary_bank_name: `Airtime Purchase`,
                        customer_name: currentuser.FirstName + " " + currentuser.LastName,
                        memo: `Airtime top-up of ${NairaSymbol}${result.data.amount} to ${result.data.phone_number}`,
                        PhoneNumber: String(currentuser.PhoneNumber),
                        token: "",
                        transaction_ref: ref,
                        transaction_type: 'debit',
                        status: "success"
                      })
                    } else {
                      // update wallet balance
                      UpdateWalletBalance(currentuser, data.amount, 'credit', ref);
                    }
                    resolve(airtimeres);
                  })
                }
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const GetAirtimeHistory = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      if (result.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: result.data
        });
        return;
      }
      let checkList = ["token"];
      let params = data;
      if (params.PhoneNumber != undefined) {
        checkList.push("PhoneNumber");
      }
      CheckEmptyInput(params, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: null
          });
        } else {
          CheckAccess(result.data.token).then((sender) => {
            if (sender.status) {
              let currentuser = sender.data;
              let limit = "0,50";
              let query = `select * from airtime_purchase where PhoneNumber='${currentuser.PhoneNumber}' order by aId desc limit ${limit}`;
              if (data.limit) {
                limit = data.limit;
              }
              if (params.PhoneNumber != undefined) {
                query = `select * from airtime_purchase where PhoneNumber='${params.PhoneNumber}' order by aId desc limit ${limit} `;
              }
              QueryDB(query).then((res) => {
                res.data = res.data.map((a, i) => {
                  return {
                    id: a.aId,
                    recepient: a.PhoneNumber,
                    referenceNo: a.flw_ref,
                    date: Moment(a.aDate).format("Do,MMM,YYYY"),
                    provider: a.nameServiceProvider,
                    memo: a.memo,
                    amount: a.amount
                  }
                })
                resolve(res);
              });
            } else {
              resolve(sender)
            }
          })
        }
      })
    })
  })
}
const ElectricityPurchase = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      CheckEmptyInput(result.data, ["token", "meter_number", "amount", "billerId"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          // resolve({
          //   status:false,
          //   message:"String(errorMessage)",
          //   data:result.data
          // });
          // return ;
          CheckAccess(result.data.token).then((response) => {
            if (response.status) {
              let params = result.data;
              const currentuser = response.data;
              const ref = Md5(Moment().toISOString() + generateRandomNumber(16));
              UpdateWalletBalance(
                currentuser,
                String(params.amount),
                'debit',
                String(ref)
              ).then((bal) => {
                if (!bal.status) {
                  resolve(bal);
                } else {
                  // send email
                  BuyElectricityReloadly(params, ref).then((elecResponse) => {
                    if (elecResponse.status) {
                      const sms = `${AppName} Debit Amt: ${NairaSymbol}${returnComma(params.amount)} \nAcc: ${MaskNumber(String(currentuser.PhoneNumber))} Desc: Electricity bill purchase \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(String(bal.data.balance))}`;
                      SendSMS(GetDefaultPhoneNumber(currentuser, String(currentuser.PhoneNumber)), sms);
                      SendEmail(`${AppName} Debit transaction`, `Debit<br/>
          Amt: ${NairaSymbol}${returnComma(params.amount)}<br/>
          Acc: ${MaskNumber(String(currentuser.PhoneNumber))}
          Desc: Electricity purchase<br/>
          Time:${Moment().format("x hh:mm A")}<br/>
          Total Bal:${NairaSymbol}${returnComma(String(result.data.balance))}`, currentuser);
                      // update transaction history and airtime history
                      const resp = elecResponse.data;
                      QueryDB(`INSERT INTO electricity_purchase (phone_number,amount, memo, meter_number, provider, reference) VALUES ('${resp.phone_number}','${params.amount}','Electricity recharge to Meter No. ${params.meter_number}','${params.meter_number}','${params.billerId}','${ref}')`);
                      SaveTransactionHistory({
                        amount: params.amount,
                        beneficiary_account: String(params.meter_number),
                        beneficiary_bank_name: `Electricity Purchase`,
                        customer_name: currentuser.FirstName + " " + currentuser.LastName,
                        memo: `Electricity top-up of ${NairaSymbol}${result.data.amount} to ${params.meter_number}`,
                        PhoneNumber: String(currentuser.PhoneNumber),
                        token: "",
                        transaction_ref: ref,
                        transaction_type: 'debit',
                        status: "success"
                      })
                    } else {
                      // update wallet balance
                      UpdateWalletBalance(currentuser, data.amount, 'credit', ref);
                    }
                    resolve(elecResponse);
                  })
                }
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const USSD = (data) => {
  return new Promise((resolve) => {
    const checklist = ["sessionId", "serviceCode", "phoneNumber", "text", "networkCode"];
    CheckEmptyInput(data, checklist).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: "END " + String(errorMessage),
          data: {}
        });
      } else {
        USSDEventCallback(data, QueryDB).then((res) => {
          resolve(res);
        })
      }
    })
  })
}
const ForgotPassword = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["new_password", "phone_number"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          NonAuthGetUserDetails({
            PhoneNumber: params.phone_number
          }).then((rse) => {
            if (!rse.status) {
              resolve(rse);
              return;
            }
            // send sms 
            SendSMS(params.phone_number, `You have successfully reset your password, if you did not perform this action please contact us - ${CustomerServicePhoneNumber} immediately.`);
            // send email
            SendEmail("New Password", `You have successfully reset your password<br/> <b>Details:</b><br/>New Password: ${params.new_password}<br/> if you did not perform this action please contact us via the  following - <br/><b>Mobile Number:</b> ${CustomerServicePhoneNumber}<br/><b>Email:</b> ${CustomerServiceEmail} immediately.`, rse.data);
            // update pasword
            QueryDB(`update users set Password='${EnCrypPassword(params.new_password)}' where PhoneNumber='${params.phone_number}' limit 1`).then((res) => {
              resolve({
                status: res.status,
                message: res.status ? "New password updated successfully." : "Oops! Password not saved, try again later.",
                data: {}
              });
            });
          })
        }
      })
    })
  })
}
const NewPassword = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["new_password", "phone_number"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          NonAuthGetUserDetails({
            PhoneNumber: params.phone_number
          }).then((rse) => {
            if (!rse.status) {
              resolve(rse);
              return;
            }
            // send sms 
            SendSMS(params.phone_number, `You have successfully reset your password, if you did not perform this action please contact us - ${CustomerServicePhoneNumber} immediately.`);
            // send email
            SendEmail("New Password", `You have successfully reset your password<br/> <b>Details:</b><br/>New Password: ${params.new_password}<br/> if you did not perform this action please contact us via the  following - <br/><b>Mobile Number:</b> ${CustomerServicePhoneNumber}<br/><b>Email:</b> ${CustomerServiceEmail} immediately.`, rse.data);
            // update pasword
            QueryDB(`update users set Password='${EnCrypPassword(String(params.new_password).trim())}' where PhoneNumber='${params.phone_number}' limit 1`).then((res) => {
              resolve({
                status: res.status,
                message: res.status ? "New password updated successfully." : "Oops! Password not saved, try again later.",
                data: {}
              });
            });
          })
        }
      })
    })
  })
}
const UpdateToken = (data) => {
  setTimeout(() => {
    const pin = generateRandomNumber(parseInt(String(VerifiedPINSize) + 3));
    QueryDB(GetQueryString(["verificationToken"], {
      verificationToken: pin
    }, 'update', 'tokens', {
      PhoneNumber: data.PhoneNumber
    }));
  }, SMS_TimeOut)
}
const MerchantVerifyCash = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["referenceNumber", "token", "payout", "transactionPIN"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token, params.transactionPIN).then((response) => {
            if (response.status) {
              // verify reference number
              QueryDB(`select * from BaseAccount where refNo='${params.referenceNumber}' limit 1`).then((res) => {
                if (res.status) {
                  // send token for verification
                  const responseData = res.data[0];
                  NonAuthGetUserDetails({
                    PhoneNumber: responseData.transactionFrom
                  }).then((uResp) => {
                    // SendToken()
                    let senderData = {
                      FirstName: "",
                      LastName: ""
                    };
                    if (uResp.status) {
                      senderData.FirstName = uResp.data.FirstName;
                      senderData.LastName = uResp.data.LastName;
                    }
                    if (String(responseData.transactionRef) !== "null") {
                      resolve({
                        status: false,
                        message: `Oops! Funds already cashout from the system.`,
                        data: {}
                      });
                      return;
                    }
                    if (responseData.transactionStatus == 'pending') {
                      if (result.data.payout && String(result.data.payout) == "true") {
                        SendToken({
                          PhoneNumber: responseData.transactionTo,
                          token: params.token
                        }).then((mres) => {
                          mres.data = responseData;
                          mres.data = Object.assign(mres.data, senderData);
                          resolve(mres);
                        })
                      } else {
                        res.data = res.status ? Object.assign(responseData, senderData) : {};
                        res.message = "Data fetched..."
                        resolve(res);
                      }
                    } else {
                      resolve({
                        status: false,
                        message: `Oops! Funds already cashout from the system.`,
                        dataData
                      });
                    }
                  })
                } else {
                  resolve({
                    status: false,
                    message: `Oops! Funds not found.`,
                    data: {}
                  });
                }
              })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const MerchantAcceptCash = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["referenceNumber", "token", "vericationToken", "transactionPIN"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token, params.transactionPIN).then((response) => {
            if (response.status) {
              QueryDB(`select * from BaseAccount where refNo='${params.referenceNumber}' limit 1`).then((res) => {
                if (res.status) {
                  // send token for verification
                  const responseData = res.data[0];
                  if (String(responseData.transactionStatus) == "paid") {
                    resolve({
                      status: false,
                      message: `Oops! Funds already cashout from the system.`,
                      data: {}
                    });
                  } else {

                    GetMerchantDetails({
                      token: params.token
                    }).then((mchResp) => {
                      if (!mchResp.status) {
                        mchResp.message = "Oops! Merchant not exist."
                        resolve(mchResp);
                        return;
                      }
                      TokenVerification({
                        PhoneNumber: responseData.transactionTo,
                        verificationToken: params.vericationToken
                      }).then((tk) => {
                        // verify reference number
                        if (tk.status) {
                          const merchantData = mchResp.data;
                          if (String(merchantData.PhoneNumber) == String(responseData.transactionTo)) {
                            resolve({
                              status: false,
                              message: `Oops! You cannot transfer to your wallet.`,
                              data: {}
                            });
                            return;
                          }
                          if (responseData.transactionStatus == 'pending') {
                            // move funds to merchant account
                            const txRef = String(Md5(responseData.amount + Moment().toISOString())).substring(0, 6).toUpperCase()
                            // update merchant wallet
                            UpdateWalletBalanceBaseAccount(merchantData, responseData, txRef, params.token).then((bResponse) => {
                              resolve(bResponse);
                            })
                          } else {
                            resolve({
                              status: false,
                              message: `Oops! Funds already cashout from the system.`,
                              data: {}
                            });
                          }
                        } else {
                          resolve(tk)
                        }
                      })
                    })
                  }
                } else {
                  resolve({
                    status: false,
                    message: `Oops! Funds not found.`,
                    data: {}
                  });
                }
              })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const UpdateWalletBalanceBaseAccount = (merchantData, response, refNo, token) => {
  return new Promise((resolve) => {
    // resolve(response)
    // return;
    GetWalletBalance(String(merchantData.PhoneNumber)).then((res) => {
      if (res.status) {
        QueryDB(`update BaseAccount set transactionStatus='paid',transactionRef='${refNo}',merchantId='${merchantData.merchantId}' where refNo='${response.refNo}' `)
        const WalletData = res.data;
        const balance = String(parseFloat(WalletData.balance) + parseFloat(String(response.transactionAmount)));
        QueryDB(`update wallets set balance='${balance}' where phone_number='${merchantData.PhoneNumber}' limit 1`).then((res) => {
          if (res.status) {
            res.message = "Wallet successfully funded.";
            // send sms to merchant and save transaction history
            SaveTransactionHistory({
              amount: String(response.transactionAmount),
              beneficiary_account: String(response.transactionTo),
              beneficiary_bank_name: "AbaaPay Wallet",
              customer_name: "Cash Pick-Up",
              memo: `Cash Pick-Up to ${response.transactionTo}`,
              PhoneNumber: String(merchantData.PhoneNumber),
              token: "",
              transaction_ref: refNo,
              transaction_type: "credit",
              status: "success"
            })
            // send SMS
            SendSMS(response.transactionTo, `NGN${response.transactionAmount} paid out successfully to ${response.transactionTo} via Merchant ${merchantData.FirstName} ${merchantData.LastName} (${merchantData.PhoneNumber})`);
            // send confirmation msg to merchant
            SendSMS(String(merchantData.PhoneNumber), `Your wallet has been credited with NGN${response.transactionAmount} \nTxtRef:${refNo}\nDate:${Moment().format("DD/MM/YYYY hh:mm:ss A")}`);
            // send confirmation msg to sender
            SendSMS(String(response.transactionFrom), `NGN${response.transactionAmount} has been successfully picked up by ${response.transactionTo} \nTxtRef:${refNo}\nDate:${Moment().format("DD/MM/YYYY hh:mm:ss A")}`);
            res.message = "Amount successfull paid out.";
          } else {
            res.message = "Amount not paid.";
          }
          resolve(res);
        });
      } else {
        resolve(res);
      }
    })
  })
}
const AdminTransactions = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["token"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token).then((response) => {
            if (response.status) {
              const currentUser = response.data;
              if (currentUser.account_type !== "admin") {
                resolve({
                  status: false,
                  message: `Oops! access denied.`,
                  data: {}
                });
                return;
              }
              QueryDB(`select * from BaseAccount limit ${data.limit?data.limit:"0,50"}`).then((res) => {
                if (res.status) {
                  resolve({
                    status: true,
                    message: `Data fetched.`,
                    data: {
                      list: res.data.map((a, i) => {
                        return {
                          refNo: a.refNo,
                          txtRef: a.transactionRef,
                          date: Moment(a.transactionDate).format("DD-MM-YYYY hh:mm:ss A"),
                          from: a.transactionFrom,
                          to: a.transactionTo,
                          status: a.transactionStatus,
                          amount: a.transactionAmount,
                          merchantId: a.merchantId
                        }
                      }),
                      total_pages: 30,
                      per_page: 50,
                      current_page: 1
                    },
                  });
                } else {
                  resolve({
                    status: false,
                    message: `Oops! transactions not found.`,
                    data: []
                  });
                }
              })
            } else {

            }
          })
        }
      })
    })
  })
}
const PickUpCash = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["token", "phoneNumber", "amount", "memo", "transactionPIN"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token, params.transactionPIN).then((response) => {
            if (response.status) {
              const currentUser = response.data;
              NonAuthGetUserDetails({
                PhoneNumber: result.data.phoneNumber
              }).then((uc) => {
                if (uc.status) {
                  uc.data = {};
                  uc.status = false;
                  uc.message = `Oops! Account exist, Please use wallet-to-wallet channel.`;
                  resolve(uc);
                  return;
                }
                GetWalletBalance(String(currentUser.PhoneNumber)).then((res) => {
                  if (res.status) {
                    const WalletData = res.data;
                    if (parseFloat(WalletData.balance) < parseFloat(String(result.data.amount))) {
                      resolve({
                        status: false,
                        message: `Oop! Insufficient balance (${NairaSymbol}${returnComma(WalletData.balance)}).`,
                        data: {}
                      });
                      return;
                    }
                    const balance = String(parseFloat(WalletData.balance) - parseFloat(String(result.data.amount)));
                    const refNo = Md5(String(Moment().format("DDMMYYYhhmmss"))).substring(0, 6);
                    QueryDB(`update wallets set balance='${balance}' where phone_number='${currentUser.PhoneNumber}' limit 1`).then((res) => {
                      if (res.status) {
                        QueryDB(`insert into BaseAccount (transactionFrom,transactionTo,refNo,transactionStatus,transactionAmount) values('${currentUser.PhoneNumber}','${result.data.phoneNumber}','${refNo}','pending','${result.data.amount}')`);
                        // send sms to merchant and save transaction history
                        SaveTransactionHistory({
                          amount: String(result.data.amount),
                          beneficiary_account: String(result.data.phoneNumber),
                          beneficiary_bank_name: "AbaaPay Wallet",
                          customer_name: "Unregistered user",
                          memo: `Send to ${result.data.phoneNumber} from wallet`,
                          PhoneNumber: String(currentUser.PhoneNumber),
                          token: "",
                          transaction_ref: refNo,
                          transaction_type: "transfer"
                        })
                        // send SMS to current user
                        const sms = `Debit\nAmt: ${NairaSymbol}${returnComma(result.data.amount)} \nAcc: ${MaskNumber(String(currentUser.PhoneNumber))} \nDesc: Cash pick-up \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(String(balance))}`;
                        SendSMS(currentUser.PhoneNumber, sms);
                        // send to unregistered user
                        const usms = `You have a cash Pick Up of ${NairaSymbol}${returnComma(result.data.amount)} \nFROM: ${currentUser.FirstName} ${currentUser.LastName} (${currentUser.PhoneNumber})\nRefNo: ${refNo}, You only need your mobile number for verification.`;
                        SendSMS(result.data.phoneNumber, usms);
                        res.message = "Fund debited.";
                      } else {
                        res.message = "Fund not debited.";
                      }
                      resolve(res);
                    });
                  } else {
                    resolve(res)
                  }
                })
              })
            } else {
              resolve(response);
            }
          })
        }
      })
    })
  })
}
const MerchantRegistration = (userInfo) => {
  return new Promise((resolve) => {
    AntiHacking(userInfo).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const userData = data.data;
      const checkList = ["cac_number", "company_name", "company_address", "registration_date", "PhoneNumber", "Password", "EmailAddress", "TransactionPin"];
      CheckEmptyInput(userData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        // check email existence, check NIN existence, check mobile number existence
        QueryDB(`select * from users where PhoneNumber='${userData.PhoneNumber}' or EmailAddress='${userData.EmailAddress}' limit 1`).then((response) => {
          if (response.status) {
            let user = response.data[0];
            resolve({
              status: false,
              data: {},
              message: `Oops! ${user.EmailAddress == userData.EmailAddress?'Email address':user.PhoneNumber == userData.PhoneNumber?"phone number":""} already in use.`
            })
            return;
          }
          if (!ValidateBOD(userInfo.registration_date)) {
            resolve({
              status: false,
              data: {},
              message: `Oops! Invalid registration date.`
            })
            return;
          }
          userData.Password = EnCrypPassword(userData.Password);
          let merchantId = Md5(String(userData.cac_number)).substring(0, 6);
          QueryDB(`select * from merchant_profile where cac_number='${userData.cac_number}' limit 1`).then((a) => {
            if (!a.status) {
              let qy = `insert into merchant_profile (cac_number,company_name,company_address,registration_date,merchantId,PhoneNumber) values('${userData.cac_number}','${userData.company_name}','${userData.company_address}','${userData.registration_date}','${merchantId}','${userData.PhoneNumber}')`;
              QueryDB(qy).then((resp) => {
                userData.TransactionPin = EnCrypPassword(String(userData.TransactionPin));
                qy = `insert into merchant_profile (cac_number,company_name,company_address,registration_date,merchantId,PhoneNumber) values('${userData.cac_number}','${userData.company_name}','${userData.company_address}','${userData.registration_date}','${merchantId}','${userData.PhoneNumber}')`;
                QueryDB(`insert into users(FirstName,PhoneNumber,EmailAddress,Password,TransactionPin,email_notification, sms_notification,account_type,default_PhoneNumber) values('${userData.company_name}','${userData.PhoneNumber}','${userData.EmailAddress}','${userData.Password}','${userData.TransactionPin}','1','1','merchant','${userData.PhoneNumber}')`).then((res) => {
                  if (res.status) {
                    res.message = "Registration was successful.";
                    res.data = {};
                    // send email
                    SendEmail(`Registration at ${AppName}`, `Hi ${userData.company_name}, <br/>your registration was successful, the following are your login details:<br/><b>Phone number</b>:${userData.PhoneNumber}<br/>`, userData);
                    // send sms
                    SendSMS(String(userData.PhoneNumber), `Hi ${userData.company_name}, you have successfully registered as merchant at ${AppName}, your merchant CODE is: ${merchantId}.`);
                    resolve(res);
                  } else {
                    res.message = "Oops! Registration was not successful.";
                    res.data = {};
                    resolve(res);
                  }
                })
              });
            } else {
              a.status = false;
              a.data = {}
              a.message = "Oops! cac number already in use."
              resolve(a)
            }
          })
        })
      })
    })
  });
}
const removeDuplicates = (allInputs) => {
  let list = [];
  for (var i in allInputs) {
    console.log(allInputs[i])
  }
}
const CreateSplitAccount = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["amount", "group_name", "beneficiaries", "distribution", "transactionPIN", "token"];
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token, requestData.transactionPIN).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          GetWalletBalance(currentUser.PhoneNumber).then((re) => {
            if (!re.status) {
              re.message = "Oops! account does not exist.";
              re.data = {};
              resolve(re)
            } else {
              let WalletData = re.data;
              if (parseFloat(WalletData.balance) < parseFloat(requestData.amount)) {
                resolve({
                  status: false,
                  message: `Insufficient balance (NGN${WalletData.balance})`,
                  data: {
                    balance: WalletData.balance
                  }
                });
              } else {
                const distribution = String(requestData.distribution).toLowerCase();
                if (distribution == "evenly") {
                  // select all beneficiaries
                  if (String(distribution).includes('{')) {
                    resolve({
                      status: false,
                      data: {},
                      message: `Oops! no beneficiary found.`
                    })
                    return;
                  }
                  let allBeneficiaries = String(requestData.beneficiaries).split(",");
                  let currentUserNumberExist = allBeneficiaries.find((a) => a == currentUser.PhoneNumber);
                  if (currentUserNumberExist == currentUser.PhoneNumber) {
                    resolve({
                      status: false,
                      data: currentUserNumberExist,
                      message: `Oops! your number cannot be included among beneficiaries.`
                    })
                    return;
                  }
                  const duplicates = [];
                  const getlist = [];
                  allBeneficiaries.forEach((a) => {
                    if (!getlist.includes(a)) {
                      getlist.push(a)
                    } else {
                      duplicates.push(a)
                    }
                  });
                  if (duplicates.length !== 0) {
                    resolve({
                      status: false,
                      data: allBeneficiaries,
                      message: `Duplicate beneficiary found (${duplicates.join(",")})`
                    });
                    return;
                  }
                  QueryDB(`SELECT * FROM users WHERE PhoneNumber IN ('${allBeneficiaries.join("','")}')`).then((beneRes) => {
                    let users = beneRes.data.map((a, i) => {
                      return {
                        number: a.PhoneNumber,
                        name: a.FirstName + " " + a.LastName,
                        accountType: a.account_type,
                        email: a.EmailAddress
                      }
                    })

                    let checkMerchant = users.filter((a, i) => a.accountType == "merchant")
                    if (checkMerchant.length > 0) {
                      resolve({
                        status: false,
                        data: checkMerchant.map((a, i) => a.number),
                        message: `Merchant number cannot be added as beneficiary`
                      });
                      return;
                    }
                    allBeneficiaries = allBeneficiaries.map((a, i) => {
                      const foundUser = users.find((b) => b.number == a);
                      if (foundUser) {
                        foundUser.name = String(foundUser.name.replace("null", "")).trim();
                        const txRef = String(Md5(Moment().toISOString()))
                        return {
                          ...foundUser,
                          exist: true
                        };
                      } else {
                        return {
                          number: a,
                          email: null,
                          name: `Unregistered user`,
                          exist: false
                        }
                      }
                    })

                    if (allBeneficiaries.length !== 0) {
                      const txRef = String(Md5(Moment().toISOString()))
                      UpdateWalletBalance(currentUser, requestData.amount, 'debit', txRef).then((upResp) => {
                        const balance = upResp.data.balance;
                        // send debit sms to current user
                        const sms = `${AppName} Debit\nAmt: ${NairaSymbol}${returnComma(requestData.amount)} \nAcc: ${MaskNumber(String(currentUser.PhoneNumber))} \nDesc: Split payment\nBeneficiaries: ${allBeneficiaries.length} \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(String(balance))}`;
                        SendSMS(currentUser.PhoneNumber, sms);
                        const msg = `${AppName} Debit<br/>
          Amt: ${NairaSymbol}${returnComma(requestData.amount)} <br/>
          Acc: ${MaskNumber(String(currentUser.PhoneNumber))} <br/>
          RefNo.: ${txRef} <br/>
          Desc: Split payment<br/>
          Beneficiaries: ${allBeneficiaries.length} <br/>
          Time:${Moment().format("DD/MM/YYYY hh:mm A")} <br/>
          Total Bal:${NairaSymbol}${returnComma(String(balance))}`;
                        SendEmail("Split payment", msg, currentUser);
                        const sPRef = Md5(String(Moment().format("DDMMYYYhhmmss")));
                        // save sender's transaction history
                        SaveTransactionHistory({
                          amount: String(requestData.amount),
                          beneficiary_account: String(currentUser.PhoneNumber),
                          beneficiary_bank_name: "AbaaPay Wallet",
                          customer_name: `${allBeneficiaries.length} beneficiaries`,
                          memo: `${requestData.group_name} (Split Payment)`,
                          PhoneNumber: String(currentUser.PhoneNumber),
                          token: "",
                          transaction_ref: txRef,
                          transaction_type: "debit",
                          status: "success",
                          split_payment_ref: sPRef
                        })
                        QueryDB(`INSERT INTO split_payment(sPRef,spAmount,spTitle, spNumberOfPaticipants,spDistributions,sPPhoneNumber) VALUES ('${sPRef}','${requestData.amount}','${requestData.group_name}','${requestData.beneficiaries}','${requestData.distribution}','${currentUser.PhoneNumber}')`);
                        // save to split payment table
                        allBeneficiaries.forEach((a) => {
                          setTimeout(() => {
                            const eachAmount = parseFloat(requestData.amount) / parseInt(allBeneficiaries.length);
                            if (a.exist) {
                              UpdateWalletBalance({
                                PhoneNumber: a.number
                              }, eachAmount, 'credit', txRef).then((bre) => {
                                // console.log("bre:",bre.data.balance);
                                const uBalance = bre.data.balance;
                                const sms1 = `Credit\nAmt: ${NairaSymbol}${returnComma(eachAmount)} \nAcc: ${MaskNumber(String(a.number))} \nDesc:${AppName} Split payment\nFrom: ${currentUser.FirstName} ${currentUser.LastName} (${currentUser.PhoneNumber})\nRefNo.: ${txRef} \nTime:${Moment().format("DD/MM/YYYY hh:mm A")}\nbalance: ${NairaSymbol}${returnComma(uBalance)}`;
                                SaveTransactionHistory({
                                  amount: String(eachAmount),
                                  beneficiary_account: String(a.number),
                                  beneficiary_bank_name: "AbaaPay Wallet",
                                  customer_name: `${a.name}`,
                                  memo: `Split Payment from ${currentUser.FirstName} ${currentUser.LastName}`,
                                  PhoneNumber: String(currentUser.PhoneNumber),
                                  token: "",
                                  transaction_ref: txRef,
                                  transaction_type: "credit",
                                  status: "success",
                                  split_payment_ref: sPRef
                                })
                                SendSMS(a.number, sms1);
                                SendEmail("Split payment", msg, {
                                  PhoneNumber: a.number,
                                  EmailAddress: a.email
                                });
                              })
                            } else {
                              // console.log("beneficiaries:",a)
                              //   // Save to base account
                              const refNo = String(Md5(String(Moment().format("DDMMYYYhhmmss"))).substring(0, 6)).toUpperCase();
                              QueryDB(`insert into BaseAccount (transactionFrom,transactionTo,refNo,transactionStatus,transactionAmount) values('${currentUser.PhoneNumber}','${a.number}','${refNo}','pending','${eachAmount}')`);
                              const usms = `You have a cash Pick Up of ${NairaSymbol}${returnComma(eachAmount)} \nFROM: ${currentUser.FirstName} ${currentUser.LastName} (${currentUser.PhoneNumber})\nRefNo: ${refNo} \nYou only need your mobile number for verification.`;
                              SendSMS(a.number, usms);
                            }
                          }, 500)
                        })
                        beneRes.data = {}
                        beneRes.message = beneRes.status ? `Split Payment was successful.` : `Split Payment was not successful.`
                        resolve(beneRes)
                      })
                    } else {
                      resolve({
                        status: false,
                        message: "Oops! something went wrong, try again later",
                        data: {}
                      })
                    }
                  })
                } else if (distribution == "manual") {
                  try {
                    let allBeneficiaries = JSON.parse(String(requestData.beneficiaries));
                    if (allBeneficiaries.length == 0) {
                      resolve({
                        status: false,
                        data: allBeneficiaries,
                        message: `Oops! no beneficiary found.`
                      })
                      return;
                    }
                    let currentUserNumberExist = allBeneficiaries.find((a) => String(a.number) == String(currentUser.PhoneNumber));
                    if (currentUserNumberExist == currentUser.PhoneNumber) {
                      resolve({
                        status: false,
                        data: currentUserNumberExist,
                        message: `Oops! your number cannot be included among beneficiaries.`
                      })
                      return;
                    }
                    var checkExit = [];
                    var allcheckValidNumber = [];

                    allBeneficiaries.forEach((a, i) => {
                      if (!allcheckValidNumber.includes(a.number)) {
                        allcheckValidNumber.push(a.number)
                      } else {
                        checkExit.push(a.number)
                      }
                    })
                    if (checkExit.length != 0) {
                      resolve({
                        status: false,
                        message: `Duplicate number found.`,
                        data: allcheckValidNumber
                      })
                      return;
                    }

                    QueryDB(`SELECT * FROM users WHERE PhoneNumber IN ('${allBeneficiaries.map((a,i)=>a.number).join("','")}')`).then((beneRes) => {
                      let Registeredusers = beneRes.data.map((a, i) => {
                        const u = allBeneficiaries.find((b, i) => b.number == a.PhoneNumber);
                        return {
                          exist: true,
                          number: a.PhoneNumber,
                          name: a.FirstName + " " + a.LastName,
                          amount: u.amount
                        }
                      })
                      let checkMerchant = beneRes.data.filter((a, i) => a.account_type == "merchant")
                      if (checkMerchant.length != 0) {
                        resolve({
                          status: false,
                          data: checkMerchant.map((a, i) => a.PhoneNumber),
                          message: `Merchant number cannot be added as beneficiary`
                        });
                        return;
                      }
                      let UnregisteredUsers = allBeneficiaries.filter((a, i) => Registeredusers.map((a, i) => a.PhoneNumber).indexOf(a.number) == -1).map((a, i) => {
                        a.exist = false;
                        a.name = "Unregistered user";
                        return a;
                      })
                      const txRef = String(Md5(Moment().toISOString()))
                      UpdateWalletBalance(currentUser, requestData.amount, 'debit', txRef).then((upResp) => {
                        const balance = upResp.data.balance;
                        // send debit sms to current user
                        const sms = `${AppName} Debit\nAmt: ${NairaSymbol}${returnComma(requestData.amount)} \nAcc: ${MaskNumber(String(currentUser.PhoneNumber))} \nDesc: Split payment\nBeneficiaries: ${Registeredusers.concat(UnregisteredUsers).length}\nRefNo.: ${txRef} \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(String(balance))}`;
                        SendSMS(currentUser.PhoneNumber, sms);
                        const msg = `${AppName} Debit<br/>
          Amt: ${NairaSymbol}${returnComma(requestData.amount)} <br/>
          Acc: ${MaskNumber(String(currentUser.PhoneNumber))} <br/>
          RefNo.: ${txRef} <br/>
          Desc: Split payment<br/>
          Beneficiaries: ${Registeredusers.concat(UnregisteredUsers).length} <br/>
          Time:${Moment().format("DD/MM/YYYY hh:mm A")} <br/>
          Total Bal:${NairaSymbol}${returnComma(String(balance))}`;
                        SendEmail("Split payment", msg, currentUser);
                        const sPRef = Md5(String(Moment().format("DDMMYYYhhmmss")));
                        // save sender's transaction history
                        SaveTransactionHistory({
                          amount: String(requestData.amount),
                          beneficiary_account: String(currentUser.PhoneNumber),
                          beneficiary_bank_name: "AbaaPay Wallet",
                          customer_name: `${Registeredusers.concat(UnregisteredUsers).length} beneficiaries`,
                          memo: `${requestData.group_name} (Split Payment)`,
                          PhoneNumber: String(currentUser.PhoneNumber),
                          token: "",
                          transaction_ref: txRef,
                          transaction_type: "debit",
                          status: "success",
                          split_payment_ref: sPRef
                        })
                        QueryDB(`INSERT INTO split_payment(sPRef,spAmount,spTitle, spNumberOfPaticipants,spDistributions,sPPhoneNumber) VALUES ('${sPRef}','${requestData.amount}','${requestData.group_name}','${JSON.stringify(Registeredusers.concat(UnregisteredUsers))}','${requestData.distribution}','${currentUser.PhoneNumber}')`);
                        UnregisteredUsers.forEach((a, i) => {
                          const refNo = String(Md5(a.PhoneNumber + String(Moment().format("DDMMYYYhhmmss"))).substring(0, 6)).toUpperCase();
                          QueryDB(`insert into BaseAccount (transactionFrom,transactionTo,refNo,transactionStatus,transactionAmount) values('${currentUser.PhoneNumber}','${a.number}','${refNo}','pending','${a.amount}')`);
                          const usms = `You have a cash Pick Up of ${NairaSymbol}${returnComma(a.amount)} \nFROM: ${currentUser.FirstName} ${currentUser.LastName} (${currentUser.PhoneNumber})\nRefNo: ${refNo} \nYou only need your mobile number for verification.`;
                          SendSMS(a.number, usms);
                        })
                        Registeredusers.forEach((a, i) => {
                          const utxRef = String(Md5(Moment().toISOString()))
                          console.log("PPPP:", a);
                          UpdateWalletBalance({
                            PhoneNumber: a.number
                          }, a.amount, 'credit', utxRef).then((be) => {
                            const uBalance = be.data.balance;
                            const sms1 = `Credit\nAmt: ${NairaSymbol}${returnComma(a.amount)} \nAcc: ${MaskNumber(String(a.number))} \nDesc:${AppName} Split payment\nFrom: ${currentUser.FirstName} ${currentUser.LastName} (${currentUser.PhoneNumber})\nRefNo.: ${txRef} \nTime:${Moment().format("DD/MM/YYYY hh:mm A")}\nbalance: ${NairaSymbol}${returnComma(uBalance)}`;
                            SendSMS(a.number, sms1);
                            SaveTransactionHistory({
                              amount: String(a.amount),
                              beneficiary_account: String(a.number),
                              beneficiary_bank_name: "AbaaPay Wallet",
                              customer_name: `${a.name}`,
                              memo: `Split Payment from ${currentUser.FirstName} ${currentUser.LastName}`,
                              PhoneNumber: String(a.number),
                              token: "",
                              transaction_ref: utxRef,
                              transaction_type: "credit",
                              status: "success",
                              split_payment_ref: sPRef
                            })
                          })
                        })
                        resolve({
                          status: true,
                          data: Registeredusers.concat(UnregisteredUsers),
                          message: `Split payment was successful.`
                        })
                      })
                    })

                  } catch (error) {
                    resolve({
                      status: false,
                      data: {},
                      message: `Oops! something went wrong.`
                    })
                  }
                } else {
                  resolve({
                    status: false,
                    data: {},
                    message: `Oops! invalid distribution.`
                  })
                }
              }
            }
          })
        })
      })
    })
  })
}
const SplitAccountHistory = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token"];
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          QueryDB(`SELECT * FROM split_payment WHERE sPPhoneNumber='${currentUser.PhoneNumber}'`).then((payRes) => {
            payRes.data = payRes.data.map((a, i) => {
              let numbers = a.spDistributions;
              if (a.spDistributions == "evenly") {
                numbers = String(a.spNumberOfPaticipants).split(",");
              } else {
                numbers = JSON.parse(a.spNumberOfPaticipants).map((a, i) => a.number);
              }
              return {
                group_name: a.spTitle,
                amount: a.spAmount,
                beneficiaries: numbers,
                distribution: a.spDistributions,
                date: a.spDate,
                ref: a.sPRef
              }
            })
            resolve(payRes);
          })
        })
      })
    })
  })
}
const GetSplitIndividualHistory = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token", "ref"];
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          QueryDB(`SELECT * FROM transactions INNER JOIN users ON transactions.beneficiary_account=users.PhoneNumber WHERE transactions.split_payment_ref='${requestData.ref}' order by transactions.transaction_id desc`).then((payRes) => {
            payRes.data = payRes.data.map((a, i) => {
              return {
                txtId: a.transaction_id,
                beneficiary: a.beneficiary_account,
                transaction_type: a.transaction_type,
                amount: a.amount,
                memo: a.memo,
                bank_name: a.beneficiary_bank_name,
                txtRef: a.transaction_ref,
                status: a.transaction_status,
                date: a.transaction_date,
                firstName: String(a.FirstName).replace("null", ""),
                lastName: String(a.LastName).replace("null", "")
              }
            })
            resolve(payRes);
          })
        })
      })
    })
  })
}
const PostSocialFeed = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token", "content", "title", "imageString"];

      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          let qry = `INSERT INTO social_feeds(sFcontent,sFtitle,sFImagePath,sFPhoneNumber) VALUES ('${requestData.content}','${requestData.title}','${requestData.imageString}','${currentUser.PhoneNumber}')`;
          QueryDB(qry).then((socialRes) => {
            if (socialRes.status) {
              socialRes.message = "Your post was successful.";
            } else {
              socialRes.message = "Oops! post was not successful.";
            }
            resolve(socialRes);
          })
        })
      })
    })
  })
}
const GetSocialFeed = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token"];
      if (requestData.limit != undefined) {
        checkList.push("limit");
      }
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          let qry = `select * from social_feeds left join users on social_feeds.sFPhoneNumber=users.PhoneNumber order by social_feeds.sFId desc limit ${requestData.limit != undefined?requestData.limit:"0,50"}`;
          QueryDB(qry).then((socialResP) => {
            socialResP.data = socialResP.data.map((a, i) => {
              let img = {
                id: null,
                url: null
              };
              try {
                img = JSON.parse(a.sFImagePath);
              } catch (error) {

              }
              return {
                id: a.sFId,
                content: a.sFcontent,
                title: a.sFtitle,
                date: a.sFDate,
                image: img,
                user: {
                  mobile: a.sFPhoneNumber,
                  name: a.FirstName + " " + a.LastName,
                  email: a.EmailAddress
                }
              }
            })
            resolve(socialResP);
          })
        })
      })
    })
  })
}
const GeneratePaymentLink = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token", "channel"];
      if(requestData.channel !== "bank")
      {
        checkList.push("amount")
      }
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          PaystackURL({
            email: currentUser.EmailAddress,
            amount: requestData.channel !== "bank"?requestData.amount:100,
            channel: requestData.channel
          }).then((res) => {
            if (res.status) {
              SaveTransactionHistory({
                amount: requestData.channel !== "bank"?String(requestData.amount):"100",
                beneficiary_account: String(currentUser.PhoneNumber),
                beneficiary_bank_name: "Wallet funding",
                customer_name: `${currentUser.FirstName} ${currentUser.LastName}`,
                memo: `Bank account verification via Paystack (channel : ${requestData.channel})`,
                PhoneNumber: String(currentUser.PhoneNumber),
                token: "",
                transaction_ref: res.data.reference,
                transaction_type: "credit",
                status: "pending"
              })
              res.data.url = res.data.authorization_url;
              if (res.data) {
                delete res.data.authorization_url;
                delete res.data.access_code;
                delete res.data.reference;
              }
              resolve(res)
            } else {
              resolve(res);
            }
          })
        })
      })
    })
  })
}

const GeneratePaymentLinkAccount = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token"];
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          const txRef = generateRandomNumber(30)
          PaystackURL({
            email: currentUser.EmailAddress,
            amount: 100,
            channel: "bank"
          }).then((res) => {
            if (res.status) {

              res.data.url = res.data.authorization_url;
              if (res.data) {
                delete res.data.authorization_url;
                delete res.data.access_code;
                delete res.data.reference;
              }
              SaveTransactionHistory({
                amount: String(100),
                beneficiary_account: String(currentUser.PhoneNumber),
                beneficiary_bank_name: "Wallet funding",
                customer_name: `${currentUser.FirstName} ${currentUser.LastName}`,
                memo: `Account linking / Wallet funding via Paystack`,
                PhoneNumber: String(currentUser.PhoneNumber),
                token: "",
                transaction_ref: res.data.reference,
                transaction_type: "credit",
                status: "pending"
              })
              resolve(res)
            } else {
              resolve(res);
            }
          })
        })
      })
    })
  })
}
const ConfirmPayment = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          message: `Oops try again next time.`,
          data: null
        });
        return;
      }
      const requestData = data.data;
      const checkList = ["token", "transactionRef"];
      if(requestData.account_number)
      {
        checkList.push("account_number");
      }
      CheckEmptyInput(requestData, checkList).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
          return;
        }
        CheckAccess(requestData.token).then((res) => {
          if (!res.status) {
            resolve(res)
            return;
          }
          const currentUser = res.data;
          PaystackTransactionConfirmation(requestData.transactionRef).then((res) => {
            if (res.status) {
              const paystackData = res.data;
              QueryDB(`select * from transactions where transaction_ref='${requestData.transactionRef}' limit 1`).then((rse) => {
                if (rse.status) {
                  const trx = rse.data[0];
                  if (trx.transaction_type == 'debit') {
                    resolve({
                      status:true,
                      message:`Oops! wrong transaction type.`,
                      data: {}
                    })
                  } else if (trx.transaction_status == 'pending') {
                    if (paystackData.authorization.channel == "bank" && String(trx.memo).includes("channel : bank")) {
                      QueryDB(`select * from bank where account_number='${requestData.account_number}' and bank_name='${paystackData.authorization.bank}' limit 1`).then((resp) => {
                        if (!resp.status) {
                          QueryDB(`INSERT INTO bank(phone_number, 
                            account_number,
                            bank_code,
                            bank_name,
                            txRef,
                            account_name,
                            meta_data,
                            is_active
                            ) VALUES ('${currentUser.PhoneNumber}',
                            '${requestData.account_number}',
                            '${paystackData.authorization.authorization_code}',
                            '${paystackData.authorization.bank}',
                            '${requestData.transactionRef}',
                            '${currentUser.FirstName} ${currentUser.LastName}',
                            '${JSON.stringify(paystackData)}','1')`);
                            QueryDB(`update transactions set transaction_status='${paystackData.status}',transaction_type='credit' where transaction_ref='${paystackData.reference}' limit 1`);
                            UpdateWalletBalance({
                              PhoneNumber: currentUser.PhoneNumber
                            }, trx.amount, "credit", paystackData.reference).then((bal) => {
                              if (bal.status) {
                                const sms = `Credit \nAmt:${NairaSymbol}${returnComma(trx.amount)} \nAcc:${MaskNumber(String(String(currentUser.PhoneNumber)))} \nDesc: wallet funding via Paystack \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(bal.data.balance)}`;
                                console.log(sms);
                                SendSMS(GetDefaultPhoneNumber(currentUser, String(currentUser.PhoneNumber)), sms);
                                // SendEmail
                                SendEmail(`${AppName} Credit alert`, sms, currentUser);
                              }
                            })
                            resolve({
                              status: true,
                              message: "Account linked successfully."
                            })
                          } else {
                          const accountData = resp.result[0];
                          if(accountData.is_active == "0")
                          {
                            QueryDB(`update bank set is_active="1" where phone_number='${currentUser.PhoneNumber}' and account_number='${requestData.account_number} limit 1`);
                          resolve({
                            status: true,
                            message: "Account linked successfully."
                          })
                        }else{
                          // do a refund to wallet
                          resolve({
                            status: false,
                            message: "Account already linked."
                          }) 
                        }
                        }
                      })
                    }else{
                      QueryDB(`update transactions set transaction_status='${paystackData.status}',transaction_type='credit' where transaction_ref='${paystackData.reference}' limit 1`);
                            UpdateWalletBalance({
                              PhoneNumber: currentUser.PhoneNumber
                            }, trx.amount, "credit", paystackData.reference).then((bal) => {
                              if (bal.status) {
                                const sms = `Credit \nAmt:${NairaSymbol}${returnComma(trx.amount)} \nAcc:${MaskNumber(String(String(currentUser.PhoneNumber)))} \nDesc: wallet funding via Paystack \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(bal.data.balance)}`;
                                console.log(sms);
                                SendSMS(GetDefaultPhoneNumber(currentUser, String(currentUser.PhoneNumber)), sms);
                                // SendEmail
                                SendEmail(`${AppName} Credit alert`, sms, currentUser);
                              }
                            })
                            resolve({
                              status: false,
                              message: "Transaction was successfully."
                            }) 
                    }
                  } else if (trx.transaction_status == 'success') {
                    resolve({
                      status: false,
                      message: `Transaction already confirmed.`,
                      data: {}
                    })
                  } else {
                    resolve({
                      status: false,
                      message: `Transaction ` + trx.transaction_status,
                      data: {}
                    })
                  }
                } else {
                  resolve({
                    status: false,
                    message: "Transaction not found."
                  });
                }
              })
            } else {
              resolve(res);
            }
          })
        })
      })
    })
  })
}
const LinkAccountMobile = (data) => {
  let params = data;
  return new Promise((resolve) => {
    CheckAccess(data.token).then((userData) => {

      if (userData.status) {
        const user = userData.data;
        const checklist = ["account_number", "bank_code", "bank_name"];
        delete params.token;
        if (params.platform !== undefined) {
          checklist.push("platform");
        }
        CheckEmptyInput(params, checklist).then((errorMessage) => {
          if (errorMessage) {
            resolve({
              status: false,
              message: String(errorMessage),
              data: null
            });
          } else {
            QueryDB(GetQueryString(["account_number"], {
              account_number: params.account_number
            }, 'select', 'bank', {
              account_number: params.account_number
            })).then((resp) => {
              if (resp.status) {
                resolve({
                  status: false,
                  message: "Account already linked.",
                  data: []
                })
                return;
              }
              PaystackChargeCard({
                account_number: params.account_number,
                bank_code: params.bank_code,
                EmailAddress: user.EmailAddress,
                amount: PaymentRefundableAmount
              }).then((res) => {
                resolve(res);
              })
            })
          }
        })
      } else {
        resolve(userData);
      }
    })
  })
}
const LinkAccountSubmitBirthday = (data) => {
  let params = data;
  return new Promise((resolve) => {
    // resolve(params)
    // return;
    const checklist = ["token", "birthday", "reference", "bank_code", "bank_name",
      "account_number",
      "account_name"
    ];
    if (params.platform !== undefined) {
      checklist.push("platform");
    }
    CheckEmptyInput(params, checklist).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: String(errorMessage),
          data: null
        });
      } else {
        CheckAccess(params.token).then((userData) => {
          delete params.token;
          if (userData.status) {
            const user = userData.data;
            PaystackSubmitBirthday({
              birthday: params.birthday,
              reference: params.reference
            }).then((res) => {
              resolve(res);
              return;
              if (res.status) {
                QueryDB(GetQueryString(["account_number"], {
                  account_number: params.account_number
                }, 'select', 'bank', {
                  account_number: params.account_number,
                  phone_number: String(user.PhoneNumber)
                })).then((resp) => {
                  if (resp.status) {
                    resolve({
                      status: false,
                      message: "Account already linked.",
                      data: []
                    })
                    return;
                  }
                  QueryDB(`insert into bank (phone_number,account_number,bank_code,bank_name,txRef) values ('${user.PhoneNumber}','${params.account_number}','${params.bank_code}','${params.bank_name}','${params.txRef}')`).then((res) => {
                    res.message = res.status ? "Bank details saved" : "Oops! Bank details not saved, try again later."
                    if (res.status) {
                      // const pr = {
                      //   amount:String(PaymentRefundableAmount),
                      //   phone_number:params.account_number,
                      //   txRef:params.txRef,
                      //   txStatus:"pending",
                      //   token
                      // }
                      GetWalletBalance(user.PhoneNumber).then((uBalance) => {
                        if (uBalance.status) {
                          const balance = parseFloat(uBalance.data.balance) + parseFloat(PaymentRefundableAmount);
                          QueryDB(`update wallets set balance='${balance}' where phone_number='${user.PhoneNumber}' limit 1`);
                        }
                      });
                      SaveTransactionHistory({
                        amount: String(PaymentRefundableAmount),
                        PhoneNumber: String(user.PhoneNumber),
                        transaction_ref: String(params.txRef),
                        customer_name: user.FirstName + " " + user.LastName,
                        token: "",
                        memo: `Card transaction`,
                        transaction_type: "credit",
                        beneficiary_account: String(user.PhoneNumber),
                        beneficiary_bank_name: "Paystack",
                        status: "success"
                      })
                    }
                    resolve(res);
                  })
                })
              } else {
                resolve(res);
              }
            })
          } else {
            resolve(userData);
          }
        })
      }
    })
  })
}
const LinkAccountSubmitOTP = (data) => {
  let params = data;
  return new Promise((resolve) => {
    // resolve(params)
    // return;
    const checklist = ["token", "otp", "reference", "bank_code", "bank_name", "account_number", "account_name"];
    if (params.platform !== undefined) {
      checklist.push("platform");
    }
    CheckEmptyInput(params, checklist).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: String(errorMessage),
          data: null
        });
      } else {
        CheckAccess(params.token).then((userData) => {
          delete params.token;
          if (userData.status) {
            const user = userData.data;
            PaystackSubmitOTP({
              otp: params.otp,
              reference: params.reference
            }).then((res) => {
              if (res.status && res.data.id != undefined) {
                // {
                //   "id": 2745838497,
                //   "domain": "test",
                //   "status": "success",
                //   "reference": "elhjsldtmf13kuc",
                //   "amount": 50,
                //   "message": "madePayment",
                //   "gateway_response": "Approved",
                //   "paid_at": "2023-04-24T00:50:33.000Z",
                //   "created_at": "2023-04-23T08:27:50.000Z",
                //   "channel": "bank",
                //   "currency": "NGN",
                //   "ip_address": "172.31.63.190",
                //   "metadata": "",
                //   "log": null,
                //   "fees": 1,
                //   "fees_split": null,
                //   "authorization": {
                //       "authorization_code": "AUTH_uf8adf06c8",
                //       "bin": "000XXX",
                //       "last4": "X000",
                //       "exp_month": "12",
                //       "exp_year": "9999",
                //       "channel": "bank",
                //       "card_type": "",
                //       "bank": "Zenith Bank",
                //       "country_code": "NG",
                //       "brand": "Zenith Emandate",
                //       "reusable": false,
                //       "signature": null,
                //       "account_name": null
                //   },
                //   "customer": {
                //       "id": 116021441,
                //       "first_name": "",
                //       "last_name": "",
                //       "email": "test2@aspacelife.com",
                //       "customer_code": "CUS_mwrx9bxfliv79ts",
                //       "phone": "",
                //       "metadata": null,
                //       "risk_action": "default",
                //       "international_format_phone": null
                //   },
                //   "plan": null,
                //   "split": {},
                //   "order_id": null,
                //   "paidAt": "2023-04-24T00:50:33.000Z",
                //   "createdAt": "2023-04-23T08:27:50.000Z",
                //   "requested_amount": 50,
                //   "pos_transaction_data": null,
                //   "source": null,
                //   "fees_breakdown": null,
                //   "transaction_date": "2023-04-23T08:27:50.000Z",
                //   "plan_object": {},
                //   "subaccount": {}
                // }
                QueryDB(`insert into bank (phone_number,account_number,bank_code,bank_name,txRef,meta_data) values ('${user.PhoneNumber}','${params.account_number}','${params.bank_code}','${params.bank_name}','${params.reference}','${JSON.stringify(res.data)}')`).then((res) => {
                  res.message = res.status ? "Bank details saved" : "Oops! Bank details not saved, try again later."
                  if (res.status) {
                    // const pr = {
                    //   amount:String(PaymentRefundableAmount),
                    //   phone_number:params.account_number,
                    //   txRef:params.txRef,
                    //   txStatus:"pending",
                    //   token
                    // }
                    GetWalletBalance(user.PhoneNumber).then((uBalance) => {
                      if (uBalance.status) {
                        const balance = parseFloat(uBalance.data.balance) + parseFloat(PaymentRefundableAmount);
                        QueryDB(`update wallets set balance='${balance}' where phone_number='${user.PhoneNumber}' limit 1`);
                      }
                    });
                    SaveTransactionHistory({
                      amount: String(PaymentRefundableAmount),
                      PhoneNumber: String(user.PhoneNumber),
                      transaction_ref: String(params.txRef),
                      customer_name: user.FirstName + " " + user.LastName,
                      token: "",
                      memo: `Account verification`,
                      transaction_type: "bank",
                      beneficiary_account: String(user.PhoneNumber),
                      beneficiary_bank_name: "Paystack",
                      status: "success"
                    })
                  }
                  resolve(res);
                })

              } else {
                resolve(res);
              }
            })
          } else {
            resolve(userData);
          }
        })
      }
    })
  })
}
const LinkAccountSubmitPIN = (data) => {
  let params = data;
  return new Promise((resolve) => {
    // resolve(params)
    // return;
    const checklist = ["token", "pin", "reference"];
    if (params.platform !== undefined) {
      checklist.push("platform");
    }
    CheckEmptyInput(params, checklist).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: String(errorMessage),
          data: null
        });
      } else {
        CheckAccess(params.token).then((userData) => {
          delete params.token;
          if (userData.status) {
            const user = userData.data;
            PaystackSubmitPIN({
              pin: params.pin,
              reference: params.reference
            }).then((res) => {
              // resolve(res);
              // return ;
              if (res.status) {
                QueryDB(GetQueryString(["account_number"], {
                  account_number: params.account_number
                }, 'select', 'bank', {
                  account_number: params.account_number,
                  phone_number: String(user.PhoneNumber)
                })).then((resp) => {
                  if (resp.status) {
                    resolve({
                      status: false,
                      message: "Account already linked.",
                      data: []
                    })
                    return;
                  }
                  QueryDB(`insert into bank (phone_number,account_number,bank_code,bank_name,txRef) values ('${user.PhoneNumber}','${params.account_number}','${params.bank_code}','${params.bank_name}','${params.txRef}')`).then((res) => {
                    res.message = res.status ? "Bank details saved" : "Oops! Bank details not saved, try again later."
                    if (res.status) {
                      // const pr = {
                      //   amount:String(PaymentRefundableAmount),
                      //   phone_number:params.account_number,
                      //   txRef:params.txRef,
                      //   txStatus:"pending",
                      //   token
                      // }
                      GetWalletBalance(user.PhoneNumber).then((uBalance) => {
                        if (uBalance.status) {
                          const balance = parseFloat(uBalance.data.balance) + parseFloat(PaymentRefundableAmount);
                          QueryDB(`update wallets set balance='${balance}' where phone_number='${user.PhoneNumber}' limit 1`);
                        }
                      });
                      SaveTransactionHistory({
                        amount: String(PaymentRefundableAmount),
                        PhoneNumber: String(user.PhoneNumber),
                        transaction_ref: String(params.txRef),
                        customer_name: user.FirstName + " " + user.LastName,
                        token: "",
                        memo: `Card transaction`,
                        transaction_type: "credit",
                        beneficiary_account: String(user.PhoneNumber),
                        beneficiary_bank_name: "Paystack",
                        status: "success"
                      })
                    }
                    resolve(res);
                  })
                })
              } else {
                resolve(res);
              }
            })
          } else {
            resolve(userData);
          }
        })
      }
    })
  })
}
const GetExistingContacts = (data) => {
  let params = data;
  return new Promise((resolve) => {
    const checklist = ["token", "contacts"];
    if (params.platform !== undefined) {
      checklist.push("platform");
    }
    CheckEmptyInput(params, checklist).then((errorMessage) => {
      if (errorMessage) {
        resolve({
          status: false,
          message: String(errorMessage),
          data: null
        });
      } else {
        CheckAccess(params.token).then((userData) => {
          if (userData.status) {
            const user = userData.data;
            if (params.contacts.includes(",")) {
              QueryDB(`select * from users where PhoneNumber IN ('${params.contacts.replace(/[,]/g,"','")}')`).then((resp) => {
                if (resp.status) {
                  resp.data = resp.data.map((a, i) => {
                    return {
                      name: a.FirstName + " " + a.LastName,
                      email: a.EmailAddress,
                      avatar: a.Avatar,
                      mobile: a.PhoneNumber,
                      date: a.CreatedAt
                    }
                  })
                }
                resolve(resp);
              })
            } else {
              resolve({
                status: false,
                message: `Oops! wrong data supplied.`,
                data: {}
              })
            }
          } else {
            resolve(userData);
          }
        })
      }
    })
  })
}
const FingerPrintLogin = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const Logindata = data.data;
      CheckEmptyInput(Logindata, ["data", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
          CheckAccess(Logindata.token).then((res) => {
            if (!res.status) {
              resolve(res);
              return;
            }
            // encrypt password
            const fData = EnCrypPassword(Logindata.data);
            QueryDB(`select * from users where PhoneNumber='${res.data.PhoneNumber}' limit 1`).then((result) => {
              if (result.status) {
                let user = result.data[0];
                if (String(user.biometricEnabled) !== "1") {
                  resolve({
                    status: false,
                    message: "Oops! Biometric not enabled.",
                    data: {}
                  })
                  return;
                }
                if (user.fingerPrintData !== fData) {
                  resolve({
                    status: false,
                    message: "Oops! Invalid login credentails.",
                    data: {
                      d: user.fingerPrintData,
                      fData: fData
                    }
                  })
                  return;
                }
                delete user.Password;
                delete user.fingerPrintData;
                user.ussd_code = "*345*10#";
                user.AccessToken = Md5(Moment().toISOString() + Logindata.PhoneNumber);
                result.data = user;
                result.data.PaystackPublicKey = PaystackPublickey;
                result.message = "Login successful.";
                result.data.privacyUrl = process.env.privacyUrl;
                result.data.termsUrl = process.env.termsUrl;
                result.data.CloudinaryUpload_preset = process.env.CloudinaryUpload_preset; 
                result.data.CloudinaryFolder = process.env.CloudinaryFolder; 
                result.data.CloudinaryCloud_name = process.env.CloudinaryCloud_name; 
                result.data.enableLoginPIN =  String(result.data.enableLoginPIN) == "1";
                // update AccessToken
                QueryDB(GetQueryString(["AccessToken"], {
                  AccessToken: user.AccessToken
                }, 'update', 'users', {
                  PhoneNumber: data.data.PhoneNumber
                }));
                // send email
                SendEmail(`${AppName} LOG IN CONFIRMATION`, ``, user);
                createFolder(`public/fld-${user.PhoneNumber}/images`);
                createFolder(`public/fld-${user.PhoneNumber}/documents`);
              } else {
                result.message = "Oops! Invalid login credentails.";
              }
              if (result.status && result.data.account_type == "merchant") {
                const qr = `select * from merchant_profile where PhoneNumber='${result.data.PhoneNumber}' limit 1`;
                QueryDB(qr).then((res) => {
                  if (res.status) {
                    const merchantData = res.data[0];
                    result.data = Object.assign(result.data, {
                      cac_number: merchantData.cac_number,
                      company_name: merchantData.company_name,
                      company_address: merchantData.company_address,
                      registration_date: merchantData.registration_date,
                      merchantId: merchantData.merchantId
                    })
                  }
                  resolve(result);
                })
              } else {
                resolve(result);
              }
            })
          })
        }
      })
    })
  });
}
const FingerPrintEnrol = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const fingerPrintdata = data.data;
      CheckEmptyInput(fingerPrintdata, ["data", "status_update", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
          CheckAccess(fingerPrintdata.token).then((res) => {
            if (!res.status) {
              resolve(res);
              return;
            }
            // encrypt password
            const fData = EnCrypPassword(String(fingerPrintdata.data));
            QueryDB(`update users set fingerPrintData='${fData}', biometricEnabled='${fingerPrintdata.status_update}' where PhoneNumber='${res.data.PhoneNumber}' limit 1`).then((result) => {
              result.message = result.status ? `Finger print data saved` : `Oops! data not saved, try again later.`;
              result.data = {};
              resolve(result);
            })
          })
        }
      })
    })
  });
}

const RemoveLinkedAccount = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const linkeddata = data.data;
      CheckEmptyInput(linkeddata, ["id", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
          CheckAccess(linkeddata.token).then((res) => {
            if (!res.status) {
              resolve(res);
              return;
            }
            // encrypt password
            QueryDB(`select * from bank where id='${linkeddata.id}' and phone_number='${res.data.PhoneNumber}' limit 1`).then((result) => {
              if (!result.status) {
                resolve({
                  status: false,
                  message: `Oops! account does not exist.`,
                  data: {}
                });
              } else {
                const bankData = result.data[0];
                if (String(bankData.is_active) !== "1") {
                  resolve({
                    status: false,
                    message: `Oops! account does not exist.`,
                    data: {}
                  });
                  return;
                }
                QueryDB(`update bank set is_active='0' where id='${linkeddata.id}' and phone_number='${res.data.PhoneNumber}' limit 1`).then((result) => {
                  result.message = result.status ? `Account has been removed successfully.` : `Oops! Account not removed, try aging later.`;
                  resolve(result);
                })
              }
            })
          })
        }
      })
    })
  });
}
const ProfileImageUpload = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const UploadData = data.data;
      CheckEmptyInput(UploadData, ["image_url", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
          CheckAccess(UploadData.token).then((res) => {
            if (!res.status) {
              resolve(res);
              return;
            }
        QueryDB(`update users set Avatar='${UploadData.image_url}' where phoneNumber='${res.data.PhoneNumber}' limit 1`).then((result) => {
                  if (!result.status) {
                    resolve({
                      status: false,
                      message: `Oops! account does not exist.`,
                      data: {}
                    });
                  } else {
                    // send email
                    result.message = `Profile image uploaded successfully.`;
                    resolve(result);
                  }
                })
          })
        }
      })
    })
  });
}

const UserVerifyCash = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["referenceNumber", "token", "transactionPIN"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token, params.transactionPIN).then((response) => {
            if (response.status) {
              const currentUser = response.data;
              // verify reference number
              QueryDB(`select * from BaseAccount where refNo='${params.referenceNumber}' and (transactionFrom='${currentUser.PhoneNumber}' or transactionTo='${currentUser.PhoneNumber}' ) limit 1`).then((res) => {
                if (res.status) {
                  const responseData = res.data[0];
                  if (String(responseData.transactionRef) !== "null") {
                    resolve({
                      status: false,
                      message: `Oops! Funds already cashout from the system.`,
                      data: {}
                    });
                    return;
                  }
                  if (responseData.transactionStatus == 'pending') {
                    resolve({
                      status: true,
                      data: responseData,
                      message: "Amount ready for cash out."
                    });
                  } else {
                    resolve({
                      status: false,
                      message: `Oops! Funds already cashout from the system.`,
                      dataData
                    });
                  }
                } else {
                  resolve({
                    status: false,
                    message: `Oops! Funds not found.`,
                    data: {}
                  });
                }
              })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const SendSMSToSeller = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["mobile", "token", "email","message"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token, params.transactionPIN).then((response) => {
            if (response.status) {
              const currentUser = response.data;
              GetWalletBalance(currentUser.PhoneNumber).then((re) => {
                if (!re.status) {
                  re.message = "Oops! account does not exist.";
                  re.data = {};
                  resolve(re)
                } else {
                  let WalletData = re.data;
                  let amount = 100;
                  if (parseFloat(WalletData.balance) < amount) {
                    resolve({
                      status: false,
                      message: `Insufficient balance (NGN${WalletData.balance})`,
                      data: {
                        balance: WalletData.balance
                      }
                    });
                  } else {
             const txRef = generateRandomNumber(15)
             SendSMS(params.mobile,params.mobile);
             UpdateWalletBalance({
              PhoneNumber: currentUser.PhoneNumber
             }, amount, "debit",txRef).then((bal) => {
              if (bal.status) {
                const sms = `Debit \nAmt:${NairaSymbol}${returnComma(amount)} \nAcc:${MaskNumber(String(String(currentUser.PhoneNumber)))} \nDesc: SMS to Seller \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(bal.data.balance)}`;
                SendSMS(GetDefaultPhoneNumber(currentUser, String(currentUser.PhoneNumber)), sms);
                SendEmail(`${AppName} Debit alert`, sms, currentUser);
              }
            })
            SaveTransactionHistory({
              amount: String(amount),
              PhoneNumber: String(currentUser.PhoneNumber),
              transaction_ref: String(txRef),
              customer_name: currentUser.FirstName + " " + currentUser.LastName,
              token: "",
              memo: `Sms charges`,
              transaction_type: "debit",
              beneficiary_account: String(currentUser.PhoneNumber),
              beneficiary_bank_name: "AbaaChatPay Wallet",
              status: "success"
            })
            //  SendEmail(params.mobile,``);
            resolve({
              status:true,
              message:"Message sent to seller",
              data:{}
            })
            }
              }
            })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const ChargerADVERTS = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["id", "token", "days"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token, params.transactionPIN).then((response) => {
            if (response.status) {
              const currentUser = response.data;
              QueryDB(`select from Ads where adsId='${params.id}' limit 1`).then((res)=>{
              if(res.status)
              {
                GetWalletBalance(currentUser.PhoneNumber).then((re) => {
                if (!re.status) {
                  re.message = "Oops! account does not exist.";
                  re.data = {};
                  resolve(re)
                } else {
                  let WalletData = re.data;
                  let amount = 100;
                  if (parseFloat(WalletData.balance) < amount) {
                    resolve({
                      status: false,
                      message: `Insufficient balance (NGN${WalletData.balance})`,
                      data: {
                        balance: WalletData.balance
                      }
                    });
                  } else {
             const txRef = generateRandomNumber(15)
             SendSMS(params.mobile,params.mobile);
             UpdateWalletBalance({
              PhoneNumber: currentUser.PhoneNumber
             }, amount, "debit",txRef).then((bal) => {
              if (bal.status) {
                const sms = `Debit \nAmt:${NairaSymbol}${returnComma(amount)} \nAcc:${MaskNumber(String(String(currentUser.PhoneNumber)))} \nDesc: SMS to Seller \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(bal.data.balance)}`;
                SendSMS(GetDefaultPhoneNumber(currentUser, String(currentUser.PhoneNumber)), sms);
                SendEmail(`${AppName} Debit alert`, sms, currentUser);
              }
            })
            SaveTransactionHistory({
              amount: String(amount),
              PhoneNumber: String(currentUser.PhoneNumber),
              transaction_ref: String(txRef),
              customer_name: currentUser.FirstName + " " + currentUser.LastName,
              token: "",
              memo: `Sms charges`,
              transaction_type: "debit",
              beneficiary_account: String(currentUser.PhoneNumber),
              beneficiary_bank_name: "AbaaChatPay Wallet",
              status: "success"
            })
            //  SendEmail(params.mobile,``);
            resolve({
              status:true,
              message:"Message sent to seller",
              data:{}
            })
            }
              }
              })
              }else{
                resolve({
                  status:false,
                  message:"The ADS you are tyring to access does not exist",
                  data:{}
                })
              }
              })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const SendPushNotification = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["email", "message","token"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token).then((response) => {
            if (response.status) {
              const currentUser = response.data;
              QueryDB(`select * from users where EmailAddress='${params.email}' limit 1`).then((res)=>{
                if(res.status)
              {
                const recipientData = res.data[0];
                // PushToken
                if(recipientData.PushToken != null)
                {
                  // send push
                  SendPush({
                    to:recipientData.PushToken,
                    data:{
                    title:"new chat message from",
                    body:"dkdlld"
                    }
                  }).then((res)=>{
                    resolve(res)
                  })
                  return ;
                }
                resolve({

                })
              }else{
                resolve(res)
              }
              })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}
const CreateAdvert = (data) => {
  return new Promise((resolve) => {
    AntiHacking(data).then((result) => {
      const checklist = ["title", "category","plan","phoneNumber","email","planName","duration","price","bussines_address","desc","bussines_address","token"];
      CheckEmptyInput(result.data, checklist).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            message: String(errorMessage),
            data: {}
          });
        } else {
          const params = result.data;
          CheckAccess(params.token).then((response) => {
            if (response.status) {
             const currentUser = response.data;
             GetWalletBalance(currentUser.PhoneNumber).then((res)=>{
              if(parseFloat(params.plan) > parseFloat(res.data.balance))
              {
                resolve({
                  ...res,
                  status:false,
                  message:`Insufficient wallet balance - (Balance: NGN${returnComma(res.data.balance)})`
                })
              }else{
              // post ads , send sms
              const txRef = generateRandomNumber(15)
              UpdateWalletBalance({
                PhoneNumber: currentUser.PhoneNumber
               }, params.plan, "debit",txRef).then((bal) => {
                if (bal.status) {
                  const sms = `Debit \nAmt:${NairaSymbol}${returnComma(params.plan)} \nAcc:${MaskNumber(String(String(currentUser.PhoneNumber)))} \nDesc: Ads Post \nTime:${Moment().format("DD/MM/YYYY hh:mm A")} \nTotal Bal:${NairaSymbol}${returnComma(bal.data.balance)}`;
                  SendSMS(GetDefaultPhoneNumber(currentUser, String(currentUser.PhoneNumber)), sms);
                  SendEmail(`${AppName} Debit alert`, sms, currentUser);
              SaveTransactionHistory({
                amount: String(params.plan),
                PhoneNumber: String(currentUser.PhoneNumber),
                transaction_ref: String(txRef),
                customer_name: currentUser.FirstName + " " + currentUser.LastName,
                token: "",
                memo: `Advert Post`,
                transaction_type: "debit",
                beneficiary_account: String(currentUser.PhoneNumber),
                beneficiary_bank_name: "AbaaChatPay Wallet",
                status: "success"
              })
              bal.message = "Your advert submitted successfully."
            }
              resolve(bal)
              })
              }
             })
            } else {
              resolve(response)
            }
          })
        }
      })
    })
  })
}

const LoginWithPIN = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const Logindata = data.data;
      CheckEmptyInput(Logindata, ["pin", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
        CheckAccess(Logindata.token).then((response) => {
          
          if (response.status) {
          const currentUser = response.data;
          const pin = EnCrypPassword(String(Logindata.pin).replace("null",""));
          QueryDB(`select * from users where loginPIN='${pin}' and PhoneNumber='${currentUser.PhoneNumber}' limit 1`).then((result)=>{
            if (result.status) {
              const AccessToken = {AccessToken:sha512(Moment().toISOString() + currentUser.PhoneNumber)};
              result.data = AccessToken;
              result.message = "Login successful.";
              // send email
              // update accessToken
              const x = `update users set AccessToken='${AccessToken.AccessToken}' where PhoneNumber='${currentUser.PhoneNumber}' limit 1 `;
              QueryDB(x)
            } else {
              result.message = "Oops! Invalid PIN.";
              result.data = {}
            }
            resolve(result);
          })
        }else{
          resolve(response)
        }
        })
        }
      })
    })
  });
}

const LoginWithPINSetUp = (params) => {
  return new Promise((resolve) => {
    AntiHacking(params).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const Logindata = data.data;
      CheckEmptyInput(Logindata, ["pin", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
        CheckAccess(Logindata.token).then((response) => {
        if (response.status) {
          const currentUser = response.data;
          const pin = EnCrypPassword(String(Logindata.pin));
          QueryDB(`update users set loginPIN='${pin}',enableLoginPIN='1' where PhoneNumber='${currentUser.PhoneNumber}' `).then((result)=>{
            if (result.status) {
              result.message = "Access PIN setup successfully.";
              // send email
              // update accessToken
            } else {
              result.message = "Oops! Access PIN setup was not successful.";
              result.data = {}
            }
            resolve(result);
          })
        }else{
          resolve(response)
        }
        })
        }
      })
    })
  });
}

const LoginWithPINToggle = (d) => {
  return new Promise((resolve) => {
    AntiHacking(d).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const params = data.data;
      CheckEmptyInput(params, ["status", "token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
        CheckAccess(params.token).then((response) => {
        if (response.status) {
          const currentUser = response.data;
          QueryDB(`update users set enableLoginPIN='${params.status?"1":"0"}' where PhoneNumber='${currentUser.PhoneNumber}' `).then((result)=>{
            if (result.status) {
              result.message = `Access PIN ${params.status?"enabled":"disabled"}.`;
              // send email
              // update accessToken
            } else {
              result.message = "Oops! something went wrong, try again later.";
              result.data = {}
            }
            resolve(result);
          })
        }else{
          resolve(response)
        }
        })
        }
      })
    })
  });
}
const GetSubscriptionPlans = (d)=>{
  return new Promise((resolve) => {
    AntiHacking(d).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const params = data.data;
      CheckEmptyInput(params, ["token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
        CheckAccess(params.token).then((response) => {
        if (response.status) {
          const currentUser = response.data;
          QueryDB(`select * from subscriptionPlans order by sbID asc`).then((result)=>{
            result.data = result.data.map((a,i)=>{
             const color = ["#6ecbff","#6effb3"];
              return {
                id:a.sbID,
                value:a.sbAmount,
                desc:a.sbDescription,
                name:a.sbName,
                duration:a.sbDuration,
                initialValue:a.sbInitialValue,
                date:a.sbDate,
                color:color[i]
              };
            })
            resolve(result);
          })
        }else{
          resolve(response)
        }
        })
        }
      })
    })
  }); 
}
const NINVerificationImage= (d)=>{
  return new Promise((resolve) => {
    AntiHacking(d).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const params = data.data;
      CheckEmptyInput(params, ["faceImage","nin"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
        NINImageVerification({
          nin:params.nin,
          faceImage:params.faceImage
        }).then((res)=>{
        resolve(res)
        })
        }
      })
    })
  }); 
}

const PINReset= (d)=>{
  return new Promise((resolve) => {
    AntiHacking(d).then((data) => {
      if (data.error) {
        resolve({
          status: false,
          data: {},
          message: 'Oops! try again next time.'
        })
        return;
      }
      const params = data.data;
      CheckEmptyInput(params, ["token"]).then((errorMessage) => {
        if (errorMessage) {
          resolve({
            status: false,
            data: {},
            message: errorMessage.toString()
          })
        } else {
       CheckAccess(params.token).then((response) => {
       if (response.status) {
       const currentUser = response.data;
        //  QueryDB(`update users set from subscriptionPlans order by sbID asc`).then((result)=>{
       const randFourDigit = generateRandomNumber(4);
       const pin = EnCrypPassword(randFourDigit);
       resolve(pin)
        // })
            }else{
              resolve(response)      
            }
          })
        }
      })
    })
  }); 
}
module.exports = {
  UserLogin,
  Registration,
  Dashboard,
  WalletFunding,
  GetWalletBalance,
  Transfer,
  NinVerification,
  GetTransactionHistory,
  SendToken,
  TokenVerification,
  LinkAccount,
  AccountVerification,
  GetUserDetails,
  ListBanks,
  BankAccounts,
  DeleteBankAccount,
  Withdrawal,
  ChangePassword,
  ChangeTransactionPIN,
  EmailNotification,
  SMSNotification,
  AccountUpgrade,
  AccountTypes,
  UserSettings,
  SecondaryNumber,
  createFolder,
  ToggleSettings,
  RemoveSecondaryNumber,
  CACVerification,
  GetAllUploads,
  DeleteUploads,
  ActivateBankAccounts,
  SecondaryNumberVerification,
  DataPurchase,
  GetDataHistory,
  GetListElectricityProvider,
  GetListDataBundles,
  GetAirtimeProviders,
  NumberMeterValidation,
  PurchaseAirtime,
  GetAirtimeHistory,
  ElectricityPurchase,
  USSD,
  ForgotPassword,
  UpdateToken,
  NonAuthGetUserDetails,
  PickUpCash,
  NewPassword,
  CreateSplitAccount,
  SplitAccountHistory,
  GetSplitIndividualHistory,
  PostSocialFeed,
  GetSocialFeed,
  GeneratePaymentLink,
  ConfirmPayment,
  LinkAccountSubmitBirthday,
  LinkAccountSubmitOTP,
  LinkAccountSubmitPIN,
  FingerPrintLogin,
  FingerPrintEnrol,
  RemoveLinkedAccount,
  ProfileImageUpload,
  UserVerifyCash,
  GeneratePaymentLinkAccount,
  SendSMSToSeller,
  ChargerADVERTS,
  SendPushNotification,
  CreateAdvert,
  LoginWithPIN,
  LoginWithPINSetUp,
  LoginWithPINToggle,
  GetSubscriptionPlans,
  NINVerificationImage,
  PINReset,
  // merchant
  GetMerchantDetails,
  MerchantVerifyCash,
  MerchantAcceptCash,
  MerchantRegistration,
  TransferToMerchant,
  LinkAccountMobile,
  GetExistingContacts,
  // admin
  AdminTransactions,
  UpdateWalletBalance
};