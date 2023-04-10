require('dotenv').config();
const {
    NODE_ENV,
    npm_package_version,
    DB_database,
    DB_host,
    DB_password,
    DB_user,
    DB_port,
    SMS_Services_url,
    SMS_Services_apikey,
    NinNumberSize,
    MobileNumberSize,
    SMSVersion,
    TransactionPINSize,
    SMSSendId,
    VerificationPINSize,
    TokenExpiry,
    Paystack_Test_publicKey,
    Paystack_Test_secretKey,
    APPNAME,
    AFRICATLK_USERNAME,
    AFRICATLK_APIKEY,
    RefundableChargeAmount,
    Customer_Service_Email,
    Customer_Service_PhoneNumber,
    Default_Email,
    Default_Email_password,
    Mailserver_host,
    Mailserver_port,
    Document_upload_limit,
    Flutterwave_Test_publicKey,
    Flutterwave_Test_secretKey,
    AIRTIME_NG_APIKey,
    AIRTIME_NG_APITOKEN,
    Reloadly_Secret,
    Reloadly_ClientID,
    BillPayment_Provider,
    SMSTimeOut,
    JWTSecret,
    AFRICATLK_BaseURL,
    AFRICATLK_BaseURL_SANDBOX,
    AFRICATLK_APIKEY_SANDBOX,
    AFRICATLK_USERNAME_SANDBOX,
    Default_SMS,
    DB_userDEV,
    DB_passwordDEV,
    DB_databaseDEV,
    DB_hostDEV,
    DB_portDEV,
    Twilio_account_id,
    Twilio_token,
    MIMUMTransferAmount
} = process.env;
const isLive = NODE_ENV == "production";
const version = `v1.0`;
const DatabaseName = isLive?DB_database:DB_databaseDEV;
const DatabaseHost = isLive?DB_host:DB_hostDEV;
const DatabasePassword = isLive?DB_password:DB_passwordDEV;
const DatabaseUser = isLive?DB_user:DB_userDEV;
const DatabasePort = isLive?DB_port:DB_portDEV;
const SMSBaseUrl = SMS_Services_url;
const SMSApiKey = SMS_Services_apikey;
const NINNumberSize = NinNumberSize;
const PhoneNumberSize = MobileNumberSize;
const SMSFolder = SMSVersion;
const TxnPINSize = TransactionPINSize;
const SenderID = SMSSendId;
const DefaultSMS = Default_SMS;
const VerifiedPINSize = VerificationPINSize;
const TokenValidity = TokenExpiry;
const PaystackPublickey = Paystack_Test_publicKey;
const PaystackSecretKey = Paystack_Test_secretKey;
const AppName = APPNAME;
const AFRICATALKING_USERNAME = AFRICATLK_USERNAME;
const AFRICATALKING_APIKEY = AFRICATLK_APIKEY;
const AFRICATALKING_USERNAME_SANDBX = AFRICATLK_USERNAME_SANDBOX;
const AFRICATALKING_APIKEY_SANDBX = AFRICATLK_APIKEY_SANDBOX;
const PaymentRefundableAmount = RefundableChargeAmount;
const CustomerServiceEmail = Customer_Service_Email;
const CustomerServicePhoneNumber = Customer_Service_PhoneNumber;
const DefaultEmail = Default_Email;
const DefaultEmailpassword = Default_Email_password;
const MailServerHost = Mailserver_host;
const MailServerPort = Mailserver_port;
const DocumentUploadLimit = Document_upload_limit;
const NairaSymbol = "NGN";
const FlutterWaveTestSecret = Flutterwave_Test_secretKey;
const FlutterWaveTestPublic = Flutterwave_Test_publicKey;
const AIRTIMENG_APIKey = AIRTIME_NG_APIKey;
const AIRTIMENG_APIToken = AIRTIME_NG_APITOKEN;
const ReloadlySecret = Reloadly_Secret;
const ReloadlyClientID = Reloadly_ClientID;
const BillPaymentProvider = BillPayment_Provider;
const SMS_TimeOut = SMSTimeOut;
const jwtSecret = JWTSecret;
const AFRICATALKING_BASEURL = isLive?AFRICATLK_BaseURL:AFRICATLK_BaseURL_SANDBOX;
const TwilioAccID = Twilio_account_id;
const TwilioToken = Twilio_token;
const MIMUM_TransferAmount = MIMUMTransferAmount;
module.exports = {
version,
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
SMS_TimeOut,
TwilioAccID,
TwilioToken,
MIMUM_TransferAmount,
isLive
}











  