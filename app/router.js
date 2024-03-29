module.exports = (app)=>{
// regular account routes
require("./routes/regular/login")(app);
require("./routes/regular/registration")(app);
require("./routes/regular/dashboard")(app);
require("./routes/regular/fund-wallet")(app);
require("./routes/regular/transfer")(app);
require("./routes/regular/transaction_history")(app);
require("./routes/regular/send_token")(app);
require("./routes/regular/token_verification")(app);
require("./routes/regular/account_verification")(app);
require("./routes/regular/listofbanks")(app);
require("./routes/regular/linkaccount")(app);
require("./routes/regular/bank_accounts")(app);
require("./routes/regular/delete_bank_account")(app);
require("./routes/regular/userdetails")(app);
require("./routes/regular/withdrawal")(app);
require("./routes/regular/change_password")(app);
require("./routes/regular/change_transaction_pin")(app);
require("./routes/regular/email_notification")(app);
require("./routes/regular/sms_notification")(app);
require("./routes/regular/account_rules")(app);
require("./routes/regular/settings")(app);
require("./routes/regular/add_new_phonenumber")(app);
require("./routes/regular/toggle_setting")(app);
require("./routes/regular/remove_number")(app);
require("./routes/regular/account_activation")(app);
require("./routes/regular/check_secondary_number")(app);
require("./routes/regular/data_purchase")(app);
require("./routes/regular/data_history")(app);
require("./routes/regular/get_electricity_provider")(app);
require("./routes/regular/get_data_plans")(app);
require("./routes/regular/airtime_providers")(app);
require("./routes/regular/airtime_purchase")(app);
require("./routes/regular/airtime_history")(app);
require("./routes/regular/purchase_electricity")(app);
require("./routes/regular/forgot_pasword")(app);
require("./includes/ussd")(app);
require("./routes/regular/pickup_cash")(app);
require("./routes/regular/new_password")(app);
require("./routes/regular/create_split_account")(app);
require("./routes/regular/split_account_history")(app);
require("./routes/regular/get_split_payment")(app);
require("./routes/regular/post_feeds")(app);
require("./routes/regular/get_post_feeds")(app);
require("./routes/regular/generate_url")(app);
require("./routes/regular/confirm_payment")(app);
require("./routes/regular/paystack_submit_birthday")(app);
require("./routes/regular/paystack_submit_otp")(app);
require("./routes/regular/paystack_submit_pin")(app);
require("./routes/regular/number_validation")(app);
require("./routes/regular/users_exist")(app);
require("./routes/regular/finger_print_enrolment")(app);
require("./routes/regular/finger_print_login")(app);
require("./routes/regular/remove_linked_account")(app);
require("./routes/regular/profile_image_upload")(app);
require("./routes/regular/user_verify_cash_pickup")(app);
require("./routes/regular/link_account_payment_url")(app);
require("./routes/regular/send_msg_to_seller")(app);
require("./routes/regular/send_push_msg")(app);
require("./routes/regular/create_advert")(app);
require("./routes/regular/login_with_pin")(app);
require("./routes/regular/login_with_pin_setup")(app);
require("./routes/regular/login_with_pin_toggle")(app);
require("./routes/regular/getplans")(app);
require("./routes/regular/nin_verification_image")(app);
require("./routes/regular/login_with_pin_reset")(app);
require("./routes/regular/users")(app);
require("./routes/regular/force_update")(app);
require("./routes/regular/social_feed_assets")(app);
// merchant account routes
require("./routes/merchant/account_upgrade")(app);
require("./routes/merchant/cac_verification")(app);
require("./routes/merchant/get_uploads")(app);
require("./routes/merchant/get_merchant_details")(app);
require("./routes/merchant/verify_cash")(app);
require("./routes/merchant/payout_cash")(app);
require("./routes/merchant/merchant_registration")(app);
require("./routes/merchant/transfer")(app);

// admin
require("./routes/admin/delete_upload")(app);
require("./routes/admin/transactions")(app);
require("./routes/regular/test")(app);
// aspacelife website api
require("./routes/website/job-application")(app);
require("./routes/website/contact_us")(app);
// base route
require("./routes/regular/baseroute")(app);


}