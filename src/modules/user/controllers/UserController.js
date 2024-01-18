import bcrypt from "bcrypt";
import models from "../../../setup/models";
import * as Api from "../../../setup/ApiResponse";
import * as ayraFCM from "../../../setup/FirebaseHelper"; //setup/FirebaseHelper
const stripe = require('stripe')("sk_test_51KwNfXSD7GTrOcxgcByxv0I7HxIAXMw2xHQ3xZY31TKsUk0lkIrJ5WASE1oVFJLS3xH3FAAylRUxUyuS2NBSrbJg00Ua2xZLe2");

// ---- otpSendSystem ---- //
const accountSid = "ACa0774e852f6ea56f2426a8790b050825";
const authToken = "d7c1d74940ba330282157969be1a14be";

const client = require('twilio')(accountSid, authToken);

const SendOtp = require("sendotp");
const sendOtp = new SendOtp("332533AhDBihu7o608ce1a0P1");
import serverConfig from "../../../config/server.json";
import { parse } from "dotenv";
import { AwsInstance } from "twilio/lib/rest/accounts/v1/credential/aws";
import Driver from "../../../migrations/1-driver";
const {
  userLoginSchema,
  userRegisterSchema,
  userUserNemeSchema,
  userUpdatePasswordSchema,
  usersendUserOTPSchema,
  userPasswordResetSchema,
  userProductListSchema,
  userProductSearchListSchema,
  userAddToCartSchema,
  userGetToCartSchema,
  userSearchSchema,
  userRequestItemAcceptedschema,
  getStoreCategoriesSchema,
  getStoreCategoriesSchemaA,
  getStoreSubCategoriesSchema,
  userDeleteCartProductScheme,
  userRequestItemMulipleSchema,
  getStoreDetailbyIDSchema,
  deleteRequestByUserSchema,
  deleteRequestByStoreSchema,
  userListSchema,
  addUserCardDetailsSchema,
  getCardDetailsByUserIdSchema,
  deleteUserCardDetailsSchema,
  defaultCardUserSchema,
  addAmountInWalletSchema,
  getUserBalanceSchema,
  getTransactionsDetailsSchema,
  getBalanceByIdsSchema,
  refundMoneySchema,
  relativeProductSchema,
  withdrawByUserSchema,
  addCommentByUserSchema,
  getCommentsByProductIdSchema,
  userOtpVerifySchema,
  userCheckMobileSchema,
  createConnectAccountSchema,
  updateUsernameSchema,
  transferAccountSchema,
  listTransferDataSchema,
  setDefaultAccountSchema,
  deleteTransferAccDataSchema,
  addWithdrawRequestSchema,
  getTransferReqDataSchema,
  trasactionFCMTokenSchema,
} = require("./userValidate");

/* variable store */
let data1 = []
let combineId = []

/* variable store  end*/
const { Op } = require("sequelize");

var generateRandomNDigits = (n) => {
  return 1234;
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};

const getPagination = (page, size) => {
  const limit = size ? +size : 15;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: rowData } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, rowData, totalPages, currentPage };
};

//userLogin
exports.userLoginOK = async (req, reply) => {
  try {
    const results = await userLoginSchema.validateAsync(req.body);
    // console.log(results);
    var users = await models.User.findOne({
      where: {
        username: results.username,
      },
    });
    if (!users) {
      let message = "No username found";
      let message_code = "UserController:userLogin-017";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      // check password and login

      const userDetails = users.get();
      const passwordMatch = await bcrypt.compare(
        results.password,
        userDetails.password
      );
      if (!passwordMatch) {
        let message = "Invalid credential";
        let message_code = "UserController:userLogin-02";
        let message_action = "Ask again password ";
        let api_token = "";
        return Api.setWarningResponse(
          [],
          message,
          message_code,
          message_action,
          api_token
        );
      } else {
        const { email, id, password } = userDetails;
        const token = await reply.jwtSign(
          {
            email,
            id,
            password,
          },
          {
            expiresIn: 86400,
          }
        );
        let message = "User Detail with token";
        let message_code = "UserController:userLogin-03";
        let message_action =
          "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

        // / sendOtp.send("7703886088", "PRIIND", "4635", function (error, data) {
        //    console.log(data);
        //  });
        //  sendOtp.retry("917703886088", true, function (error, data) {
        //    console.log(data);
        //  });

        //update fcm
        const userdataUpdate = await models.User.update(
          { fcm_token: results.fcm_token },
          {
            where: {
              id: id,
            },
          }
        );

        //update fcm
        const OTP = generateRandomNDigits(5);
        //const OTP = 12345;
        const userData = {
          user_id: userDetails.id,
          deviceType: userDetails.deviceType,
          fcm_token: results.fcm_token,
          username: userDetails.username,
          phoneCode: userDetails.phoneCode,
          phoneNumber: userDetails.phoneNumber,
          phoneVerify: userDetails.phoneVerify,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phone: userDetails.phoneCode + userDetails.phoneNumber,
          email: userDetails.email,
          avatar: userDetails.avatar,
          gender: userDetails.gender,
          role: userDetails.role,
          isActive: userDetails.isActive,
          createdAt: userDetails.createdAt,
          OTP: OTP,
          token: token,
        };

        return Api.setSuccessResponse(
          userData,
          message,
          message_code,
          message_action
        );
      }
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:userLogin-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.userLogin = async (req, reply) => {
  try {
    const results = await userLoginSchema.validateAsync(req.body);
    // console.log(results);
    var users = await models.User.findOne({
      where: {
        phone: results.country_code + results.phone_number,
      },
    });
    console.log("users", users);

    if (!users) {
      let message = "user not found";
      let message_code = "UserController:userLogin-017";
      let message_action = "user is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {

      // ---- otpSendCode ---- //
      // client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
      //   .verifications
      //   .create({ to: `${results.country_code}${results.phone_number}`, channel: 'sms' })
      //   .then(verification => console.log(verification.status))
      //   .catch((err) => console.log("We Hace Error:", err))
      // ---- otpSendCode ---- //


      // check password and login
      const userDetails = users.get();

      const { email, id } = userDetails;
      const token = await reply.jwtSign(
        {
          email,
          id,
        },
        {
          expiresIn: 86400,
        }
      );
      let message = "User Detail with token";
      let message_code = "UserController:userLogin-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      // / sendOtp.send("7703886088", "PRIIND", "4635", function (error, data) {
      //    console.log(data);
      //  });
      //  sendOtp.retry("917703886088", true, function (error, data) {
      //    console.log(data);
      //  });

      //update fcm
      const userdataUpdate = await models.User.update(
        { fcm_token: results.fcm_token },
        {
          where: {
            id: id,
          },
        }
      );

      //update fcm
      // const OTP = generateRandomNDigits(5);
      const OTP = 1234;
      const userData = {
        user_id: userDetails.id,
        deviceType: userDetails.deviceType,
        fcm_token: results.fcm_token,
        // username: userDetails.username,
        phoneCode: userDetails.phoneCode,
        phoneNumber: userDetails.phoneNumber,
        phoneVerify: userDetails.phoneVerify,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phoneCode + userDetails.phoneNumber,
        email: userDetails.email,
        avatar: userDetails.avatar,
        gender: userDetails.gender,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        OTP: OTP,
        token: token,
      };

      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action
      );
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:userLogin-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userRegister
//check username if  yes then say already exits
//if no  then check phone if yes then alreay exits phone
//if not then send otp and response back to otp with status 2
//again call userRegister with otp is not null then check otp
//userRegister
exports.userRegisterOK = async (req, reply) => {
  try {
    const results = await userRegisterSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        username: results.username,
      },
    });
    if (!users) {
      var usersPhone = await models.User.findOne({
        where: {
          phone: results.country_code + results.phone_number,
        },
      });
      if (!usersPhone) {
        if (results.otp_verify == 0) {
          //send otp with

          const OTP = generateRandomNDigits(5);
          // sendOtp.send("7703886088", "PRIIND", OTP, function (error, data) {
          //   console.log(data);
          // });

          let message = "OTP Sent";
          let message_code = "UserController:userRegister-02";
          let message_action = "";
          let api_token = "";
          return Api.setWarningOTPResponse(
            OTP,
            message,
            message_code,
            message_action,
            api_token
          );
        }
        if (results.otp_verify == 1) {
          const passwordHashed = await bcrypt.hash(
            results.password,
            serverConfig.saltRounds
          );

          const data = await models.User.create({
            phone: results.country_code + results.phone_number,
            username: results.username,
            phoneCode: results.country_code,
            phoneNumber: results.phone_number,
            password: passwordHashed,
            deviceType: results.deviceType,
            fcm_token: results.fcm_token,
            otp_verify: results.otp_verify,
            role: 2,
          });

          let message = "user Created ";
          let message_code = "UserController:userRegister-01";
          let message_action = "Get back to login or Get started screen";
          let api_token = "";
          return Api.setSuccessResponse(
            data,
            message,
            message_code,
            message_action,
            api_token
          );
        }
      } else {
        let message = "Phone already added";
        let message_code = "UserController:userRegister-02";
        let message_action = "";
        let api_token = "";
        return Api.setWarningResponse(
          [],
          message,
          message_code,
          message_action,
          api_token
        );
      }
    } else {
      let message = "username already exists";
      let message_code = "UserController:userRegister-02";
      let message_action = "";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    }

    //--------------------------------
  } catch (err) {
    let message = "opps";
    let message_code = "UserController:userRegister-035";
    let message_action = err.message;
    let api_token = "";
    return Api.setErrorResponse(
      err,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.userRegister = async (req, reply) => {
  try {
    const results = await userRegisterSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        phone: results.country_code + results.phone_number,
      },
    });

    if (!users) {
      var usersPhone = await models.User.findOne({
        where: {
          phone: results.country_code + results.phone_number,
        },
      });

      if (!usersPhone) {
        if (results.otp_verify == 0) {
          //send otp with

          const OTP = generateRandomNDigits(5);
          // sendOtp.send("7703886088", "PRIIND", OTP, function (error, data) {
          //   console.log(data);
          // });

          let message = "OTP Sent";
          let message_code = "UserController:userRegister-02";
          let message_action = "";
          let api_token = "";
          return Api.setWarningOTPResponse(
            OTP,
            message,
            message_code,
            message_action,
            api_token
          );
        }
        if (results.otp_verify == 1) {
          // const passwordHashed = await bcrypt.hash(
          //   results.password,
          //   serverConfig.saltRounds
          // );

          const data = await models.User.create({
            phone: results.country_code + results.phone_number,
            // username: results.username,
            phoneCode: results.country_code,
            firstName: results.firstName,
            phoneNumber: results.phone_number,
            // password: passwordHashed,
            deviceType: results.deviceType,
            fcm_token: results.fcm_token,
            otp_verify: results.otp_verify,
            role: 2,
          });

          let message = "user Created ";
          let message_code = "UserController:userRegister-01";
          let message_action = "Get back to login or Get started screen";
          let api_token = "";
          return Api.setSuccessResponse(
            data,
            message,
            message_code,
            message_action,
            api_token
          );
        }
      } else {
        let message = "Phone already added";
        let message_code = "UserController:userRegister-02";
        let message_action = "";
        let api_token = "";
        return Api.setWarningResponse(
          [],
          message,
          message_code,
          message_action,
          api_token
        );
      }
    } else {
      let message = "Phone already exists";
      let message_code = "UserController:userRegister-02";
      let message_action = "";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    }

    //--------------------------------
  } catch (err) {
    let message = "opps";
    let message_code = "UserController:userRegister-035";
    let message_action = err.message;
    let api_token = "";
    return Api.setErrorResponse(
      err,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//getUserName
exports.getUserName = async (req, reply) => {
  try {
    const results = await userUserNemeSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        username: results.username,
      },
    });
    if (!users) {
      let message = "No username found";
      let message_code = "UserController:getUserName-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      // check password and login
      const userDetails = users.get();

      let message = "User Detail";
      let message_code = "UserController:getUserName-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      const userData = {
        user_id: userDetails.id,
        phoneVerify: userDetails.phoneVerify,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        email: userDetails.email,
        avatar: userDetails.avatar,
        gender: userDetails.gender,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };

      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action
      );
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:getUserName-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//getUserName

//updateUserPassword
exports.updateUserPassword = async (req, reply) => {
  try {
    const results = await userUpdatePasswordSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        id: results.user_id,
      },
    });
    if (!users) {
      let message = "No user id found";
      let message_code = "UserController:updateUserPassword-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      // check password and login
      const passwordHashedNew = await bcrypt.hash(
        req.body.password,
        serverConfig.saltRounds
      );
      const userdata = await models.User.update(
        { password: passwordHashedNew },
        {
          where: {
            id: results.user_id,
          },
        }
      );
      var users = await models.User.findOne({
        where: {
          id: results.user_id,
        },
      });

      const userDetails = users.get();

      let message = "User Detail";
      let message_code = "UserController:updateUserPassword-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      const userData = {
        user_id: userDetails.id,
        phoneVerify: userDetails.phoneVerify,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        email: userDdataetails.email,
        avatar: userDetails.avatar,
        gender: userDetails.gender,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        password: passwordHashedNew,
      };

      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action
      );
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:updateUserPassword-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//resetUserPassword
exports.resetUserPassword = async (req, reply) => {
  try {
    const results = await userPasswordResetSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        id: results.user_id,
      },
    });
    if (!users) {
      let message = "No user id found";
      let message_code = "UserController:resetUserPassword-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      const userDetails = users.get();
      const passwordMatch = await bcrypt.compare(
        results.current_password,
        userDetails.password
      );
      if (!passwordMatch) {
        let message = "Invalid credential";
        let message_code = "UserController:resetUserPassword-02";
        let message_action = "Ask again password ";
        let api_token = "";
        return Api.setWarningResponse(
          [],
          message,
          message_code,
          message_action,
          api_token
        );
      } else {
        if (results.new_password != results.confirm_password) {
          let message = "Password Mismatched";
          let message_code = "UserController:resetUserPassword-03";
          let message_action = "Ask again password ";
          let api_token = "";
          return Api.setWarningResponse(
            [],
            message,
            message_code,
            message_action,
            api_token
          );
        } else {
          // check password and login
          const passwordHashedNew = await bcrypt.hash(
            results.new_password,
            serverConfig.saltRounds
          );
          const userdata = await models.User.update(
            { password: passwordHashedNew },
            {
              where: {
                id: results.user_id,
              },
            }
          );
          var users = await models.User.findOne({
            where: {
              id: results.user_id,
            },
          });

          const userDetails = users.get();
          let message = "User Detail";
          let message_code = "Success UserController:resetUserPassword-03";
          let message_action =
            "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

          const userData = {
            user_id: userDetails.id,
            phoneVerify: userDetails.phoneVerify,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phone: userDetails.phone,
            email: userDetails.email,
            avatar: userDetails.avatar,
            gender: userDetails.gender,
            role: userDetails.role,
            isActive: userDetails.isActive,
            createdAt: userDetails.createdAt,
          };

          return Api.setSuccessResponse(
            userData,
            message,
            message_code,
            message_action
          );
        }
      }
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:resetUserPassword-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//resetUserPassword

//sendUserOTP
exports.sendUserOTP = async (req, reply) => {
  try {
    const results = await usersendUserOTPSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        id: results.user_id,
      },
    });
    if (!users) {
      let message = "No user id found";
      let message_code = "UserController:sendUserOTP-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      const OTP = generateRandomNDigits(5);
      //const OTP = 12345;
      const userDetails = users.get();
      sendOtp.send(userDetails.phone, "PRIIND", OTP, function (error, data) {
        console.log(data);
      });

      let message = "User Detail";
      let message_code = "UserController:sendUserOTP-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      const userData = {
        user_id: userDetails.id,
        phoneVerify: userDetails.phoneVerify,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        email: userDetails.email,
        avatar: userDetails.avatar,
        gender: userDetails.gender,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        OTP: OTP,
      };

      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action
      );
    }

    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:sendUserOTP-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//sendUserOTP

//resendUserOTP
exports.resendUserOTP = async (req, reply) => {
  try {
    const results = await usersendUserOTPSchema.validateAsync(req.body);
    var users = await models.User.findOne({
      where: {
        id: results.user_id,
      },
    });
    if (!users) {
      let message = "No user id found";
      let message_code = "UserController:resendUserOTP-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      const OTP = generateRandomNDigits(5);
      //const OTP = 12345;
      const userDetails = users.get();
      sendOtp.send(userDetails.phone, "PRIIND", OTP, function (error, data) {
        console.log(data);
      });

      let message = "User Detail";
      let message_code = "UserController:resendUserOTP-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      const userData = {
        user_id: userDetails.id,
        phoneVerify: userDetails.phoneVerify,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        email: userDetails.email,
        avatar: userDetails.avatar,
        gender: userDetails.gender,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        OTP: OTP,
      };

      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action
      );
    }

    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "UserController:resendUserOTP-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//resendUserOTP

const globalData = [];

//userProductList
exports.userProductList = async (req, reply) => {
  try {

    const results = await userProductListSchema.validateAsync(req.body);
    const user_id = results.user_id;
    const cityName = results.city_name;

    if (results.lat == "") {
      var storeDataArr = await models.Store.findAll({
        attributes: ["id", "store_name"],
        where: {
          store_name: {
            [Op.ne]: null,
          },
        },
        order: models.sequelize.random(),
      });
    } else {

      if (results.lat || results.long) {

        var [storeDataArr] = await models.sequelize.query(
          `
          SELECT DISTINCT
           stores.store_name,stores.id, ( 3959 * acos(cos(radians(${results.lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${results.long})) + sin(radians(${results.lat})) * sin(radians(store_lat ))) )
          AS
           distance
          FROM
           stores           
          JOIN
           products
          ON
            products.store_id = stores.id
          WHERE
           store_name is not null  
          GROUP BY store_id
          HAVING
           distance < 100
          ORDER BY
           distance ASC 
          LIMIT 20
          OFFSET 0
          `
        );

      } else {

        var [storeDataArr] = await models.sequelize.query(
          `
        SELECT DISTINCT
         stores.store_name,stores.id,products.store_id         
        FROM
          stores
        JOIN
          products
        WHERE
          stores.store_address LIKE "%${cityName}%"       
        AND
          products.store_id = stores.id
        GROUP BY store_id
        LIMIT 20
        OFFSET 0
        `
        );

      }

    }
    console.log("storeDataArrDistanfce::", storeDataArr);

    const productArrData = [];
    const storeWithProductList = [];
    const storeAll = [];
    const storeDataCount = (storeDataArr.length / 2) - 1; //halfDivided
    console.log("storeDataCount:::::", storeDataCount);

    for (const [i, storeData] of storeDataArr.entries()) {

      console.log("StoreId:::", storeData.id, i);

      if (i <= storeDataCount) { //storeDataCount

        var storeRecord = await models.Store.findOne({
          where: {
            id: storeData.id,
          },
        });

        var storeTimigRecord = await models.StoreTiming.findOne({
          where: {
            store_id: storeData.id,
          }
        });

        const [StoreCatArrData] = await models.sequelize.query(
          `SELECT * from storeCategories where store_id =${storeData.id}`
        );
        console.log("StoreCatArrData::", StoreCatArrData);

        var [productRecord] = await models.sequelize.query(
          `SELECT  t1.*, t2.store_name,t2.store_photo from  products t1 join stores t2 on t1.store_id = t2.id where t1.isActive = 1 and  t1.store_id="${storeData.id}" ORDER BY t1.id DESC`
        );
        console.log("productRecord-category::", productRecord);

        for (const forCatPId of productRecord) {

          const [productGallery] = await models.sequelize.query(
            `
            SELECT
            product_img 
            FROM
             productGalleries
            WHERE
             store_id = ${storeData.id}
            AND
             product_id = ${forCatPId.id} 
            ORDER BY id asc LIMIT  1
            `
          )

          if (productGallery.length > 0) {
            if (productGallery[0].product_img) {
              var imgProduct = productGallery[0].product_img
            } else {
              var imgProduct = "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg"
            }
          } else {
            var imgProduct = "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg"
          }

        }

        const storeXData = {
          store: {
            id: storeRecord.id,
            store_name: storeRecord.store_name,
            store_address: storeRecord.store_address,
            username: storeRecord.username,
            password: storeRecord.password,
            email: storeRecord.email,
            phoneCode: storeRecord.phoneCode,
            phoneNumber: storeRecord.phoneNumber,
            phone: storeRecord.phone,
            store_photo: storeRecord.store_photo,
            store_logo: storeRecord.store_logo,
            role: storeRecord.role,
            securiy_pin: storeRecord.securiy_pin,
            phoneVerify: storeRecord.phoneVerify,
            lastLoginAt: storeRecord.lastLoginAt,
            country_name: storeRecord.country_name,
            state_name: storeRecord.state_name,
            city_name: storeRecord.city_name,
            store_lat: storeRecord.store_lat,
            store_long: storeRecord.store_long,
            fcm_token: storeRecord.fcm_token,
            deviceType: storeRecord.deviceType,
            createdAt: storeRecord.createdAt,
            updatedAt: storeRecord.updatedAt,
            // category_image: productGalleryArrA[0].product_img,
            category_image: imgProduct,
            category_name: StoreCatArrData[0].cat_name,
          },
          storeTiming: storeTimigRecord,
        };

        storeAll.push(storeXData);


      } else {


        var [productRecord] = await models.sequelize.query(
          `SELECT  t1.*, t2.store_name,t2.store_photo from  products t1 join stores t2 on t1.store_id = t2.id where t1.isActive = 1 and  t1.store_id="${storeData.id}" ORDER BY t1.id DESC`
        );
        // console.log("productRecordArr:",productRecord[0]);


        if (productRecord.length > 0) {

          // console.log("0000000000000000000000000");

          var [productGalleryArrA] = await models.sequelize.query(
            `SELECT product_img from productGalleries t1 where t1.store_id=1 and t1.isActive = 1`
          );
          var [productCatArr] = await models.sequelize.query(
            `SELECT t2.* from productCategories t1 join itemCategories t2 on t1.store_id=t2.store_id `
          );
          var [StoreCatArrData] = await models.sequelize.query(
            `SELECT * from storeCategories where store_id =${storeData.id}`
          );

          // const [abc] = productRecordArr;
          // console.log("abc:",[abc]);

          /* Product List */

          let catID = "";
          let subcatID = "";

          var catIDArr = await models.StoreProductCategory.findOne({
            where: {
              store_id: storeData.id,
              product_id: productRecord[0].id,
              isActive: {
                [Op.ne]: 2,
              },
            },
          });
          // console.log("catIDArr::",catIDArr);

          if (catIDArr) {
            catID = catIDArr.cat_id;
          }

          var catSubIDArr = await models.StoreProductSubCategory.findOne({
            where: {
              store_id: storeData.id,
              product_id: productRecord[0].id,
              product_cat_id: catID,
              isActive: {
                [Op.ne]: 2,
              },
            },
          });
          if (catSubIDArr) {
            subcatID = catSubIDArr.product_sub_cat_id;
          }

          var productArrDataValue = await models.StoreProduct.findOne({
            where: {
              store_id: storeData.id,
              id: productRecord[0].id,
              isActive: {
                [Op.ne]: 2,
              },
            },
          });


          // var [productColorArr] = await models.sequelize.query(
          //   `SELECT t2.attr_name as name,attr_code as code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${storeData.id} and t2.store_id=${storeData.id} and  t1.product_id=${productRecord.id} and t2.attr_id=1`
          // );

          console.log("ProductId::", productRecord[0].id);

          var [productColorArr] = await models.sequelize.query(
            `
              SELECT
                t2.attr_name AS name, attr_code AS code
              FROM
                product_colors t1
              JOIN
                attributeValueMasters t2
              ON
                t1.color_id = t2.attr_value
              WHERE
                t1.store_id = ${storeData.id}
              AND
                t2.store_id = ${storeData.id}
              AND
                t1.product_id = ${productRecord[0].id}
              AND
                t2.isActive = 1
              AND
                t2.attr_id = 1
              `
          )

          // var [productSizeArr] = await models.sequelize.query(
          //   `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${storeData.id} and  t2.store_id=${storeData.id} and t1.product_id=${productRecord.id} and t2.attr_id=2`
          // );


          var [productSizeArr] = await models.sequelize.query(
            `
              SELECT
                t2.attr_name AS size
              FROM
                product_sizes t1
              JOIN
                attributeValueMasters t2
              ON
                t1.size_id = t2.attr_value
              WHERE
                t1.store_id = ${storeData.id}
              AND
                t2.store_id = ${storeData.id}
              AND
                t1.product_id = ${productRecord[0].id}
              AND
                t2.attr_id = 2
              AND
                t2.isActive = 1
              `
          );


          let qtyCount = 0;

          for (const getProdctSize of productSizeArr) {

            console.log("getProdctSize::", getProdctSize);

            const productStock = await models.manageProductSize.findOne(
              {
                where: {
                  store_id: storeData.id,
                  product_id: productRecord[0].id,
                  size: getProdctSize.size,
                }
              }
            );
            console.log("QTY:::", productStock);

            if (productStock == null) {

              qtyCount = qtyCount + productRecord[0].product_qty

            } else {

              qtyCount = qtyCount + productStock.qty

            }


          }

          if (qtyCount < 1) {

            var productSizeArr = [];
            console.log("productSizeArrInsideOfQty::", productSizeArr);

          }

          // console.log("productSizeArr[0]::", productSizeArr[0]);
          console.log("productSizeArr::", productSizeArr.length);

          // var [productGalleryArr] = await models.sequelize.query(
          //   `SELECT product_img from productGalleries t1 where t1.store_id=${storeData.id} and product_id=${productRecord.id}`
          // );

          var [productGalleryArr] = await models.sequelize.query(
            `
              SELECT
                product_img
              FROM
                productGalleries
              WHERE
                productGalleries.store_id = ${storeData.id}
              AND
                product_id = ${productRecord[0].id}
              AND
                isActive = 1
              `
          );



          // var storeIDProduct =
          //   await models.UserProductItemRequetAcceptedStore.findOne({
          //     where: {
          //       store_id: storeData.id,
          //       user_id: user_id,
          //       product_id: productRecord[0].id,
          //       status: {
          //         [Op.ne]: [4, 10]
          //       },
          //     },
          //   });

          var [storeIDProduct] = await models.sequelize.query(
            `
            SELECT * FROM users_product_store_accepteds WHERE user_id = ${user_id} AND store_id = ${storeData.id} AND product_id = ${productRecord[0].id} AND status NOT IN (4,10)
            `
          )



          var storeIDProductCart = await models.UserAddTCart.findOne({
            where: {
              store_id: storeData.id,
              user_id: user_id,
              product_id: productRecord[0].id,
            },
          });




          // const userCartData = await models.UserAddTCart.findOne({
          //   where: {
          //     user_id: user_id,
          //     product_id: productRecord.id
          //   }
          // })


          let hideRequest = 0;
          let hideCart = 0;

          if (storeIDProduct[0] == null) {
            hideRequest = 0;
          } else {
            hideRequest = 1;
          }

          if (storeIDProductCart) {
            hideCart = 1;
          } else {
            hideCart = 0;
          }


          if (qtyCount < 1) {

          } else {

            const productData = {
              product: {
                id: productRecord[0].id,
                store_id: productRecord[0].store_id,
                store_name: productRecord[0].store_name,
                // car_id: catID,
                // subcat_id: subcatID,
                product_title: productRecord[0].product_title,
                product_infomation: productRecord[0].product_infomation,
                product_photo: productRecord[0].product_photo,
                product_qty: productRecord[0].product_qty,
                regular_price: productRecord[0].regular_price,
                extra_price: productRecord[0].extra_price,
                total_price: productRecord[0].total_price,
                selling_price: productRecord[0].selling_price,
                min_stock_qty: productRecord[0].min_stock_qty,
                isActive: productRecord[0].isActive,
                createdAt: productRecord[0].createdAt,
                updatedAt: productRecord[0].updatedAt,
                store_name: productRecord[0].store_name,
                store_photo: productRecord[0].store_photo,
              },
              productColor: productColorArr,
              productSizes: productSizeArr,
              productGalleries: productGalleryArr,
              hideCart: hideCart,
              hideRequest: hideRequest,
            };


            productArrData.push(productData);

          }


          //product list


        }

      }

      //     console.log('%d: %s', i, storeData);
      // }

      //   for (const storeData of storeDataArr) {

      // console.log("storeDataArrInForLoop::",storeData.id);



      // console.log(storeData);



      // var productRecordArr = await models.StoreProduct.findAll({
      //   where: {
      //     store_id: storeData.id,
      //   },
      // });



    }


    const storeWithProductData = {
      stores: storeAll,
      products: productArrData
    };

    data1.push(storeWithProductData.products)






    for (const globalValue of productArrData) {
      console.log("globalValue>>>>>>>", globalValue.product.id);
      globalData.push(globalValue.product.id);
    }





    let finalDataCombination = data1[0].forEach(function (res, index) {
      combineId.push(res.product.id);
    })


    let message = "List of product list as per user list";
    let message_code = "UserController:userProductList-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      storeWithProductData,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    console.log(err);
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:userProductList-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

console.log("globalData:::", globalData);


//userProductSuggestionList
exports.userProductSuggestionList = async (req, reply) => {
  try {

    console.log("globalDataInside2222:::", globalData);

    const results = await userProductListSchema.validateAsync(req.body);
    console.log("results::", results);

    const user_id = results.user_id;
    const cityName = results.city_name;

    let { page, size } = req.query;
    page = parseInt(page) || 1;
    size = parseInt(size) || 10;
    let offset = (page - 1) * size;

    if (results.lat == "") {
      var storeDataArr = await models.Store.findAll({
        attributes: ["id", "store_name"],
        order: models.sequelize.random(),
      });
    } else {

      if (results.lat || results.long) {

        var [storeDataArr] = await models.sequelize.query(
          `SELECT
            store_name,
            id,
            (
              3959 * acos(cos(radians(${results.lat})) *
              cos(radians(store_lat)) *
              cos(radians(store_long) - radians(${results.long})) +
              sin(radians(${results.lat})) *
              sin(radians(store_lat))
            )
           ) AS distance
           FROM stores
           HAVING distance < 100
           ORDER BY distance ASC
          `
        );

      } else {

        var [storeDataArr] = await models.sequelize.query(
          `
        SELECT
         store_name,id
        FROM
          stores
        WHERE
          store_address LIKE "%${cityName}%"    
        `
        );

      }

    }


    const productArrData = [];
    const maxProducts = 20;
    let i = 0;

    for (const storeData of storeDataArr) {
      const productRecordArr = await models.sequelize.query(`
    SELECT t2.store_name, t2.store_photo, t1.*
    FROM products t1
    JOIN stores t2 ON t1.store_id = t2.id
    WHERE t1.isActive != 2 AND t1.store_id = "${storeData.id}"
  `);

      if (productRecordArr[0].length > 0) {
        const productsToAdd = productRecordArr[0].slice(0, maxProducts - i);

        for (const productRecord of productsToAdd) {
          i++;

          const productArrDataValue = await models.StoreProduct.findOne({
            where: {
              store_id: storeData.id,
              id: productRecord.id,
              isActive: {
                [Op.ne]: 2,
              },
            },
          });

          const [productColorArr] = await models.sequelize.query(`
        SELECT t2.attr_name as name, attr_code as code
        FROM product_colors t1
        JOIN attributeValueMasters t2 ON t1.color_id = t2.attr_value
        WHERE t1.store_id = ${storeData.id}
          AND t2.store_id = ${storeData.id}
          AND t1.product_id = ${productRecord.id}
          AND t2.isActive = 1
          AND t2.attr_id = 1
      `);

          const [productSizeArr] = await models.sequelize.query(`
        SELECT t2.attr_name as size
        FROM product_sizes t1
        JOIN attributeValueMasters t2 ON t1.size_id = t2.attr_value
        WHERE t1.store_id = ${storeData.id}
          AND t2.store_id = ${storeData.id}
          AND t1.product_id = ${productRecord.id}
          AND t2.isActive = 1
          AND t2.attr_id = 2
      `);

          const [productGalleryArr] = await models.sequelize.query(`
        SELECT product_img
        FROM productGalleries t1
        WHERE t1.store_id = ${storeData.id}
          AND product_id = ${productRecord.id}
          AND t1.isActive = 1
      `);

          let qtyCount = 0;
          for (const getProdctSize of productSizeArr) {
            const productStock = await models.manageProductSize.findOne({
              where: {
                store_id: storeData.id,
                product_id: productRecord.id,
                size: getProdctSize.size,
              },
            });

            qtyCount += productStock ? productStock.qty : productRecordArr[0].product_qty;
          }

          if (qtyCount < 1) {
            continue;
          }

          const [storeIDProduct] = await models.sequelize.query(`
        SELECT *
        FROM users_product_store_accepteds
        WHERE user_id = ${user_id}
          AND store_id = ${storeData.id}
          AND product_id = ${productRecord.id}
          AND status NOT IN (4,10)
      `);

          const storeIDProductCart = await models.UserAddTCart.findOne({
            where: {
              store_id: storeData.id,
              user_id: user_id,
              product_id: productRecord.id,
            },
          });

          const hideRequest = storeIDProduct[0] ? 1 : 0;
          const hideCart = storeIDProductCart ? 1 : 0;

          const [soldOut] = await models.sequelize.query(`
        SELECT *
        FROM productSoldOuts
        WHERE store_id = ${storeData.id}
          AND product_id = ${productRecord.id}
          AND isActive != 2
      `);

          const productData = {
            product: productRecord,
            productColor: productColorArr,
            productSizes: qtyCount < 1 ? [] : productSizeArr,
            productGalleries: productGalleryArr,
            hideCart,
            hideRequest,
            soldOut: soldOut[0] ? 1 : 0,
          };

          productArrData.push(productData);

          if (i >= maxProducts) {
            break;
          }
        }
      }
    }



    console.log("Total products added:", productArrData.length);



    //get all 20 product of given stores arrary
    //now one store and  thier 3 product if 3 not then skip
    const productWithStoreArrData = [];
    const productArrDataWith = [];
    for (const storeRow of storeDataArr) {
      //console.log(storeRow.id);

      var productCount = await models.StoreProduct.count({
        where: {
          store_id: storeRow.id,
          isActive: {
            [Op.ne]: 2,
          },
        },
      });
      if (productCount >= 1) {
        //prouduct
        // console.log( storeRow.id);
        //product
        var storeArr = await models.Store.findOne({
          where: {
            id: storeRow.id,
          },
        });

        var storeRecord = await models.Store.findOne({
          where: {
            id: storeRow.id,
          },
        });
        var storeTimigRecord = await models.StoreTiming.findOne({
          where: {
            store_id: storeRow.id,
          },
        });

        const storeXData = {
          store: {
            id: storeRecord.id,
            store_name: storeRecord.store_name,
            store_address: storeRecord.store_address,
            username: storeRecord.username,
            password: storeRecord.password,
            email: storeRecord.email,
            phoneCode: storeRecord.phoneCode,
            phoneNumber: storeRecord.phoneNumber,
            phone: storeRecord.phone,
            store_photo: storeRecord.store_photo,
            store_logo: storeRecord.store_logo,
            role: storeRecord.role,
            securiy_pin: storeRecord.securiy_pin,
            phoneVerify: storeRecord.phoneVerify,
            lastLoginAt: storeRecord.lastLoginAt,
            country_name: storeRecord.country_name,
            state_name: storeRecord.state_name,
            city_name: storeRecord.city_name,
            store_lat: storeRecord.store_lat,
            store_long: storeRecord.store_long,
            fcm_token: storeRecord.fcm_token,
            deviceType: storeRecord.deviceType,
            createdAt: storeRecord.createdAt,
            updatedAt: storeRecord.updatedAt,
            // category_image: productGalleryArrA[0].product_img,
            category_image:
              "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg",
            category_name: "Testing category",
          },
          storeTiming: storeTimigRecord,
        };
        //show product data
        // var productRecordArr = await models.StoreProduct.findAll({
        //   where: {
        //     store_id: storeRow.id,
        //   },
        // });

        var [productRecordArr] = await models.sequelize.query(
          `
          SELECT 
           t2.store_name,t2.store_photo,t1.* 
          FROM
            products t1 
          JOIN
          stores t2 
          ON
          t1.store_id = t2.id 
          WHERE
          t1.isActive!=2 
          AND t1.store_id="${storeRow.id}"
          `
        );
        console.log("productRecordArr::", productRecordArr);

        let j = 0;
        if (productRecordArr) {
          //product list

          for (let productRecord of productRecordArr) {
            j++;

            var productArrDataValue = await models.StoreProduct.findOne({
              where: {
                store_id: storeRow.id,
                id: productRecord.id,
                isActive: {
                  [Op.ne]: 2,
                },
              },
            });

            var [productColorArr] = await models.sequelize.query(
              `SELECT t2.attr_name as name,attr_code as code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${storeRow.id} and t2.store_id=${storeRow.id} and t1.product_id=${productRecord.id} and t2.isActive = 1 and t2.attr_id=1`
            );

            var [productSizeArr] = await models.sequelize.query(
              `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${storeRow.id}   and t2.store_id=${storeRow.id} and t1.product_id=${productRecord.id} and t2.isActive = 1 and t2.attr_id=2`
            );
            console.log("productSizeArr::;", productSizeArr);

            var [productGalleryArr] = await models.sequelize.query(
              `SELECT product_img from productGalleries t1 where t1.store_id=${storeRow.id} and product_id=${productRecord.id} and isActive = 1`
            );

            // var storeIDProduct =
            //   await models.UserProductItemRequetAcceptedStore.findOne({
            //     where: {
            //       store_id: storeRow.id,
            //       user_id: user_id,
            //       product_id: productRecord.id,
            //       status: {
            //         [Op.ne]: [4, 10]
            //       },
            //     },
            //   });

            var [storeIDProduct] = await models.sequelize.query(
              `
              SELECT * FROM users_product_store_accepteds WHERE user_id = ${user_id} AND store_id = ${storeRow.id} AND product_id = ${productRecord.id} AND status NOT IN (4,10)
              `
            )

            var storeIDProductCart = await models.UserAddTCart.findOne({
              where: {
                store_id: storeRow.id,
                user_id: user_id,
                product_id: productRecord.id,
              },
            });


            // Create an array to store all the promises for fetching productStock data
            const promises = productSizeArr.map(getProdctSize =>
              models.manageProductSize.findOne({
                where: {
                  store_id: storeRow.id,
                  product_id: productRecord.id,
                  size: getProdctSize.size,
                },
              })
            );

            // Fetch all the productStock data concurrently
            const productStockData = await Promise.all(promises);

            // Calculate the qtyCount using the reduce method
            const qtyCount = productStockData.reduce((acc, productStock) => {
              if (productStock == null) {
                return acc + productRecordArr[0].product_qty;
              } else {
                return acc + productStock.qty;
              }
            }, 0);


            if (qtyCount < 1) {
              var productSizeArr = [];
              console.log("productSizeArrInsideOfQty::", productSizeArr);
            }


            const [soldOut] = await models.sequelize.query(
              `
              SELECT * FROM productSoldOuts WHERE store_id = ${storeRow.id} AND product_id = ${productRecord.id} AND isActive!=2
              `
            );

            let hideRequest = 0;
            let hideCart = 0;

            if (storeIDProduct[0] == null) {
              hideRequest = 0;
            } else {
              hideRequest = 1;
            }

            if (storeIDProductCart) {
              hideCart = 1;
            } else {
              hideCart = 0;
            }

            if (soldOut[0] == undefined) {

              var productData = {
                product: productRecord,
                productColor: productColorArr,
                productSizes: productSizeArr,
                productGalleries: productGalleryArr,
                hideCart: hideCart,
                hideRequest: hideRequest,
                soldOut: 0
              };

            } else {

              var productData = {
                product: productRecord,
                productColor: productColorArr,
                productSizes: productSizeArr,
                productGalleries: productGalleryArr,
                hideCart: hideCart,
                hideRequest: hideRequest,
                soldOut: 1
              };

            }

            if (j <= 3) {
              if (qtyCount < 1) {
              } else {
                productArrDataWith.push(productData);
              }
              //console.log(i);
            } else {
              //console.log(i);
            }
          }
          //product list
        }

        //show product data

        // const OnestoreWith3product = {
        //  // store: storeXData,
        //   products: productArrDataWith,
        // };
        // productWithStoreArrData.push(OnestoreWith3product);
      }

      // console.log(productRecordArr);
    }
    //now one store and  thier 3 product if 3 not then skip


    // ----- forUniqueProduct ----- //
    var finalDataForProduct = [];
    var uniqueRecord = productArrData;
    var uniqueRecord = uniqueRecord.filter(function (item) {

      const data1 = [...finalDataForProduct]


      return globalData.map((value) => {
        const data = item.product.id != value
        if (data == false) {
          finalDataForProduct.push(item.product)
        }
      })
    })

    // const finalResponse = []
    // productArrData = productArrData.filter(productData => !finalDataForProduct.find(finalData => (finalData.id === productData.product.id)));

    // finalResponse.push(productArrData);



    const finalResponse = [];

    for (const productData of productArrData) {
      let found = false;
      for (const finalData of finalDataForProduct) {
        if (finalData.id === productData.product.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        finalResponse.push(productData);
      }
    }

    console.log("finalResponse-------------------", finalResponse);

    // ----- End forUniqueProduct ----- //

    const storeWithProductData = {
      products: finalResponse,
      storeswithProducts: {
        products: productArrDataWith,
      },
    };

    // const productResponseData = {
    //   products: finalResponse,
    //   storeswithProducts: {
    //     products: productArrDataWith,
    //   },
    // };

    // let feactId = [];
    // storeWithProductData.products.forEach(function (res, index) {
    //   for (const findRes of res) {
    //     if (combineId.find(e => e == findRes.product.id) != null) {
    //     } else {
    //       feactId.push(res.product)
    //     }
    //   }
    // })

    // var finalData;
    // if (!combineId) {
    //   finalData = storeWithProductData
    // } else {
    //   finalData = feactId
    // }


    let data = storeWithProductData
    let message = "One store 3 products";
    let message_code = "UserController:userProductSuggestionList-01";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    console.log("err====", err);
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:userProductSuggestionList-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.userProductSuggestionListA = async (req, reply) => {
  try {
    const results = await userProductListSchema.validateAsync(req.body);
    const [storeDataArr] = await models.sequelize.query(
      `SELECT store_name,id, ( 3959 * acos(cos(radians(${results.lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${results.long})) + sin(radians(${results.lat})) * sin(radians(store_lat ))) ) AS distance FROM stores HAVING distance < 100 ORDER BY distance LIMIT 0, 2; `
    );

    // console.log(storeDataArr);
    // return false;

    const [storeDataArrAll] = await models.sequelize.query(
      `SELECT store_name,id, ( 3959 * acos(cos(radians(${results.lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${results.long})) + sin(radians(${results.lat})) * sin(radians(store_lat ))) ) AS distance FROM stores HAVING distance < 100 ORDER BY distance LIMIT 0, 20; `
    );
    // console.log(storeDataArrAll);
    // return false;

    const storeArrDataOID = [];
    const storeArrDataOIDALL = [];
    for (const storeData of storeDataArr) {
      storeArrDataOID.push(storeData.id);
    }
    for (const storeDataALl of storeDataArrAll) {
      storeArrDataOIDALL.push(storeDataALl.id);
    }

    // console.log(storeArrDataOIDALL);
    // return false;

    const arrB = storeArrDataOID;
    // console.log(arrB);
    const arrA = storeArrDataOIDALL;
    // console.log(arrA);

    const difference = arrA.filter((x) => !arrB.includes(x));
    //  console.log(difference);
    //  return false;

    const storeArrData = [];

    const productColorArrData = [];
    const productSizeArrData = [];

    for (const storeData of difference) {
      var storeRecord = await models.Store.findOne({
        where: {
          id: storeData,
        },
      });

      //     console.log(storeData);
      //  return false;

      var storeTimigRecord = await models.StoreTiming.findOne({
        where: {
          store_id: storeRecord.id,
        },
      });
      //          console.log(storeTimigRecord);
      //  return false;

      var productRecordArr = await models.StoreProduct.findAll({
        where: {
          store_id: storeRecord.id,
        },
      });

      const productArrData = [];
      if (productRecordArr.length >= 3) {
        //Note store 1 product 3

        for (const products of productRecordArr) {
          const pid = products.id;

          var productOneData = await models.StoreProduct.findOne({
            where: {
              id: 1,
            },
          });

          productArrData.push(productOneData);
        }

        ///
        const data = {
          storeOneData: {
            store: storeRecord,
            storeTiming: storeTimigRecord,
          },
          productThree: productArrData,
          suggestion_products: productArrData,
          store_product_list: productArrData,
        };
        //product :  20  products same respose as userproduct list
        // storeswithProducts: [{ 1 store  3 product },.... pagination ],

        //response

        let message = "One store 3 products";
        let message_code = "UserController:userProductSuggestionList-01";
        let message_action = "catched Error:";
        let api_token = "";
        return Api.setSuccessResponse(
          data,
          message,
          message_code,
          message_action,
          api_token
        );

        //response
      } else {
        let message = "NO Data found";
        let message_code = "UserController:userProductSuggestionList-01";
        let message_action = "catched Error:";
        let api_token = "";
        return Api.setErrorResponse(
          "",
          message,
          message_code,
          message_action,
          api_token
        );
      }
    }
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:userProductSuggestionList-04";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userProductSuggestionList
//userStoreProductSearch

//userAddToCart
exports.userAddToCart = async (req, reply) => {
  try {
    const results = await userAddToCartSchema.validateAsync(req.body);
    console.log(results);
    const data = await models.UserAddTCart.create({
      user_id: results.user_id,
      store_id: results.store_id,
      product_id: results.product_id,
      color: results.color,
      size: results.size,
    });

    var storeRecord = await models.Store.findOne({
      where: {
        id: results.store_id,
      },
    });

    const dataA = {
      user_id: results.user_id,
      store_id: results.store_id,
      product_id: results.product_id,
      store_name: storeRecord.store_name,
      store_photo: storeRecord.store_photo,
      cartData: data,
    };

    let message = "";
    let message_code = "UserController:userAddToCart-02";
    let message_action = "";
    let api_token = "";
    return Api.setSuccessResponse(dataA, message, message_code, message_action);
  } catch (err) {

    let data = "oops";
    let message = err.message;
    let message_action = "";
    let message_code = "UserController:userAddToCart:E-1";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  }
};

//userAddToCart

//userGetAddToCart
exports.userGetAddToCart = async (req, reply) => {
  try {
    const results = await userGetToCartSchema.validateAsync(req.body);
    console.log("=====>", results);
    var requestedProductArrData = await models.UserAddTCart.findAll({
      attributes: ["store_id", "color", "size"],
      where: {
        user_id: results.user_id,
      },
      order: [["id", "DESC"]],
      group: ["store_id"],
    });

    console.log("requestedProductArrData::", requestedProductArrData);

    const productsDaval = [];

    for (const productArrData of requestedProductArrData) {
      // console.log(productArrData.store_id)
      var requestedProductArr = await models.UserAddTCart.findAll({
        where: {
          store_id: productArrData.store_id,
          user_id: results.user_id,
        },
      });

      const productsArrDataMuliple = [];
      for (const productArr of requestedProductArr) {

        //console.log(productArr);
        var [productArrDataValue] = await models.sequelize.query(
          `SELECT t2.store_name,t2.store_photo , t1.* from  products t1 join stores t2 on t1.store_id = t2.id where  t1.store_id="${productArr.store_id}" and t1.id=${productArr.product_id}`
        );

        console.log("productArrDataValue:::", productArrDataValue[0]);

        var [productColorArr] = await models.sequelize.query(
          `SELECT color, size FROM users_product_add_to_carts WHERE user_id = ${results.user_id} AND product_id = ${productArr.product_id}`
        );

        console.log("productColorArr ==>", productColorArr);


        // var [productSizeArr] = await models.sequelize.query(
        //   `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${productArr.store_id}  and t2.store_id=${productArr.store_id} and t1.product_id=${productArr.product_id} and t2.attr_id=2`
        // );


        // for (const productArrDataColor of requestedProductArrData) {
        //   var requestedProductArrColor = await models.UserAddTCart.findAll({
        //     where: {
        //       product_id: productArr.product_id,
        //       user_id: results.user_id
        //     }
        //   })
        //   const colorData = requestedProductArrColor[0].dataValues.color;
        //   const sizeData = requestedProductArrColor[0].dataValues.size;
        //   console.log("requestedProductArrColor:::", colorData , sizeData);
        // }


        console.log("productColorArr:::", productColorArr);

        var productColorArrData = [
          {
            "name": productArr.color,
            "code": productArr.color
          }
        ]

        var productSizeArr = [
          {
            "size": productArr.size
          }
        ]

        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${productArr.store_id} and product_id=${productArr.product_id} and isActive = 1`
        );
        const productAll = {
          product: productArrDataValue[0],
          productColor: productColorArrData,
          productSizes: productSizeArr,
          productGalleries: productGalleryArr,
        };
        productsArrDataMuliple.push(productAll);
      }

      var storeRecord = await models.Store.findOne({
        where: {
          id: productArrData.store_id,
        },
      });
      console.log("storeRecord::", storeRecord);

      const forStoreData = {
        store_id: storeRecord.id,
        store_name: storeRecord.store_name,
        store_logo: storeRecord.store_logo,
        productDetails: productsArrDataMuliple,
      };
      productsDaval.push(forStoreData);
    }

    let data = productsDaval;
    let message = "list of cart data";
    let message_code = "UserController:userDeleteFromCart-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    console.log("err", err);
    let data = "oops";
    let message = err.message;
    let message_action = "";

    let api_token = "";
    let message_code = "UserController:userGetAddToCart:E-1";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};


exports.userGetAddToCartA = async (req, reply) => {
  try {
    const results = await userGetToCartSchema.validateAsync(req.body);
    // console.log(results);
    var [userAddtoCartArr] = await models.sequelize.query(
      `SELECT *  from users_product_add_to_carts where user_id =${results.user_id}`
    );
    const productArrData = [];
    const productColorArrData = [];
    const productSizeArrData = [];

    for (const userAddtoCar of userAddtoCartArr) {
      // console.info(userAddtoCar.store_id);
      // console.info(userAddtoCar.product_id);
      var [productDataArr] = await models.sequelize.query(
        `SELECT t1.*,t2.store_name,t2.store_photo,t2.store_logo from  products t1 join stores t2 on t1.store_id=t2.id where t1.id="${userAddtoCar.product_id}" and t1.store_id="${userAddtoCar.store_id}" `
      );
      // console.info(productDataArr);

      for (const productArr of productDataArr) {
        var storeRecord = await models.Store.findOne({
          where: {
            id: userAddtoCar.store_id,
          },
        });

        var [productColorArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name,attr_code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${userAddtoCar.store_id} and t2.store_id=${userAddtoCar.store_id} and t1.product_id=${userAddtoCar.product_id} and t2.attr_id=1`
        );
        for (const productColor of productColorArr) {
          //console.log(productColor.attr_name);
          const colorData = {
            name: productColor.attr_name,
            code: productColor.attr_code,
          };
          productColorArrData.push(colorData);
        }
        var [productSizeArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${userAddtoCar.store_id} and t2.store_id=${userAddtoCar.store_id}  and t1.product_id=${userAddtoCar.product_id} and t2.attr_id=2`
        );
        for (const productSize of productSizeArr) {
          //console.log(productColor.attr_name);
          const sizeData = {
            size: productSize.attr_name,
          };

          productSizeArrData.push(sizeData);
        }
        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${userAddtoCar.store_id} and product_id=${userAddtoCar.product_id}`
        );

        const productAll = {
          product: productArr,
          productColor: productColorArrData,
          productSizes: productSizeArrData,
          productGalleries: productGalleryArr,
        };
        productArrData.push(productAll);
      }
    }

    //------------------------
    let data = {
      products: productArrData,
    };
    let message = "";
    let message_code = "UserController:userGetAddToCart-02";
    let message_action = "";

    return Api.setSuccessResponse(data, message, message_code, message_action);
  } catch (err) {
    let data = "oops";
    let message = err.message;
    let message_action = "";

    let api_token = "";
    let message_code = "UserController:userGetAddToCart:E-1";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userGetAddToCart

//userRequested
exports.userRequestedA = async (req, reply) => {
  try {
    const results = await userGetToCartSchema.validateAsync(req.body);
    // console.log(results);
    var [userAddtoCartArr] = await models.sequelize.query(
      `SELECT *  from users_product_store_accepteds where user_id =${results.user_id}`
    );
    const productArrData = [];
    const productColorArrData = [];
    const productSizeArrData = [];

    for (const userAddtoCar of userAddtoCartArr) {
      // console.info(userAddtoCar.store_id);
      // console.info(userAddtoCar.product_id);
      var [productDataArr] = await models.sequelize.query(
        `SELECT t1.*, t2.store_name,t2.store_photo from  products t1 join stores t2 on t1.store_id = t2.id where t1.id="${userAddtoCar.product_id}" and t1.store_id="${userAddtoCar.store_id}"`
      );
      // console.info(productDataArr);

      for (const productArr of productDataArr) {
        var [productColorArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name,attr_code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${userAddtoCar.store_id}  and t2.store_id=${userAddtoCar.store_id} and t1.product_id=${userAddtoCar.product_id} and t2.attr_id=1`
        );
        for (const productColorA of productColorArr) {
          //console.log(productColor.attr_name);
          const colorData = {
            name: productColorA.attr_name,
            code: productColorA.attr_code,
          };

          productColorArrData.push(colorData);
        }
        var [productSizeArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${userAddtoCar.store_id}  and t2.store_id=${userAddtoCar.store_id} and t1.product_id=${userAddtoCar.product_id} and t2.attr_id=2`
        );
        for (const productSize of productSizeArr) {
          //console.log(productColor.attr_name);
          const sizeData = {
            size: productSize.attr_name,
          };

          productSizeArrData.push(sizeData);
        }
        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${userAddtoCar.store_id} and product_id=${userAddtoCar.product_id}`
        );

        var reqProductData =
          await models.UserProductItemRequetAcceptedStore.findOne({
            where: {
              user_id: results.user_id,
              store_id: userAddtoCar.store_id,
              product_id: userAddtoCar.product_id,
            },
          });

        const productAll = {
          reqId: reqProductData.id,
          isAccepted: userAddtoCar.status,
          product: productArr,
          productColor: productColorArrData,
          productSizes: productSizeArrData,
          productGalleries: productGalleryArr,
        };
        productArrData.push(productAll);
      }
    }

    //------------------------

    let message = "";
    let message_code = "UserController:userGetAddToCart-02";
    let message_action = "";

    return Api.setSuccessResponse(
      productArrData,
      message,
      message_code,
      message_action
    );
  } catch (err) {
    let data = "oops";
    let message = err.message;
    let message_action = "";

    let api_token = "";
    let message_code = "UserController:userGetAddToCart:E-1";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//userRequested storeData
exports.userStoreProductSearch = async (req, reply) => {
  try {
    const { lat, long, searchkey, city_name } = req.query;
    // const { limit, offset } = getPagination(page, size);

    let page;
    let size;

    page = req.query.page
    size = req.query.size

    if (page && size) {
      page = page,
        size = size
    } else {
      page = 1
      size = 50
    }

    let offset = (page - 1) * size;

    // const [storeDataArr] = await models.sequelize.query(
    //   `SELECT store_name,id, ( 3959 * acos(cos(radians(${lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${long})) + sin(radians(${lat})) * sin(radians(store_lat ))) ) AS distance FROM stores where store_name like '%${searchkey}%' HAVING distance < 8200 ORDER BY distance LIMIT 0, 20; `
    // );


    /* Search With Category */

    console.log("searchKey==>", searchkey);


    if (lat || long) {

      var [storeDataArr] = await models.sequelize.query(
        `
        SELECT
          storeCategories.store_id,
          storeCategories.cat_name,
          stores.*,
          ( 3959 * acos(cos(radians(${lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${long})) + sin(radians(${lat})) * sin(radians(store_lat ))) ) AS distance
        FROM 
          storeCategories, 
          stores 
        WHERE 
          storeCategories.store_id = stores.id
        AND 
          (storeCategories.cat_name LIKE '%${searchkey}%'
        OR
          stores.store_name LIKE '%${searchkey}%')
        GROUP BY
          store_name
        HAVING 
          distance < 100 ORDER BY distance 
        `
      )

      console.log("latitude", lat);
      console.log("longitude::", storeDataArr);
      console.log("ssfhiaefhwrffjoiaeur89qwfjfnewrhig");

    } else {


      var [storeDataArr] = await models.sequelize.query(
        `
      SELECT 
      storeCategories.store_id,
      storeCategories.cat_name,
      stores.*  
      FROM
      storeCategories
      JOIN
      stores
      WHERE
      stores.store_address LIKE "%${city_name}%"
      AND
      (stores.store_name LIKE '%${searchkey}%'
      OR
      storeCategories.cat_name LIKE '%${searchkey}%')
      GROUP BY
      store_name
      `
      )


      // console.log("storeDataArr", storeDataArr);

    }

    console.log("storeDataArr==::", storeDataArr);

    const storeArrData = [];
    const productArrData = [];
    const productColorArrData = [];
    const productSizeArrData = [];
    const storeAll = [];

    for (const storeData of storeDataArr) {

      console.log("storeDataId:::::", storeData.id);

      var storeRecord = await models.Store.findOne({
        where: {
          id: storeData.id,
        },
      });
      // console.log("storeRecord::",storeRecord);

      var storeTimigRecord = await models.StoreTiming.findOne({
        where: {
          store_id: storeData.id,
        },
      });
      // console.log("storeTimigRecord::",storeTimigRecord);

      var storeCategory = await models.StoreCategory.findOne({
        where: {
          store_id: storeData.id,
        }
      });

      const storeXData = {
        store: storeRecord,
        storeTiming: storeTimigRecord,
        category_name: storeCategory.cat_name
      };
      storeAll.push(storeXData);
    }

    if (city_name) {

    }
    if (lat || long) {

      var [productDataArr] = await models.sequelize.query(
        `
        SELECT 
         stores.store_name,stores.store_photo, products.*,
         ( 3959 * acos(cos(radians(${lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${long})) + sin(radians(${lat})) * sin(radians(store_lat ))) ) AS distance
        FROM 
         products products 
        JOIN
         stores stores 
        ON
         stores.id = products.store_id 
        WHERE
         products.isActive != 2 
        AND
         (products.product_title LIKE '%${searchkey}%'
        OR
          products.product_infomation LIKE '%${searchkey}%')
        HAVING 
         distance < 8200 ORDER BY distance 
        `
      );
    } else {
      var [productDataArr] = await models.sequelize.query(
        `
      SELECT 
        stores.store_name,
        stores.store_photo,
        stores.store_address,
        products.*
      FROM
        products
      JOIN   
        stores
      WHERE
        stores.id = products.store_id
      AND
        (products.product_title LIKE '%${searchkey}%'
        OR
        products.product_infomation LIKE '%${searchkey}%')
      AND
        stores.store_address LIKE "%${city_name}%"  
      `
      )
    }


    // var condition = searchkey
    // ? { product_title: { [Op.like]: `%${searchkey}%` } }
    // : null;

    // var productDataArr = await models.StoreProduct.findAndCountAll({
    //   where: condition,
    //   limit,
    //   offset,
    // });

    console.log("productDataArr", productDataArr);

    for (const productArr of productDataArr) {
      console.log("productArr-data::::", productArr.store_id, productArr.id);

      var [productColorArr] = await models.sequelize.query(
        `SELECT t2.attr_name as name,attr_code as code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${productArr.store_id}  and t2.store_id=${productArr.store_id} and t1.product_id=${productArr.id} and 
        t2.isActive = 1 and t2.attr_id=1`
      );

      var [productSizeArr] = await models.sequelize.query(
        `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${productArr.store_id} and t2.store_id=${productArr.store_id} and t1.product_id=${productArr.id} and t2.isActive = 1 and t2.attr_id=2`
      );

      var [productGalleryArr] = await models.sequelize.query(
        `SELECT product_img from productGalleries t1 where t1.store_id=${productArr.store_id} and product_id=${productArr.id} and t1.isActive = 1`
      );

      let qtyCount = 0;

      for (const getProdctSize of productSizeArr) {

        console.log("getProdctSize::", getProdctSize);

        const productStock = await models.manageProductSize.findOne(
          {
            where: {
              store_id: productArr.store_id,
              product_id: productArr.id,
              size: getProdctSize.size,
            }
          }
        );
        console.log("QTY:::", productStock);

        if (productStock == null) {

          qtyCount = qtyCount + productDataArr[0].product_qty

        } else {

          qtyCount = qtyCount + productStock.qty

        }


      }

      if (qtyCount < 1) {

        var productSizeArr = [];
        console.log("productSizeArrInsideOfQty::", productSizeArr);

      }

      var [soldOut] = await models.sequelize.query(
        `SELECT * FROM  productSoldOuts WHERE  store_id = ${productArr.store_id} AND product_id = ${productArr.id} AND isActive!=2`
      );
      console.log("productArr::", productArr.id);
      console.log("soldOut", soldOut);

      const productStock = await models.manageProductSize.findOne(
        {
          where: {
            store_id: productArr.store_id,
            product_id: productArr.id
          }
        }
      );

      if (qtyCount < 1) {
      } else {

        if (soldOut[0] == undefined) {
          const productAll = {
            product: productArr,
            productColor: productColorArr,
            productSizes: productSizeArr,
            productGalleries: productGalleryArr,
            soldOut: 0
          };
          productArrData.push(productAll);

        } else {
          const productAll = {
            product: productArr,
            productColor: productColorArr,
            productSizes: productSizeArr,
            productGalleries: productGalleryArr,
            soldOut: 1
          };
          productArrData.push(productAll);

        }
      }

    }

    console.log("offset", offset, "size", parseInt(size));

    const storeWithProductData = {
      store_count: storeAll.length,
      stores: storeAll.slice(offset, offset + parseInt(size)),
      product_count: productArrData.length,
      products: productArrData.slice(offset, offset + parseInt(size)),
    };



    // const responseData = getPagingData(storeArrData, page, limit);

    console.log("storeWithProductData", storeWithProductData);

    //let data = results;
    let message = "";
    let message_code = "UserController:userProductList-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      storeWithProductData,
      message,
      message_code,
      message_action
    );
  } catch (err) {
    console.log("ERROR", err);
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userStoreProductSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.userStoreProductSearchOKforSystemWays = async (req, reply) => {
  try {
    const { page, size, lat, long, searchkey } = req.query;
    const { limit, offset } = getPagination(page, size);

    const [storeDataArr] = await models.sequelize.query(
      `SELECT store_name,id, ( 3959 * acos(cos(radians(${lat})) * cos(radians(store_lat)) * cos(radians( store_long ) - radians(${long})) + sin(radians(${lat})) * sin(radians(store_lat ))) ) AS distance FROM stores where store_name like '%${searchkey}%' HAVING distance < 100 ORDER BY distance LIMIT 0, 20; `
    );

    var [soldOut] = await models.sequelize.query(
      `SELECT * FROM  productSoldOuts WHERE  store_id = ${rowData.store_id} AND product_id = ${rowData.id} AND isActive!=2`
    );
    console.log("soldOut", soldOut[0]);

    const storeArrData = [];
    const productArrData = [];
    const productColorArrData = [];
    const productSizeArrData = [];
    const storeAll = [];

    for (const storeData of storeDataArr) {
      var storeRecord = await models.Store.findOne({
        where: {
          id: storeData.id,
        },
      });
      var storeTimigRecord = await models.StoreTiming.findOne({
        where: {
          store_id: storeData.id,
        },
      });

      var [productDataArr] = await models.sequelize.query(
        `SELECT * from  products where product_title like '%${searchkey}%' and store_id="${storeData.id}"`
      );

      // var condition = searchkey
      // ? { product_title: { [Op.like]: `%${searchkey}%` } }
      // : null;

      // var productDataArr = await models.StoreProduct.findAndCountAll({
      //   where: condition,
      //   limit,
      //   offset,
      // });

      for (const productArr of productDataArr) {
        var [productColorArr] = await models.sequelize.query(
          `SELECT t2.attr_name as name,attr_code as code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${storeRecord.id}  and t2.store_id=${storeRecord.id} and t1.product_id=${productArr.id} and t2.attr_id=1`
        );

        var [productSizeArr] = await models.sequelize.query(
          `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${storeRecord.id} and t2.store_id=${storeRecord.id} and t1.product_id=${productArr.id} and t2.attr_id=2`
        );

        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${storeRecord.id} and product_id=${productArr.id}`
        );

        const productAll = {
          product: productArr,
          productColor: productColorArr,
          productSizes: productSizeArr,
          productGalleries: productGalleryArr,
        };
        productArrData.push(productAll);
      }

      const storeXData = {
        store: storeRecord,
        storeTiming: storeTimigRecord,
      };
      storeAll.push(storeXData);
    }

    const storeWithProductData = {
      stores: storeAll,
      products: productArrData,
    };

    // const responseData = getPagingData(storeArrData, page, limit);
    //let data = results;
    let message = "";
    let message_code = "UserController:userProductList-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      storeWithProductData,
      message,
      message_code,
      message_action
    );
  } catch (err) {
    console.log("error", err);
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userStoreProductSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//userSearch
exports.userSearch = async (req, reply) => {
  const results = await userSearchSchema.validateAsync(req.body);

  // console.log(results);

  var [userData] = await models.sequelize.query(
    `SELECT *  from users where  username like '%${results.search_user_name}%'`
  );

  try {
    let data = userData;
    let message = "Search Result";
    let message_code = "UserController:userStoreProductSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userSearch

//userRequestItem://
exports.userRequestItem = async (req, reply) => {
  try {
    let data = "opps!";
    let message = "";
    let message_code = "UserController:userSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userSearch-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userRequestItem

//userRequestItemAccepted
exports.userRequestItemAccepted = async (req, reply) => {
  try {
    const results = await userRequestItemAcceptedschema.validateAsync(req.body);

    const data = await models.UserProductItemRequetAcceptedStore.create({
      user_id: results.user_id,
      store_id: results.store_id,
      product_id: results.product_id,
    });

    let message = data;
    let message_code = "UserController:userRequestItemAccepted-01";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      results,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userRequestItemAccepted


exports.getStoreCategories = async (req, reply) => {
  try {
    const results = await getStoreCategoriesSchemaA.validateAsync(req.body);

    const resultsdata = await models.StoreProduct.findOne({
      where: {
        store_id: results.store_id,
        isActive: {
          [Op.ne]: 2,
        },
      },
    });

    // console.log("resultsdata",resultsdata);

    //get first product img
    var [itemCategoriesArr] = await models.sequelize.query(
      `
      SELECT 
       id 
      AS
       cat_id,item_cat_name 
      FROM 
       itemCategories 
      WHERE
       isActive!=2 
      AND
       store_id = "${results.store_id}" 
      ORDER BY id DESC
      `
    );

    console.log("itemCategoriesArr", itemCategoriesArr);

    const storeSubCatArrData = new Array();
    const storeCatArrData = [];


    console.log("itemCategoriesArr==>", itemCategoriesArr);
    for (const itemCategories of itemCategoriesArr) {
      console.log("hhh==>", itemCategories.cat_id);
      var storeProductCatExits = await models.StoreProductCategory.findOne({
        where: {
          store_id: results.store_id,
          cat_id: itemCategories.cat_id,
          isActive: {
            [Op.ne]: 2,
          },
        },
      });

      console.log("storeProductCatExits", storeProductCatExits);

      // console.log("itemCategories.cat_id", itemCategories.cat_id);

      if (storeProductCatExits) {

        var [singleProductCat] = await models.sequelize.query(
          `
          SELECT 
            t1.store_id, t1.product_id
          FROM
            productCategories t1 
          JOIN
           products t2 
          On
           t2.id = t1.product_id 
          WHERE
           t2.isActive!=2 
          AND
           t1.isActive!=2 
          AND
           t1.store_id = "${results.store_id}" 
          AND
           t1.cat_id = ${itemCategories.cat_id} 
          ORDER BY
           t2.id ASC
          `
        );
        console.log("results.store_id==>", results.store_id);
        console.log("itemCategories.cat_id==>", itemCategories.cat_id);

        console.log(singleProductCat[0].product_id);

        console.log("singleProductCat==>", singleProductCat);


        //edit 2 


        var [productGalleryArr1] = await models.sequelize.query(
          `
          SELECT
           product_img 
          FROM
           productGalleries
          WHERE
           store_id = ${results.store_id}
          AND
           product_id = ${singleProductCat[0].product_id} 
          ORDER BY id asc LIMIT  1
          `
          // `SELECT product_img from productGalleries t1 join products t2 on t2.id=t1.product_id where t2.isActive!=2 and  t1.store_id=${results.store_id} order by t1.id asc  limit 1`
        );
        console.log("productGalleryArr1", productGalleryArr1);

        //return false;
        if (productGalleryArr1.length > 0) {
          if (productGalleryArr1[0].product_img) {
            var imgProduct1 = productGalleryArr1[0].product_img;
          } else {
            var imgProduct1 =
              "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg";
          }
        } else {
          var imgProduct1 =
            "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg";
        }

        //edit 2 


        const catData = {
          store_id: results.store_id,
          cat_id: itemCategories.cat_id,
          item_cat_name: itemCategories.item_cat_name,
          // firstProduct_IMG: productGalleryArr[0].product_img,
          firstProduct_IMG: imgProduct1,
        };
        storeCatArrData.push(catData);
      }
    }

    // get item categories if product is added in it

    var [itemSubCategoriesArr] = await models.sequelize.query(
      `SELECT id as sub_cat_id,cat_id,sub_cat_name from  itemSubCategories where isActive!=2 and   store_id="${results.store_id}" order by id desc`
    );
    console.log("itemSubCategoriesArr::", itemSubCategoriesArr);


    for (const itemSubCategories of itemSubCategoriesArr) {

      var storeProductSubCatExits = await models.StoreProductSubCategory.findOne({
        where: {
          store_id: results.store_id,
          product_cat_id: itemSubCategories.cat_id,
          product_sub_cat_id: itemSubCategories.sub_cat_id,
        },
      });
      console.log("storeProductSubCatExits::", storeProductSubCatExits);

      if (storeProductSubCatExits) {


        var [singleProductSubCat] = await models.sequelize.query(
          `
          SELECT 
            t1.store_id,t1.product_id 
          FROM
            productSubCategories t1 
          JOIN
            products t2 on t2.id = t1.product_id 
          WHERE
            t2.isActive!=2 
          AND
            t1.isActive!=2 
          AND
            t1.store_id = "${results.store_id}" 
          AND
            t1.product_sub_cat_id = ${itemSubCategories.sub_cat_id} 
          ORDER BY t2.id ASC
          `
        );

        if (singleProductSubCat.length > 0) {

          console.log("subCatId:", itemSubCategories.sub_cat_id);

          console.log("singleProductSubCat", singleProductSubCat);

          var [productGalleryArr2] = await models.sequelize.query(
            `SELECT product_img from productGalleries where store_id=${results.store_id} and product_id = ${singleProductSubCat[0].product_id} order by id asc limit  1`
            // `SELECT product_img from productGalleries t1 join products t2 on t2.id=t1.product_id where t2.isActive!=2 and  t1.store_id=${results.store_id} order by t1.id asc  limit 1`
          );
          console.log(productGalleryArr2);

          //return false;
          if (productGalleryArr2.length > 0) {
            if (productGalleryArr2[0].product_img) {
              var imgProduct2 = productGalleryArr2[0].product_img;
            } else {
              var imgProduct2 =
                "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg";
            }
          } else {
            var imgProduct2 =
              "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg";
          }



          const SubcatData = {
            store_id: results.store_id,
            cat_id: itemSubCategories.cat_id,
            sub_cat_id: itemSubCategories.sub_cat_id,
            sub_cat_name: itemSubCategories.sub_cat_name,
            // sub_cat_name: "Testing",
            // firstProduct_IMG: productGalleryArr[0].product_img,
            firstProduct_IMG: imgProduct2,
          };
          storeSubCatArrData.push(SubcatData);

        }


      }


    }

    // get item categories if product is added in it
    // get item sub categories if product is added in it
    // get item sub categories if product is added in it

    const data = {
      store_cat: storeCatArrData,
      subcat: storeSubCatArrData,
      //firstProduct_IMG: productGalleryArr[ 0 ].product_img,
      // storeProductCatExits:a
    };

    console.log(data, "<==");

    let message = "List of category of stores";
    let message_code = "UserController:userRequestItemAccepted-01";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    const productColorArrData = [];
    const productSizeArrData = [];
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.getStoreCategoriesOK = async (req, reply) => {
  try {
    const results = await getStoreCategoriesSchemaA.validateAsync(req.body);

    const resultsdata = await models.StoreProduct.findOne({
      where: { store_id: results.store_id },
    });

    //get first product img
    var [productGalleryArr] = await models.sequelize.query(
      `SELECT product_img from productGalleries t1 where t1.store_id=${results.store_id} and product_id=${resultsdata.id} limit 1`
    );
    // console.log();

    if (productGalleryArr[0].product_img) {
      var imgProduct = productGalleryArr[0].product_img;
    } else {
      var imgProduct =
        "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg";
    }

    //get first product img
    var [itemCategoriesArr] = await models.sequelize.query(
      `SELECT id as cat_id,item_cat_name from  itemCategories where  store_id="${results.store_id}" order by id DESC`
    );

    const storeSubCatArrData = new Array();
    const storeCatArrData = [];
    for (const itemCategories of itemCategoriesArr) {
      // console.log(itemCategories.cat_id);
      var storeProductCatExits = await models.StoreProductCategory.findOne({
        where: {
          store_id: results.store_id,
          cat_id: itemCategories.cat_id,
        },
      });

      if (storeProductCatExits) {
        const catData = {
          store_id: results.store_id,
          cat_id: itemCategories.cat_id,
          item_cat_name: itemCategories.item_cat_name,
          // firstProduct_IMG: productGalleryArr[0].product_img,
          firstProduct_IMG: imgProduct,
        };
        storeCatArrData.push(catData);
      }
    }

    // get item categories if product is added in it

    var [itemSubCategoriesArr] = await models.sequelize.query(
      `SELECT id as sub_cat_id,cat_id,sub_cat_name from  itemSubCategories where  store_id="${results.store_id}" order by id desc`
    );

    for (const itemSubCategories of itemSubCategoriesArr) {
      const SubcatData = {
        store_id: results.store_id,
        cat_id: itemSubCategories.cat_id,
        sub_cat_id: itemSubCategories.sub_cat_id,
        sub_cat_name: itemSubCategories.sub_cat_name,
        // sub_cat_name: "Testing",
        // firstProduct_IMG: productGalleryArr[0].product_img,
        firstProduct_IMG: imgProduct,
      };
      storeSubCatArrData.push(SubcatData);
    }

    // get item categories if product is added in it
    // get item sub categories if product is added in it
    // get item sub categories if product is added in it

    const data = {
      store_cat: storeCatArrData,
      subcat: storeSubCatArrData,
      //firstProduct_IMG: productGalleryArr[ 0 ].product_img,
      // storeProductCatExits:a
    };

    let message = "List of category of stores";
    let message_code = "UserController:userRequestItemAccepted-01";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    const productColorArrData = [];
    const productSizeArrData = [];
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.getProductListStoreByCategories = async (req, reply) => {
  try {
    const results = await getStoreCategoriesSchema.validateAsync(req.body);
    var cat_id = results.cat_id;
    var subcat_id = results.subcat_id;
    const storeAll = [];
    var storeRecord = await models.Store.findOne({
      where: {
        id: results.store_id,
      },
    });
    var storeTimigRecord = await models.StoreTiming.findOne({
      where: {
        store_id: results.store_id,
      },
    });
    const storeXData = {
      store: storeRecord,
      storeTiming: storeTimigRecord,
    };

    storeAll.push(storeXData);
    //====================================
    const productArrData = [];
    if (results.cat_id != "" && results.subcat_id != "") {
      //get all product who have cat id and sub cat id
      var [productSubCatRecordArr] = await models.sequelize.query(
        `SELECT product_id  from  productSubCategories where isActive!=2 and product_cat_id="${cat_id}" and product_sub_cat_id="${subcat_id}" order by id desc`
      );
      //product list
      // console.log(productSubCatRecordArr);
      // return false;

      for (const productSubCatRecord of productSubCatRecordArr) {
        var productArrDataValue = await models.StoreProduct.findOne({
          where: {
            store_id: results.store_id,
            id: productSubCatRecord.product_id,
            isActive: {
              [Op.ne]: 2,
            },
          },
        });

        var storeRecord = await models.Store.findOne({
          where: {
            id: results.store_id,
          },
        });
        if (productArrDataValue) {
          const productD = {
            id: productArrDataValue.id,
            store_id: productArrDataValue.store_id,
            product_title: productArrDataValue.product_title,
            product_infomation: productArrDataValue.product_infomation,
            product_photo: productArrDataValue.product_photo,
            product_qty: productArrDataValue.product_qty,
            regular_price: productArrDataValue.regular_price,
            extra_price: productArrDataValue.extra_price,
            total_price: productArrDataValue.total_price,
            createdAt: productArrDataValue.createdAt,
            updatedAt: productArrDataValue.updatedAt,
            store_name: storeRecord.store_name,
            store_photo: storeRecord.store_photo,
          };

          console.log("productSubCatRecord.product_id;;;", productSubCatRecord.product_id);

          var [productColorArr] = await models.sequelize.query(
            `
            SELECT 
              t2.attr_name as name,attr_code as code 
            FROM
             product_colors t1 
            JOIN
             attributeValueMasters t2 
            ON
             t1.color_id=t2.attr_value 
            WHERE
             t1.store_id=${results.store_id} 
            AND
             t2.store_id=${results.store_id} 
            AND
             t1.product_id=${productSubCatRecord.product_id} 
            AND
             t2.isActive = 1 
            AND
             t2.attr_id=1
            `
          );
          var [productSizeArr] = await models.sequelize.query(
            `SELECT 
              t2.attr_name as size 
            FROM
             product_sizes t1 
            JOIN
             attributeValueMasters t2 
            ON
             t1.size_id=t2.attr_value 
            WHERE 
              t1.store_id=${results.store_id} 
            AND
             t2.store_id=${results.store_id} 
            AND
             t2.store_id=${results.store_id} 
            AND
             t1.product_id=${productSubCatRecord.product_id} 
            AND
             t2.isActive = 1
            AND
             t2.attr_id=2`
          );


          let qtyCount = 0;

          for (const getProdctSize of productSizeArr) {

            // console.log("getProdctSize::", getProdctSize);
            console.log("productSubCatRecord.product_id;;;", productSubCatRecord.product_id);

            const productStock = await models.manageProductSize.findOne(
              {
                where: {
                  store_id: results.store_id,
                  product_id: productSubCatRecord.product_id,
                  size: getProdctSize.size,
                }
              }
            );
            // console.log("QTY:::", productStock);

            if (productStock == null) {

              qtyCount = qtyCount + productSubCatRecord.product_qty

            } else {

              qtyCount = qtyCount + productStock.qty

            }


          }

          if (qtyCount < 1) {

            var productSizeArr = [];
            // console.log("productSizeArrInsideOfQty::", productSizeArr);

          }


          //console.log(productSizeArr);
          var [productGalleryArr] = await models.sequelize.query(
            `
            SELECT
             product_img 
            FROM
             productGalleries t1 
            WHERE
             t1.store_id=${results.store_id} 
            AND
             product_id=${productSubCatRecord.product_id} 
            AND
             t1.isActive = 1
            `
          );

          //******************* */
          // var storeIDProduct =
          //   await models.UserProductItemRequetAcceptedStore.findOne({
          //     where: {
          //       store_id: results.store_id,
          //       user_id: results.user_id,
          //       product_id: productSubCatRecord.product_id,
          //       status: {
          //         [Op.ne]: [4, 10]
          //       },
          //     },
          //   });

          var [storeIDProduct] = await models.sequelize.query(
            `
            SELECT * FROM users_product_store_accepteds WHERE user_id = ${results.user_id} AND store_id = ${results.store_id} AND product_id = ${productSubCatRecord.product_id} AND status NOT IN (4,10)
            `
          )

          var storeIDProductCart = await models.UserAddTCart.findOne({
            where: {
              store_id: results.store_id,
              user_id: results.user_id,
              product_id: productSubCatRecord.product_id,
            },
          });

          let hideRequest = 0;
          let hideCart = 0;

          if (storeIDProduct[0] == null) {
            hideRequest = 0;
          } else {
            hideRequest = 1;
          }

          if (storeIDProductCart) {
            hideCart = 1;
          } else {
            hideCart = 0;
          }

          const [soldOut] = await models.sequelize.query(
            `SELECT * FROM  productSoldOuts WHERE  store_id = ${results.store_id} AND product_id = ${productSubCatRecord.product_id} AND isActive!=2`
          );
          console.log("soldOut", soldOut[0]);

          //******************* */

          if (qtyCount < 1) {
          } else {

            if (soldOut[0] == undefined) {

              const productData = {
                product: productD,
                productColor: productColorArr,
                productSizes: productSizeArr,
                productGalleries: productGalleryArr,
                hideCart: hideCart,
                hideRequest: hideRequest,
                soldOut: 0
              };
              productArrData.push(productData);

            } else {

              const productData = {
                product: productD,
                productColor: productColorArr,
                productSizes: productSizeArr,
                productGalleries: productGalleryArr,
                hideCart: hideCart,
                hideRequest: hideRequest,
                soldOut: 1
              };
              productArrData.push(productData);

            }
          }


        }
      }
      //product list

      //get all product who have cat id and sub cat id
    } else {
      //show all product if not cat id and sub cat id is not
      // var productsAllArr = await models.StoreProduct.findAll({
      //   where: {
      //     store_id: results.store_id,
      //   },
      // });
      var [productsAllArr] = await models.sequelize.query(
        `
        SELECT
         t2.store_name, t2.store_photo, t1.* 
        FROM
         products t1 
        JOIN
         stores t2 
        ON
         t1.store_id = t2.id 
        WHERE
         t1.isActive!=2 
        AND
         t1.store_id="${results.store_id}" 
        ORDER BY id desc
        `
      );
      // console.log("productsAllArr:", productsAllArr);
      console.log("results.store_id:", results.store_id);

      // console.log(productsAll)
      //add all product in array
      for (const productSubCatRecord of productsAllArr) {
        var productArrDataValue = await models.StoreProduct.findOne({
          where: {
            store_id: results.store_id,
            id: productSubCatRecord.id,
            isActive: {
              [Op.ne]: 2,
            },
          },
        });
        console.log("productArrDataValue:", productArrDataValue);
        console.log("productSubCatRecord.id:", productSubCatRecord.id);


        var [productColorArr] = await models.sequelize.query(
          `
          SELECT
           t2.attr_name as name,attr_code as code 
          FROM
           product_colors t1 
          JOIN
           attributeValueMasters t2 
          ON
           t1.color_id=t2.attr_value 
          WHERE
           t1.store_id=${results.store_id} 
          AND
           t2.store_id=${results.store_id} 
          AND
           t1.product_id=${productSubCatRecord.id} 
          AND
           t2.isActive = 1
          AND
           t2.attr_id=1
          `
        );
        console.log("productColorArr:", productColorArr);

        var [productSizeArr] = await models.sequelize.query(
          `
          SELECT
           t2.attr_name as size 
          FROM
           product_sizes t1 
          JOIN
           attributeValueMasters t2 
          ON
           t1.size_id = t2.attr_value
          WHERE
           t1.store_id=${results.store_id} 
          AND
           t2.store_id = ${results.store_id} 
          AND
           t2.store_id = ${results.store_id} 
          AND
           t1.product_id=${productSubCatRecord.id} 
          AND
           t2.isActive = 1
          AND
           t2.attr_id=2
          `
        );
        console.log("productSizeArr:", productSizeArr);

        let qtyCount = 0;

        for (const getProdctSize of productSizeArr) {

          console.log("getProdctSize::", getProdctSize);

          console.log("dattttttt;;;", results.store_id, productSubCatRecord.id, getProdctSize.size);

          const productStock = await models.manageProductSize.findOne(
            {
              where: {
                store_id: results.store_id,
                product_id: productSubCatRecord.id,
                size: getProdctSize.size,
              }
            }
          );
          console.log("QTY:::", productStock);

          if (productStock == null) {

            qtyCount = qtyCount + productSubCatRecord.product_qty

          } else {

            qtyCount = qtyCount + productStock.qty

          }


        }

        if (qtyCount < 1) {

          var productSizeArr = [];
          console.log("productSizeArrInsideOfQty::", productSizeArr);

        }


        // console.log(productSizeArr);
        var [productGalleryArr] = await models.sequelize.query(
          `
          SELECT
           product_img 
          FROM
           productGalleries t1 
          WHERE
           t1.store_id = ${results.store_id} 
          AND
           product_id = ${productSubCatRecord.id} 
          AND
           t1.isActive = 1
          `
        );
        console.log("productGalleryArr:", productGalleryArr);

        //******************* */
        // var storeIDProduct =
        //   await models.UserProductItemRequetAcceptedStore.findOne({
        //     where: {
        //       store_id: results.store_id,
        //       // user_id: user_id,
        //       user_id: results.user_id,
        //       product_id: productSubCatRecord.id,
        //       status: {
        //         [Op.ne]: [4, 10]
        //       },
        //     },
        //   });
        // console.log("storeIDProduct:", storeIDProduct);

        var [storeIDProduct] = await models.sequelize.query(
          `
          SELECT * FROM users_product_store_accepteds WHERE user_id = ${results.user_id} AND store_id = ${results.store_id} AND product_id = ${productSubCatRecord.id} AND status NOT IN (4,10)
          `
        )

        var storeIDProductCart = await models.UserAddTCart.findOne({
          where: {
            store_id: results.store_id,
            //user_id: user_id,
            user_id: results.user_id,
            product_id: productSubCatRecord.id,
          },
        });
        console.log("storeIDProductCart:", storeIDProductCart);

        let hideRequest = 0;
        let hideCart = 0;

        if (storeIDProduct[0] == null) {
          hideRequest = 0;
        } else {
          hideRequest = 1;
        }

        if (storeIDProductCart) {
          hideCart = 1;
        } else {
          hideCart = 0;
        }

        console.log(`product_id = ${productSubCatRecord.id}`);
        const [soldOut] = await models.sequelize.query(
          `SELECT * FROM  productSoldOuts WHERE  store_id = ${results.store_id} AND product_id = ${productSubCatRecord.id} AND isActive!=2`
        );
        console.log("soldOut", soldOut);

        //******************* */

        if (qtyCount < 1) {
        } else {

          if (soldOut[0] == undefined) {

            const productData = {
              product: productSubCatRecord,
              productColor: productColorArr,
              productSizes: productSizeArr,
              productGalleries: productGalleryArr,
              hideCart: hideCart,
              hideRequest: hideRequest,
              soldOut: 0,
            };
            productArrData.push(productData);

          } else {

            const productData = {
              product: productSubCatRecord,
              productColor: productColorArr,
              productSizes: productSizeArr,
              productGalleries: productGalleryArr,
              hideCart: hideCart,
              hideRequest: hideRequest,
              soldOut: 1,
            };
            productArrData.push(productData);

          }

        }


      }
      //product list
      //add all product in array

      //show all product if not cat id and sub cat id is not
    }
    //===========================

    const storeWithProductData = {
      stores: storeAll,
      products: productArrData,
    };

    let data = storeWithProductData;
    let message = " cat_id and sub_cat_id wise products and store details";
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";

    let message = err.message;
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//getProductListStoreBySubCategories
exports.getProductListStoreBySubCategories = async (req, reply) => {
  try {
    const results = await getStoreSubCategoriesSchema.validateAsync(req.body);
    var [productDataArrSubCat] = await models.sequelize.query(
      `SELECT id as subcat_id,product_cat_id as cat_id,product_sub_cat_id,product_id from  productSubCategories where  store_id="${results.store_id}" and  product_cat_id="${results.cat_id}" and product_sub_cat_id="${results.cat_id}" `
    );
    const productArrData = [];
    const productColorArrData = [];
    const productSizeArrData = [];

    for (const productArrCatD of productDataArrSubCat) {
      //product
      var [productDataArr] = await models.sequelize.query(
        `SELECT * from  products where  id="${productArrCatD.product_id}"`
      );
      for (const productArr of productDataArr) {
        var [productColorArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${results.store_id} and t2.store_id=${results.store_id} and t1.product_id=${productArr.id} and t2.attr_id=1`
        );
        for (const productColor of productColorArr) {
          //console.log(productColor.attr_name);
          productColorArrData.push(productColor.attr_name);
        }
        var [productSizeArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${results.store_id} and t2.store_id=${results.store_id} and t1.product_id=${productArr.id} and t2.attr_id=2`
        );
        for (const productSize of productSizeArr) {
          //console.log(productColor.attr_name);
          productSizeArrData.push(productSize.attr_name);
        }
        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${results.store_id} and product_id=${productArr.id}`
        );

        const productAll = {
          product: productArr,
          productColor: productColorArrData,
          productSizes: productSizeArrData,
          productGalleries: productGalleryArr,
        };
        productArrData.push(productAll);
      }

      //product
    }

    const DataAccess = {
      categories: productDataArrSubCat,
      products: productArrData,
    };

    let data = DataAccess;
    let message = " err.message";
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";

    let message = err.message;
    let message_code = "UserController:userRequestItemAccepted-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//getProductListStoreBySubCategories

//userDeleteFromCart
exports.userDeleteCartProduct = async (req, reply) => {
  try {
    const results = await userDeleteCartProductScheme.validateAsync(req.body);
    await models.UserAddTCart.destroy({
      where: {
        user_id: results.user_id,
        product_id: results.product_id,
      },
    });

    let data = "";
    let message = "Successfully removed from cart";
    let message_code = "UserController:userDeleteFromCart-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userDeleteCartProduct-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userDeleteFromCart

exports.userRequestItemMultiple = async (req, reply) => {
  try {
    const results = await userRequestItemMulipleSchema.validateAsync(req.body);
    var requestedProductArrData =
      await models.UserProductItemRequetAcceptedStore.findAll({
        attributes: ["store_id", "req_id"],
        where: {
          user_id: results.user_id,
        },
        group: ["store_id"],
      });

    const productsDaval = [];
    for (const productArrData of requestedProductArrData) {
      //get all request by user to
      var requestedArr =
        await models.UserProductItemRequetAcceptedStore.findAll({
          attributes: ["store_id", "req_id", "status"],
          where: {
            store_id: productArrData.store_id,
            user_id: results.user_id,
          },
          group: ["req_id"],
        });

      //get all product by request id
      for (const requestID of requestedArr) {
        // console.log(requestID);
        var requestedProductArr =
          await models.UserProductItemRequetAcceptedStore.findAll({
            where: {
              req_id: requestID.req_id,
            },
          });
        const productsArrDataMuliple = [];
        //add all product of store with respective request id
        for (const productArr of requestedProductArr) {
          //console.log(productArr);
          var [productArrDataValue] = await models.sequelize.query(
            `SELECT t1.*, t2.store_name,t2.store_photo from  products t1 join stores t2 on t1.store_id = t2.id where t1.isActive!=2 and  t1.store_id="${productArr.store_id}" and t1.id=${productArr.product_id}`
          );
          var [productColorArr] = await models.sequelize.query(
            `SELECT t2.attr_name as name,attr_code as code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${productArr.store_id}  and t2.store_id=${productArr.store_id} and t1.product_id=${productArr.product_id} and t2.attr_id=1`
          );
          var [productSizeArr] = await models.sequelize.query(
            `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${productArr.store_id}  and t2.store_id=${productArr.store_id} and t1.product_id=${productArr.product_id} and t2.attr_id=2`
          );
          var [productGalleryArr] = await models.sequelize.query(
            `SELECT product_img from productGalleries t1 where t1.store_id=${productArr.store_id} and product_id=${productArr.product_id}`
          );
          const productAll = {
            product: productArrDataValue[0],
            productColor: productColorArr,
            productSizes: productSizeArr,
            productGalleries: productGalleryArr,
          };
          productsArrDataMuliple.push(productAll);
        }
        var storeRecord = await models.Store.findOne({
          where: {
            id: productArrData.store_id,
          },
        });
        const forStoreData = {
          reqId: requestID.req_id,
          isAccepted: requestID.status,
          store_id: storeRecord.id,
          store_name: storeRecord.store_name,
          store_photo: storeRecord.store_photo,
          productDetails: productsArrDataMuliple,
        };
        productsDaval.push(forStoreData);

        //add all product of store with respective request id
      }

      //get all product by request id
    }

    let data = productsDaval;
    let message = "get a5ll request items";
    let message_code = "UserController:userDeleteFromCart-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userRequestItemMuliple-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//userRequestItemMuliple

exports.userRequested = async (req, reply) => {
  try {
    const result = await userRequestItemMulipleSchema.validateAsync(req.body);
    console.log("results", result.user_id);

    const productDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
      {
        where: {
          user_id: result.user_id
        },
        group: ['req_id'],
        order: [["status", "DESC"], ["id", "DESC"]]
      }
    );
    console.log("productDataArr-length------::", productDataArr);

    const response = [];
    // for (const fProductData of productDataArr) {
    // console.log("fProductDataStoreId::", fProductData.store_id);

    // var requestProductData = await models.UserProductItemRequetAcceptedStore.findAll(
    //   {
    //     where: {
    //       store_id: fProductData.store_id,
    //       user_id: fProductData.user_id
    //     },
    //     group: ["req_id"],
    //     order: [["status", "DESC"]],
    //   }
    // );
    // console.log("result.user_id::", result.user_id);
    // console.log("productDataArr.store_id::", productDataArr.store_id);

    // var [requestProductData] = await models.sequelize.query(
    //   `
    //     SELECT * FROM users_product_store_accepteds WHERE user_id=${result.user_id} AND store_id = ${productDataArr[0].store_id} GROUP BY req_id ORDER BY users_product_store_accepteds.status DESC, id DESC
    //     `
    // );
    // console.log("requestProductData::", requestProductData);

    // ----- get all productData by request id ----- //
    for (const requestID of productDataArr) {
      // console.log("requestIDStoreId",requestID.store_id);

      var requestProductArrData = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            req_id: requestID.req_id
          }
        }
      )

      const productDataResponse = [];
      for (const productRData of requestProductArrData) {
        console.log("productRDataStoreId::;", productRData.store_id);
        console.log("productRDataProductId::;", productRData.product_id);

        const [productData] = await models.sequelize.query(
          `
          SELECT t2.store_name,t2.store_photo,t2.store_logo, t2.store_lat, t2.store_long, t1.* from  products t1 join stores t2 on t1.store_id = t2.id where  t1.store_id="${productRData.store_id}" and t1.id=${productRData.product_id}
          `
        );
        console.log("productData::", productData);

        const productColorData = [
          {
            "name": productRData.color,
            "code": productRData.color
          }
        ]

        const productSizeData = [
          {
            "size": productRData.size
          }
        ]

        const [productGalleryData] = await models.sequelize.query(
          `
          SELECT product_img FROM productGalleries WHERE store_id = ${productRData.store_id} AND product_id = ${productRData.product_id} AND isActive = 1
          `
        )

        if (productData.length > 0) {
          const productresponse = {
            product: productData[0],
            productColor: productColorData,
            productSizes: productSizeData,
            productGalleries: productGalleryData
          }
          productDataResponse.push(productresponse)
        }

      }

      const forStoreData = await models.Store.findOne(
        {
          where: {
            id: requestID.store_id
          }
        }
      )

      const storeDataResponse = {
        reqId: requestID.req_id,
        isAccepted: requestID.status,
        store_id: forStoreData.id,
        store_name: forStoreData.store_name,
        store_photo: forStoreData.store_photo,
        store_logo: forStoreData.store_logo,
        productDetails: productDataResponse
      }
      response.push(storeDataResponse)
      console.log("storeDataResponse::", response.length);
    }
    // ----- get all productData by request id ----- //

    // }

    let data = response;
    let message = "get all request items";
    let message_code = "UserController:userDeleteFromCart-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userRequestItemMuliple-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//userRequestItemMuliple

//getStoreDetailbyProductID
exports.getStoreDetailbyID = async (req, reply) => {
  try {
    const results = await getStoreDetailbyIDSchema.validateAsync(req.body);
    console.log("results::", results);

    var storeRecord = await models.Store.findOne({
      where: {
        id: results.store_id,
      },
    });
    console.log("storeRecord::", storeRecord); 5876


    var storeTimigRecord = await models.StoreTiming.findOne({
      where: {
        store_id: results.store_id,
      },
    });
    console.log("storeTimigRecord::", storeTimigRecord);

    const [getProduct] = await models.sequelize.query(
      `SELECT * from storeCategories where store_id =${results.store_id}`
    );
    console.log("StoreCatArrData::", getProduct);

    if (getProduct.length > 0) {
      var catName = getProduct[0].cat_name
      if (getProduct[0].product_photo) {
        var catImage = getProduct[0].product_photo
      } else {
        var catImage = "https://res.cloudinary.com/dcsey44sc/image/upload/v1669430551/iaccess/iaccess1669430551441.jpg"
      }
    } else {
      var catImage = "https://res.cloudinary.com/dcsey44sc/image/upload/v1669430551/iaccess/iaccess1669430551441.jpg"
      var catName = "iAccess Product"
    }


    const responseData = {
      id: storeRecord.id,
      store_name: storeRecord.store_name,
      store_address: storeRecord.store_address,
      username: storeRecord.username,
      password: storeRecord.password,
      email: storeRecord.email,
      phoneCode: storeRecord.phoneCode,
      phoneNumber: storeRecord.phoneNumber,
      phone: storeRecord.phone,
      wallet: storeRecord.wallet,
      store_photo: storeRecord.store_photo,
      store_logo: storeRecord.store_logo,
      category_image: catImage,
      category_name: catName,
      role: storeRecord.role,
      securiy_pin: storeRecord.securiy_pin,
      phoneVerify: storeRecord.phoneVerify,
      lastLoginAt: storeRecord.lastLoginAt,
      store_lat: storeRecord.store_lat,
      store_long: storeRecord.store_long,
      fcm_token: storeRecord.fcm_token,
      deviceType: storeRecord.deviceType,
      isActive: storeRecord.isActive,
      country_name: storeRecord.country_name,
      state_name: storeRecord.state_name,
      city_name: storeRecord.city_name,
      status: storeRecord.status,
      createdAt: storeRecord.createdAt,
      updatedAt: storeRecord.updatedAt
    }


    const storeXData = {
      store: responseData,
      storeTiming: storeTimigRecord,
    };

    let data = storeXData;
    let message = "";
    let message_code = "UserController:getStoreDetailbyID-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userRequestItemMuliple-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//getStoreDetailbyProductID

//deleteRequestByUser
exports.deleteRequestByUser = async (req, reply) => {
  try {
    const results = await deleteRequestByUserSchema.validateAsync(req.body);

    // const usersProductStoreAcceptedsData = await models.UserProductItemRequetAcceptedStore.findOne(
    //   {
    //     where: {
    //       req_id: results.req_id,
    //       user_id: results.user_id,
    //     }
    //   }
    // )
    // console.log("usersProductStoreAcceptedsData::",usersProductStoreAcceptedsData.product_id);

    // const getManageProductSizeData = await models.manageProductSize.findOne(
    //   {
    //     where: {
    //       product_id: usersProductStoreAcceptedsData.product_id
    //     }
    //   }
    // )
    // console.log("getManageProductSizeData::",getManageProductSizeData);

    // const updateManageProductSizeData = await models.manageProductSize.update(
    //   {
    //     qty: parseInt(getManageProductSizeData.qty) + 1
    //   },
    //   {
    //     where: {
    //       product_id: usersProductStoreAcceptedsData.product_id,
    //       store_id: usersProductStoreAcceptedsData.store_id
    //     }
    //   }
    // );
    // console.log("updateManageProductSizeData::",updateManageProductSizeData);

    const dataA = await models.UserProductItemRequetAcceptedStore.destroy({
      where: {
        req_id: results.req_id,
        user_id: results.user_id,
      },
    });
    console.log("dataA::", dataA);

    const deleteRequest = await models.finalRequestByUser.destroy({
      where: {
        req_id: results.req_id,
        user_id: results.user_id,
      },
    });
    console.log("deleteRequest::", deleteRequest);

    const getRequestQueueData = await models.requestQueue.findOne(
      {
        where: {
          req_id: results.req_id,
          user_id: results.user_id,
        }
      }
    )
    console.log("getRequestQueueData::", getRequestQueueData);

    if (getRequestQueueData == null) {

    } else {

      const deleteRequestQueue = await models.requestQueue.destroy(
        {
          where: {
            req_id: results.req_id,
            user_id: results.user_id,
          }
        }
      )

    }


    let data = dataA;
    let message = "Deleted requested";
    let message_code = "deleteRequestByUser:deleteRequestByUser-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userRequestItemMuliple-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//deleteRequestByUser

//deleteRequestByStore
exports.deleteRequestByStore = async (req, reply) => {
  try {
    const results = await deleteRequestByStoreSchema.validateAsync(req.body);
    const dataA = await models.UserProductItemRequetAcceptedStore.destroy({
      where: {
        store_id: results.store_id,
        req_id: results.req_id,
      },
    });

    let data = dataA;
    let message = "Deleted requested";

    let message_code = "UserController:getStoreDetailbyID-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let data = "opps!";
    let message = err.message;
    let message_code = "UserController:userRequestItemMuliple-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//deleteRequestByStore


// --- userList ---
exports.userList = async (req, replay) => {
  try {
    const result = await userListSchema.validateAsync(req.body);
    const user = await models.User.findOne({
      where: {
        id: result.user_id
      }
    });
    console.log("user", user);
    if (user == null) {

      let message = "user not exist";
      let message_code = "UserController:userLogin-017";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );

      // console.log("error==>", error);
      // let data = "opps";
      // let message = error.message;
      // let message_code = "UserController:userRequestItemMuliple-02";
      // let message_action = "catched Error:";
      // let api_token = "";
      // return Api.setErrorResponse(
      //   data,
      //   message,
      //   message_code,
      //   message_action,
      //   api_token
      // );
    } else {

      const [userDetail] = await models.sequelize.query(
        `SELECT id, avatar, firstName as username  FROM users`
      )

      console.log("userDetail", userDetail);


      let data = userDetail;
      let message = "User List Get";
      let message_code = "UserController:getUserListById-02";
      let message_action = "catched Error:";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );
    }
  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:userRequestItemMuliple-03";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End userList ---


// --- addUserCardDetails ---
exports.addUserCardDetails = async (req, reply) => {
  try {

    const userData = await addUserCardDetailsSchema.validateAsync(req.body);
    console.log("userData::", userData);

    const insertDetails = await models.userCardDetails.create(
      {
        user_id: userData.user_id,
        holderName: userData.holderName,
        cardNumber: userData.cardNumber,
        cardExpiryDate: userData.cardExpiryDate,
        cvvNumber: parseInt(userData.cvvNumber),
        cardType: userData.cardType,
        zipcode: userData.zipcode,
        cardService: userData.cardService
      }
    );
    console.log("insertDetails::", insertDetails);

    let message = "userCard Details Inserted";
    let message_code = "UserController:addUserCardDetails-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      insertDetails,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:addUserCardDetails-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End addUserCardDetails ---


// --- getUserCardDetails ---
exports.getCardDetailsByUserId = async (req, reply) => {
  try {

    const result = await getCardDetailsByUserIdSchema.validateAsync(req.body);
    console.log("result::", result);

    const getDefaultCardDetails = await models.userCardDetails.findOne(
      {
        where: {
          user_id: result.user_id,
          defaultCard: 1
        }
      }
    );
    console.log("getCardDetails::", getCardDetails);

    const getCardDetails = await models.userCardDetails.findAll(
      {
        where: {
          user_id: result.user_id,
          defaultCard: 0
        }
      }
    );

    const response = {
      DefaultCard: getDefaultCardDetails,
      otherCard: getCardDetails,
    }



    let message = "Get User Card Details";
    let message_code = "UserController:getCardDetailsByUserId-02";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      response,
      message,
      message_code,
      message_action,
      api_token
    );


  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getCardDetailsByUserId-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- getUserCardDetails ---


// --- deleteUserCardDetails ---
exports.deleteUserCardDetails = async (req, reply) => {
  try {

    const result = await deleteUserCardDetailsSchema.validateAsync(req.body);
    console.log("Data:", result);

    const deleteCardDetails = await models.sequelize.query(
      `
      DELETE FROM userCardDetails WHERE id = ${result.card_id} AND user_id = ${result.user_id}
      `
    );

    let message = "user deleted succe";
    let message_code = "UserController:deleteUserCardDetails-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:deleteUserCardDetails-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End deleteUserCardDetails ---


// --- defaultCardUser ---
exports.defaultCardUser = async (req, reply) => {
  try {

    const result = await defaultCardUserSchema.validateAsync(req.body);
    console.log("Data:", result);

    const setDefaultCard = await models.userCardDetails.update(
      {
        defaultCard: 1
      },
      {
        where: {
          id: result.card_id,
          user_id: result.user_id,
        }
      }
    );
    let message = `card set as default card`;
    let message_code = "UserController:defaultCardUser-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      setDefaultCard,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:defaultCardUser-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End defaultCardUser ---


// --- addAmountInWallet ---
// exports.addAmountInWallet = async (req, reply) => {
//   try {
//     const data = await addAmountInWalletSchema.validateAsync(req.body);
//     console.log("Data:", data);

//     const addWalletAmount = await models.User.findOne(
//       {
//         where: {
//           id: data.user_id
//         }
//       }
//     );
//     console.log("addWalletAmount:", addWalletAmount);

//     const getCardDetails = await models.userCardDetails.findOne(
//       {
//         where: {
//           id: data.card_id
//         }
//       }
//     );
//     console.log("getCardDetails:", getCardDetails);

//     // const b = getCardDetails.cvvNumber;
//     const finalCardNumber = parseInt(getCardDetails.cardNumber);
//     const finalCvvNumber = getCardDetails.cvvNumber;

//     console.log("finalCardNumber:", finalCardNumber, typeof finalCardNumber);
//     console.log("finalCvvNumber:", finalCvvNumber, typeof finalCvvNumber);

//     const customer = await stripe.customers.create({
//       email: addWalletAmount.email,
//       name: addWalletAmount.firstName
//     });
//     console.log("customer:", customer);

//     const paymentMethod = await stripe.paymentMethods.create(
//       {
//         type: 'card',
//         card: {
//           number: finalCardNumber,
//           exp_month: 2,
//           exp_year: 2026,
//           cvc: finalCvvNumber,
//         },
//       }
//     );
//     console.log("paymentMethod:", paymentMethod);


//     const addAmount = data.walletAmount;

//     const paymentIntent = await stripe.paymentIntents.create({
//       payment_method_types: ['card'],
//       description: 'Software development services',
//       amount: addAmount * 100,
//       currency: "inr",
//       customer: `${customer.id}`,
//       payment_method: `${paymentMethod.id}`,
//       off_session: true,
//       confirm: true,
//     }).then(async () => {

//       console.log("Succefull");

//       const totalAmount = parseInt(addWalletAmount.walletAmount) + parseInt(addAmount);

//       const updateData = await models.User.update(
//         {
//           walletAmount: totalAmount
//         },
//         {
//           where: {
//             id: data.user_id
//           }
//         }
//       );
//       console.log("updateData:", updateData);

//       const getUserData = await models.User.findOne(
//         {
//           where: {
//             id: data.user_id
//           }
//         }
//       )

//       const insertDataInTrasaction = await models.Transaction.create(
//         {
//           user_id: data.user_id,
//           type: 2,
//           transactions: addAmount,
//           status: 14,
//           message: `You’ve added ${addAmount} on your wallet using this card ${finalCardNumber}`
//         }
//       );
//       console.log("insertDataInTrasaction::;", insertDataInTrasaction);

//       let message = `add amount in wallet`;
//       let message_code = "UserController:addAmountInWallet-01";
//       let message_action = "Get back to login or Get started screen";
//       let api_token = "";
//       return Api.setSuccessResponse(
//         message,
//         message_code,
//         message_action,
//         api_token
//       );

//     }).catch((err) => {
//       console.log("error==>", err);
//       let message = "money not add";
//       let message_code = "UserController:userLogin-017";
//       let message_action = "username is not exist";
//       let api_token = "";
//       return Api.setWarningResponse(
//         [],
//         message,
//         message_code,
//         message_action,
//         api_token
//       );
//     })

//     console.log("paymentIntent:::", paymentIntent);

//     if (paymentIntent.code == 200) {
//       let message = `add amount in wallet`;
//       let message_code = "UserController:addAmountInWallet-01";
//       let message_action = "Get back to login or Get started screen";
//       let api_token = "";
//       return Api.setSuccessResponse(
//         message,
//         message_code,
//         message_action,
//         api_token
//       );
//     } else {
//       let message = "money not add";
//       let message_code = "UserController:userLogin-017";
//       let message_action = "username is not exist";
//       let api_token = "";
//       return Api.setWarningResponse(
//         [],
//         message,
//         message_code,
//         message_action,
//         api_token
//       );
//     }

//   } catch (error) {
//     console.log("error==>", error);
//     let data = "opps";
//     let message = error.message;
//     let message_code = "UserController:addAmountInWallet-02";
//     let message_action = "catched Error:";
//     let api_token = "";
//     return Api.setErrorResponse(
//       data,
//       message,
//       message_code,
//       message_action,
//       api_token
//     );
//   }
// }

exports.addAmountInWallet = async (req, reply) => {
  try {
    const data = await addAmountInWalletSchema.validateAsync(req.body);
    console.log("Data:", data);

    const user = await models.User.findOne({
      where: {
        id: data.user_id
      }
    });
    console.log("User:", user);

    if (!user) {
      // User not found
      let message = "User not found";
      let message_code = "UserController:addAmountInWallet-03";
      let message_action = "User not found";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    }

    // Add the wallet amount to the existing wallet amount in the database
    const updatedUser = await user.increment('walletAmount', {
      by: parseFloat(data.walletAmount)
    });

    console.log("Updated User:", updatedUser);

    let message = `Amount added to wallet`;
    let message_code = "UserController:addAmountInWallet-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "Oops";
    let message = error.message;
    let message_code = "UserController:addAmountInWallet-02";
    let message_action = "Catched Error:";
    let api_token = "";
    return Api.setErrorResponseZero(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}

// --- End addAmountInWallet ---


// --- getUserBalance ---
exports.getUserBalance = async (req, reply) => {
  try {

    const data = await getUserBalanceSchema.validateAsync(req.body);
    console.log("Data::", data);

    const getData = await models.User.findOne(
      {
        where: {
          id: data.user_id
        }
      }
    );
    console.log("getData::", getData.walletAmount);

    const response = {
      name: getData.firstName,
      balance: getData.walletAmount,
    }

    let message = "Get User balance";
    let message_code = "UserController:getUserBalance-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      response,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {

    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getUserBalance-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  }
};
// --- End getUserBalance ---


// --- getTransactionsDetails ---
exports.getTransactionsDetails = async (req, reply) => {
  try {

    const result = await getTransactionsDetailsSchema.validateAsync(req.body);
    console.log("result::", result);

    if (result.driver_id) {

      // const descData = [];

      // const getTrasactionDataByDriverId = await models.Transactions.findAll(
      //   {
      //     where: {
      //       driver_id: result.driver_id
      //     }
      //   }
      // );
      // descData.unshift(getTrasactionDataByDriverId)

      const getTrasactionDataByDriverId = await models.sequelize.query(
        `
        SELECT DISTINCT * FROM transactions WHERE driver_id = ${result.driver_id} ORDER BY createdAt DESC;
        `
      )
      console.log("getTrasactionDataByDriverId::", getTrasactionDataByDriverId);

      let message = "Get User balance";
      let message_code = "UserController:getUserBalance-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        getTrasactionDataByDriverId[0],
        message,
        message_code,
        message_action,
        api_token
      );
    }

    if (result.store_id) {

      const getTransactionDataByStoreId = await models.sequelize.query(
        `
        SELECT DISTINCT * FROM transactions WHERE store_id = ${result.store_id} ORDER BY createdAt DESC;
        `
      );
      console.log("getTransactionDataByStoreId::", getTransactionDataByStoreId);

      let message = "Get User balance";
      let message_code = "UserController:getUserBalance-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        getTransactionDataByStoreId[0],
        message,
        message_code,
        message_action,
        api_token
      );
    }

    if (result.user_id) {
      const getTransactionDataByUserId = await models.sequelize.query(
        `
        SELECT DISTINCT * FROM transactions WHERE user_id = ${result.user_id} ORDER BY createdAt DESC;
        `
      )
      console.log("getTransactionDataByUserId::", getTransactionDataByUserId);

      let message = "Get User balance";
      let message_code = "UserController:getUserBalance-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        getTransactionDataByUserId[0],
        message,
        message_code,
        message_action,
        api_token
      );
    }

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getTransactionsDetails-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
// --- End getTransactionsDetails ---


// --- getBalanceByIds ---
exports.getBalanceByIds = async (req, res) => {
  try {

    const result = await getBalanceByIdsSchema.validateAsync(req.body);
    console.log("result::", result);

    if (result.driver_id) {
      const getDriverData = await models.Driver.findOne(
        {
          where: {
            id: result.driver_id
          }
        }
      );
      console.log("getDriverData::", getDriverData);

      const walletAmount = parseFloat(getDriverData.wallet);

      let message = "Get User balance";
      let message_code = "UserController:getUserBalance-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        walletAmount,
        message,
        message_code,
        message_action,
        api_token
      );
    }

    if (result.store_id) {
      const getStoreData = await models.Store.findOne(
        {
          where: {
            id: result.store_id
          }
        }
      );
      console.log("getStoreData::", getStoreData);

      const walletAmount = parseFloat(getStoreData.wallet)

      let message = "Get User balance";
      let message_code = "UserController:getUserBalance-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        walletAmount,
        message,
        message_code,
        message_action,
        api_token
      );
    }

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getBalanceByIds-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End getBalanceByIds ---


// --- refundMoney ---
exports.refundMoney = async (req, reply) => {
  try {

    const result = await refundMoneySchema.validateAsync(req.body);
    console.log("result::", result);

    const getTransactionData = await models.Transaction.findOne(
      {
        where: {
          req_id: result.req_id,
          user_id: result.user_id,
          store_id: result.store_id,
          product_id: result.product_id
        }
      }
    );
    console.log("getTransactionData::", getTransactionData.product_price);

    const getStoreData = await models.Store.findOne(
      {
        where: {
          id: result.store_id
        }
      }
    );
    console.log("getStoreData::", getStoreData.wallet);

    const getDriverData = await models.Driver.findOne(
      {
        where: {
          id: getTransactionData.driver_id
        }
      }
    );
    console.log("getDriverData::", getDriverData.wallet);

    const storeTotalAmt = parseFloat(getStoreData.wallet) - parseFloat(getTransactionData.product_price);
    console.log("storeTotalAmt::", storeTotalAmt);

    const driverTotalAmt = parseFloat(getDriverData.wallet) - parseFloat(getTransactionData.delivery_price);
    console.log("driverTotalAmt::", driverTotalAmt);

    const updateStoretable = await models.Store.update(
      {
        wallet: storeTotalAmt
      },
      {
        where: {
          id: result.store_id
        }
      }
    );

    const updateDriverTable = await models.Driver.update(
      {
        wallet: driverTotalAmt
      },
      {
        where: {
          id: getTransactionData.driver_id
        }
      }
    );

    const updateStatus = await models.Transaction.update(
      {
        status: 12
      },
      {
        where: {
          id: getTransactionData.id
        }
      }
    );

    let data = "Payment refund successfull"
    let message = "Get User balance";
    let message_code = "UserController:getUserBalance-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );


  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:refundMoney-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- refundMoney ---


// --- relativeProduct ---
exports.relativeProduct = async (req, reply) => {
  try {

    const result = await relativeProductSchema.validateAsync(req.body);
    console.log("result::", result);

    // const getProductData = await models.StoreProduct.findOne(
    //   {
    //     where: {
    //       id: result.product_id
    //     }
    //   }
    // );
    // console.log("getProductData::",getProductData.store_id);

    const getroductCategoriData = await models.StoreProductCategory.findOne(
      {
        where: {
          product_id: result.product_id,
          store_id: result.store_id
        }
      }
    );
    console.log("getroductCategoriData::", getroductCategoriData);

    const getItemCategoriesData = await models.ItemCategoryMaster.findOne(
      {
        where: {
          id: getroductCategoriData.cat_id
        }
      }
    );
    console.log("getItemCategoriesData::", getItemCategoriesData.item_cat_name);

    const getCategoriesName = await models.ItemCategoryMaster.findAll(
      {
        where: {
          item_cat_name: getItemCategoriesData.item_cat_name
        }
      }
    );

    const responseData = [];

    for (const catData of getCategoriesName) {

      const productCateData = await models.StoreProductCategory.findOne(
        {
          where: {
            cat_id: catData.id
          }
        }
      )
      console.log("productCateData::", productCateData.product_id);

      const productDataList = await models.StoreProduct.findAll(
        {
          where: {
            id: productCateData.product_id
          }
        }
      )
      console.log("productDataList::", productDataList);

      responseData.push(...productDataList)

    }

    let data = responseData
    let message = "Get User balance";
    let message_code = "UserController:relativeProduct-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:relativeProduct-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End relativeProduct ---


// --- withdrawByUser ---
exports.withdrawByUser = async (req, reply) => {
  try {

    const result = await withdrawByUserSchema.validateAsync(req.body);
    console.log("result::", result);

    const getUserData = await models.User.findOne(
      {
        where: {
          id: result.user_id
        }
      }
    )
    console.log("getUserData::", getUserData);

    const getCardDetails = await models.userCardDetails.findOne(
      {
        where: {
          id: result.card_id
        }
      }
    )
    console.log("getCardDetails::", getCardDetails);

    console.log("cardNumber:", getCardDetails.cardNumber);
    console.log("cvvNumber:", getCardDetails.cvvNumber);

    finalCardNumber = getCardDetails.cardNumber.toString();
    finalCvvNumber = getCardDetails.cvvNumber.toString();

    const paymentMethod = await stripe.paymentMethods.create(
      {
        type: 'card',
        card: {
          number: finalCardNumber,
          exp_month: 2,
          exp_year: 2026,
          cvc: finalCvvNumber,
        },
      }
    )
    console.log("paymentMethod:", paymentMethod);

    // const bankAccount = await stripe.accounts.createExternalAccount(
    //   'acct_1KwNfXSD7GTrOcxg',
    // );
    // console.log("bankAccount::", bankAccount);


    // const account = await stripe.accounts.create({
    //   type: 'custom',
    //   country: 'IN',
    //   email: 'divubabariya2001@gmail.com',
    //   capabilities: { 
    //     card_payments: {
    //       requested: true
    //     },
    //     transfers: {
    //       requested: true
    //     },
    //   },
    // });
    // console.log("account::",account);

    // const payout = await stripe.payouts.create({
    //   amount: 10,
    //   currency: 'USD',
    // });
    // console.log("Payout::",payout);


    // const transfer = await stripe.transfers.create({
    //   amount: result.amount,
    //   currency: 'inr',
    //   destination: 'acct_1LN8OVCTyqcVtzly'
    // }).then(() => {
    //   console.log("Successful");
    // }).catch((err) => {
    //   console.log("Error::", err);
    // })

    const insertTransaction = await models.Transaction.create(
      {
        store_id: result.store_id,
        type: 2,
        message: `${getStoreData.store_name} withdrawal ${result.amount} from your wallet using this card ${finalCardNumber}`,
        transactions: result.amount,
        status: 13
      }
    );
    console.log("insertTransaction::", insertTransaction);

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:relativeProduct-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End withdrawByUser ---


// --- addCommentByUser ---
exports.addCommentByUser = async (req, reply) => {
  try {

    const result = await addCommentByUserSchema.validateAsync(req.body);
    console.log("result::", result);

    const getUserData = await models.User.findOne(
      {
        where: {
          id: result.user_id
        }
      }
    );

    const insertComment = await models.Comments.create(
      {
        user_id: result.user_id,
        product_id: result.product_id,
        comment: result.comment,
        user_name: getUserData.firstName,
        user_image: getUserData.avatar
      }
    )
    console.log("insertComment::", insertComment);

    let data = insertComment
    let message = "Add User comments";
    let message_code = "UserController:addCommentByUser-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );


  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:addCommentByUser-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End addCommentByUser ---


// --- getCommentsByProductId ---
exports.getCommentsByProductId = async (req, reply) => {
  try {

    const result = await getCommentsByProductIdSchema.validateAsync(req.body);
    console.log("result::", result);

    const getComments = await models.Comments.findAll(
      {
        where: {
          product_id: result.product_id
        },
        order: [["createdAt", "DESC"]]
      }
    );
    console.log("getComments::", getComments);

    let data = getComments
    let message = "Add User comments";
    let message_code = "UserController:addCommentByUser-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getCommentsByProductId-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End getCommentsByProductId ---

// --- userOtpVerify ---
exports.userOtpVerify = async (req, reply) => {
  try {

    const result = await userOtpVerifySchema.validateAsync(req.body);
    console.log("result::", result);

    // ---- otpVerifyCode ---- //
    // const codeVerify = await client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
    //   .verificationChecks
    //   .create({
    //     to: `${result.phoneCode}${result.phoneNumber}`,
    //     code: result.otp
    //   });

    // if (codeVerify.status == "approved") {
    //   const getUserData = await models.User.findOne(
    //     {
    //       where: {
    //         id: result.user_id
    //       }
    //     }
    //   );
    //   console.log("getUserData::", getUserData);

    //   const userData = {
    //     user_id: getUserData.id,
    //     deviceType: getUserData.deviceType,
    //     fcm_token: getUserData.fcm_token,
    //     phoneCode: getUserData.phoneCode,
    //     phoneNumber: getUserData.phoneNumber,
    //     phoneVerify: getUserData.phoneVerify,
    //     firstName: getUserData.firstName,
    //     lastName: getUserData.lastName,
    //     phone: getUserData.phoneCode + getUserData.phoneNumber,
    //     email: getUserData.email,
    //     avatar: getUserData.avatar,
    //     gender: getUserData.gender,
    //     role: getUserData.role,
    //     isActive: getUserData.isActive,
    //     createdAt: getUserData.createdAt,
    //     OTP: 1234,
    //     token: "token",
    //   }

    //   let data = userData
    //   let message = "OTP Verified";
    //   let message_code = "UserController:addCommentByUser-01";
    //   let message_action = "Get back to login or Get started screen";
    //   let api_token = "";
    //   return Api.setSuccessResponse(
    //     data,
    //     message,
    //     message_code,
    //     message_action,
    //     api_token
    //   );
    // } else {
    //   let message = "Your credentials is invalid";
    //   let message_code = "DriverController:driverCheckMobile-02";
    //   let message_action = "Get back to login or Get started screen";
    //   let api_token = "";
    //   return Api.setWarningResponse(
    //     [],
    //     message,
    //     message_code,
    //     message_action,
    //     api_token
    //   );
    // }
    // ---- End otpVerifyCode ---- //


    // --- tempOtpPortion --- //
    const otp = 1234;

    if (result.otp == otp) {
      console.log("conditionInUser::", result.otp == otp);

      const getUserData = await models.User.findOne(
        {
          where: {
            id: result.user_id
          }
        }
      );
      console.log("getUserData::", getUserData);

      const userData = {
        user_id: getUserData.id,
        deviceType: getUserData.deviceType,
        fcm_token: getUserData.fcm_token,
        phoneCode: getUserData.phoneCode,
        phoneNumber: getUserData.phoneNumber,
        phoneVerify: getUserData.phoneVerify,
        firstName: getUserData.firstName,
        lastName: getUserData.lastName,
        phone: getUserData.phoneCode + getUserData.phoneNumber,
        email: getUserData.email,
        avatar: getUserData.avatar,
        gender: getUserData.gender,
        role: getUserData.role,
        isActive: getUserData.isActive,
        createdAt: getUserData.createdAt,
        OTP: 1234,
        token: "token",
      }

      let data = userData
      let message = "OTP Verified";
      let message_code = "UserController:addCommentByUser-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

    } else {
      let message = "Your credentials is invalid";
      let message_code = "DriverController:driverCheckMobile-02";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    }


    // ---- otpSendCode ---- //

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getCommentsByProductId-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End userOtpVerify ---


// --- userCheckMobile ---
exports.userCheckMobile = async (req, reply) => {
  try {

    const result = await userCheckMobileSchema.validateAsync(req.body);
    console.log("result::", result);

    const userData = await models.User.findOne(
      {
        where: {
          phone: result.phoneCode + result.phoneNumber
        }
      }
    );
    console.log("userData:;", userData);

    if (!userData) {

      // ---- otpSendCode ---- //

      // const codeVerify = await client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
      //   .verifications
      //   .create({ to: `${result.phoneCode}${result.phoneNumber}`, channel: 'sms' })
      // console.log("codeVerify::", codeVerify);

      // ---- End otpSendCode ---- //

      const insertData = await models.User.create(
        {
          phoneCode: result.phoneCode,
          phoneNumber: result.phoneNumber,
          phone: result.phoneCode + result.phoneNumber,
          phoneVerify: 1,
          role: 2
        }
      );
      console.log("UserInsertData:", insertData);

      const userDetails = await models.User.findOne(
        {
          where: {
            id: insertData.id
          }
        }
      );
      console.log("userDetails:;", userDetails);

      const response = {
        OTP: 1234,
        user_id: userDetails.id,
        user_photo: userDetails.avatar,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        role: userDetails.role,
        isAvailable: userDetails.isAvailable,
        createdAt: userDetails.createdAt
      }
      console.log("userResponse::", response);

      let message = "User with given phone number";
      let message_code = "UserController:userCheckMobile-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        response,
        message,
        message_code,
        message_action,
        api_token
      );

    } else {
      let message = "Phone already exists";
      let message_code = "UserController:userCheckMobile-02";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    }

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getCommentsByProductId-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End userCheckMobile ---


// --- createConnectAccount --- 
exports.createConnectAccount = async (req, reply) => {
  try {

    const result = await createConnectAccountSchema.validateAsync(req.body);
    console.log("result::", result);

    const account = await stripe.accounts.create({
      type: 'custom',
      country: `${result.country}`,
      email: `${result.email}`,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    let data = account
    let message = "Create connection account in  stripe";
    let message_code = "UserController:createConnectAccount-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:createConnectAccount-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End createConnectAccount --- 


// --- updateUsername ---
exports.updateUsername = async (req, reply) => {
  try {

    const result = await updateUsernameSchema.validateAsync(req.body);
    console.log("result::", result);

    /*

    const userdataUpdate = await models.User.update(
          { fcm_token: results.fcm_token },
          {
            where: {
              id: id,
            },
          }
        );

    var users = await models.User.findOne({
      where: {
        username: results.username,
      },
    });

    const response = {
        OTP: 1234,
        user_id: userDetails.id,
        user_photo: userDetails.avatar,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        role: userDetails.role,
        isAvailable: userDetails.isAvailable,
        createdAt: userDetails.createdAt
      }
      console.log("userResponse::", response);

      let message = "User with given phone number";
      let message_code = "UserController:userCheckMobile-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        response,
        message,
        message_code,
        message_action,
        api_token
      );

    */

    const updateUserName = await models.User.update(
      { firstName: result.firstName },
      {
        where: {
          id: result.user_id
        }
      }
    );


    const getUserData = await models.User.findOne({
      where: {
        id: result.user_id
      }
    });
    console.log("getUserData::", getUserData);

    const response = {
      firstName: getUserData.firstName
    }

    let message = "User firstName is updated successfully";
    let message_code = "UserController:updateUsername-01";
    let message_action = "User with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      response,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:updateUsername-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- end updateUsername ---


// --- transferAccReqAdd ---
exports.transferAccReqAdd = async (req, reply) => {
  try {

    const result = await transferAccountSchema.validateAsync(req.body);
    console.log("result::", result);
    console.log("type:", result.type);

    if (result.type == 1) {

      let addTransferData = await models.transferAccount.create({
        user_id: result.user_id,
        driver_id: result.driver_id,
        store_id: result.store_id,
        name: result.name,
        first_name: result.first_name,
        last_name: result.last_name,
        address: result.address,
        city: result.city,
        state: result.state,
        zip_code: result.zip_code,
        email: result.email,
        account_number: result.account_number,
        routing: result.routing,
        transfer_type: 1,
        account_type: result.account_type,
      });
      console.log("addTransferData:::", addTransferData);

      let message = "Transfer Account request data";
      let message_code = "UserController:transferAccReqAdd-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        addTransferData,
        message,
        message_code,
        message_action,
        api_token
      );

    }

    if (result.type == 2) {
      let addTransferData = await models.transferAccount.create({
        user_id: result.user_id,
        driver_id: result.driver_id,
        store_id: result.store_id,
        cash_app_tag: result.cash_app_tag,
        transfer_type: 2,
        cash_app_acc_name: result.cash_app_acc_name,
      });
      console.log("addTransferData:::", addTransferData);

      let message = "Transfer Account request data";
      let message_code = "UserController:transferAccReqAdd-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        addTransferData,
        message,
        message_code,
        message_action,
        api_token
      );
    }

    if (result.type == 3) {
      let addTransferData = await models.transferAccount.create({
        user_id: result.user_id,
        driver_id: result.driver_id,
        store_id: result.store_id,
        phone_number: result.phone_number,
        zelle_acc_name: result.zelle_acc_name,
        transfer_type: 3
      });
      console.log("addTransferData:::", addTransferData);

      let message = "Transfer Account request data";
      let message_code = "UserController:transferAccReqAdd-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        addTransferData,
        message,
        message_code,
        message_action,
        api_token
      );
    }


    // const addTransferData = await models.transferAccount.create({
    //   name: result.name,
    //   first_name: result.first_name,
    //   last_name: result.last_name,
    //   address: result.address,
    //   city: result.city,
    //   state: result.state,
    //   zip_code: result.zip_code,
    //   email: result.email,
    //   account_number: result.account_number,
    //   routing: result.routing,
    //   account_type: result.account_type,
    //   cash_app_tag: result.cash_app_tag,
    //   cash_app_acc_name: result.cash_app_acc_name,
    //   phone_number: result.phone_number,
    //   zelle_acc_name: result.zelle_acc_name
    // });
    // console.log("addTransferData:::", addTransferData);

    // let message = "Transfer Account request data";
    // let message_code = "UserController:transferAccReqAdd-01";
    // let message_action = "User with given phone";
    // let api_token = "";
    // return Api.setSuccessResponse(
    //   addTransferData,
    //   message,
    //   message_code,
    //   message_action,
    //   api_token
    // );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:transferAccReqAdd-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End transferAccReqAdd ---


// --- listTransferData ---
exports.listTransferData = async (req, reply) => {
  try {

    const result = await listTransferDataSchema.validateAsync(req.body);
    console.log("result:::", result);

    var getTransferAccountData;

    if (result.driver_id) {

      getTransferAccountData = await models.transferAccount.findAll({
        where: {
          driver_id: result.driver_id,
        },
      });
      console.log("getTransferAccountData:::", getTransferAccountData);

    } else {

      if (result.store_id) {

        getTransferAccountData = await models.transferAccount.findAll({
          where: {
            store_id: result.store_id,
          },
        });
        console.log("getTransferAccountData2:::", getTransferAccountData);

      } else {

        if (result.user_id) {

          getTransferAccountData = await models.transferAccount.findAll({
            where: {
              user_id: result.user_id,
            },
          });
          console.log("getTransferAccountData3:::", getTransferAccountData);

        }

      }

    }

    let message = "Transfer Account request data List";
    let message_code = "UserController:listTransferData-01";
    let message_action = "User with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      getTransferAccountData,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:listTransferData-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End listTransferData ---


// --- allAccTransferData ---
exports.allAccTransferData = async (req, reply) => {
  try {

    var [getTransferAccountData] = await models.sequelize.query(
      `
        SELECT * FROM transferAccounts ORDER BY id DESC;
      `
    )
    console.log("getTransferAccountData::", getTransferAccountData);

    let message = "Transfer Account request data List";
    let message_code = "UserController:allAccTransferData-01";
    let message_action = "User with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      getTransferAccountData,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:allAccTransferData-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End allAccTransferData ---


// --- setDefaultAccount ---
exports.setDefaultAccount = async (req, reply) => {
  try {

    const result = await setDefaultAccountSchema.validateAsync(req.body);
    console.log("result::", result);

    if (result.driver_id == undefined) {

      if (result.store_id == undefined) {

        if (result.user_id == undefined) {

          let data = "opps";
          let message = "Please define valid id";
          let message_code = "UserController:setDefaultAccount-01";
          let message_action = "catched Error:";
          let api_token = "";
          return Api.setErrorResponse(
            data,
            message,
            message_code,
            message_action,
            api_token
          );

        } else {

          const updateUserName = await models.transferAccount.update(
            { default: 1 },
            {
              where: {
                id: result.acc_id,
                user_id: result.user_id
              }
            }
          );

          const getUserData = await models.transferAccount.findOne({
            where: {
              id: result.acc_id,
              user_id: result.user_id
            }
          });

          let message = "Transfer Account request data update successfull";
          let message_code = "UserController:transferAccReqAdd-01";
          let message_action = "User with given phone";
          let api_token = "";
          return Api.setSuccessResponse(
            getUserData,
            message,
            message_code,
            message_action,
            api_token
          );

        }

      } else {

        const updateUserName = await models.transferAccount.update(
          { default: 1 },
          {
            where: {
              id: result.acc_id,
              store_id: result.store_id
            }
          }
        );

        const getUserData = await models.transferAccount.findOne({
          where: {
            id: result.acc_id,
            store_id: result.store_id
          }
        });

        let message = "Transfer Account request data update successfull";
        let message_code = "UserController:transferAccReqAdd-01";
        let message_action = "User with given phone";
        let api_token = "";
        return Api.setSuccessResponse(
          getUserData,
          message,
          message_code,
          message_action,
          api_token
        );

      }

    } else {

      const updateUserName = await models.transferAccount.update(
        { default: 1 },
        {
          where: {
            id: result.acc_id,
            driver_id: result.driver_id
          }
        }
      );

      const getUserData = await models.transferAccount.findOne({
        where: {
          id: result.acc_id,
          driver_id: result.driver_id
        }
      });

      let message = "Transfer Account request data update successfull";
      let message_code = "UserController:transferAccReqAdd-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        getUserData,
        message,
        message_code,
        message_action,
        api_token
      );

    }



  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:allAccTransferData-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End setDefaultAccount ---


// --- deleteTransferAccData ---
exports.deleteTransferAccData = async (req, reply) => {
  try {

    const result = await deleteTransferAccDataSchema.validateAsync(req.body);
    console.log("result:::", result);

    if (result.driver_id == undefined) {

      if (result.store_id == undefined) {

        if (result.user_id == undefined) {

          let data = "opps";
          let message = "Please define valid id";
          let message_code = "UserController:setDefaultAccount-01";
          let message_action = "catched Error:";
          let api_token = "";
          return Api.setErrorResponse(
            data,
            message,
            message_code,
            message_action,
            api_token
          );

        } else {

          const deleteTransferAccData = await models.sequelize.query(
            `
            DELETE FROM transferAccounts WHERE id = ${result.acc_id} AND user_id = ${result.user_id}
            `
          );

          let message = "Transfer Account request data delete successfully";
          let message_code = "UserController:deleteTransferAccData-01";
          let message_action = "User with given phone";
          let api_token = "";
          return Api.setSuccessResponse(
            message,
            message_code,
            message_action,
            api_token
          );

        }

      } else {

        const deleteTransferAccData = await models.sequelize.query(
          `
          DELETE FROM transferAccounts WHERE id = ${result.acc_id} AND store_id = ${result.store_id}
          `
        );

        let message = "Transfer Account request data delete successfully";
        let message_code = "UserController:deleteTransferAccData-01";
        let message_action = "User with given phone";
        let api_token = "";
        return Api.setSuccessResponse(
          message,
          message_code,
          message_action,
          api_token
        );

      }

    } else {

      const deleteTransferAccData = await models.sequelize.query(
        `
        DELETE FROM transferAccounts WHERE id = ${result.acc_id} AND driver_id = ${result.driver_id}
        `
      );

      let message = "Transfer Account request data delete successfully";
      let message_code = "UserController:deleteTransferAccData-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        message,
        message_code,
        message_action,
        api_token
      );

    }

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:listTransferData-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End deleteTransferAccData ---


// --- addWithdrawRequest ---
exports.addWithdrawRequest = async (req, reply) => {
  try {

    const result = await addWithdrawRequestSchema.validateAsync(req.body);
    console.log("result:::", result);

    const createDriverQueue = await models.withdrawRequests.create(
      {
        user_id: result.user_id,
        store_id: result.store_id,
        driver_id: result.driver_id,
        transfer_acc_id: result.transfer_acc_id,
        amount: result.amount,
        day_transfer: result.day_transfer,
        withdraw_fee: result.withdraw_fee
      }
    );

    var getToken = await models.trasactionFCM.findOne();
    console.log("getToken::", getToken.fcm_token);

    if (result.driver_id) {

      const findData = await models.Driver.findOne({
        where: {
          id: result.driver_id
        }
      });
      console.log("findData-driver_id::", findData);
      console.log("wallet::", findData.wallet);

      const totalAmount = parseFloat(result.amount) + parseFloat(result.withdraw_fee);
      const deductAmount = parseFloat(findData.wallet) - totalAmount;
      console.log("deductAmount::", deductAmount);

      const updateWallet = await models.Driver.update(
        {
          wallet: deductAmount
        },
        {
          where: {
            id: result.driver_id
          },
        }
      );

      const registrationToken = getToken.fcm_token;
      const title = " iaccesss Notification";
      const body = `${findData.firstName} sent you withdraw request of amount ${result.amount}`;
      const req_id = "1";
      const product_id = "1";
      const status = '1';


      ayraFCM.sendPushNotificationFCM(
        registrationToken,
        title,
        body,
        req_id,
        product_id,
        status,
        true
      );
      return;

    }

    if (result.user_id) {

      const findData = await models.User.findOne({
        where: {
          id: result.user_id
        }
      });
      console.log("findData-user_id::", findData);
      console.log("walletAmount", findData.walletAmount);

      const totalAmount = parseFloat(result.amount) + parseFloat(result.withdraw_fee);
      const deductAmount = parseFloat(findData.walletAmount) - totalAmount;
      console.log("deductAmount::", deductAmount);

      const updateWallet = await models.User.update(
        {
          walletAmount: deductAmount
        },
        {
          where: {
            id: result.user_id
          },
        }
      );

      const registrationToken = getToken.fcm_token;
      const title = " iaccesss Notification";
      const body = `${findData.firstName} sent you withdraw request of amount ${result.amount}`;
      const req_id = "1";
      const product_id = "1";
      const status = '1';


      ayraFCM.sendPushNotificationFCM(
        registrationToken,
        title,
        body,
        req_id,
        product_id,
        status,
        true
      );
      return;

    }

    if (result.store_id) {

      const findData = await models.Store.findOne({
        where: {
          id: result.store_id
        }
      });
      console.log("findData-store_id::", findData);
      console.log("wallet::", findData.wallet);

      const totalAmount = parseFloat(result.amount) + parseFloat(result.withdraw_fee)
      const deductAmount = parseFloat(findData.wallet) - totalAmount;
      console.log("deductAmount::", deductAmount);

      const updateWallet = await models.Store.update(
        {
          wallet: deductAmount
        },
        {
          where: {
            id: result.store_id
          },
        }
      );

      const registrationToken = getToken.fcm_token;
      const title = " iaccesss Notification";
      const body = `${findData.store_name} sent you withdraw request of amount ${result.amount}`;
      const req_id = "1";
      const product_id = "1";
      const status = '1';


      ayraFCM.sendPushNotificationFCM(
        registrationToken,
        title,
        body,
        req_id,
        product_id,
        status,
        true
      );
      return;

    }

    const insertRefundMoney = await models.Transaction.create(
      {
        user_id: result.user_id,
        store_id: result.store_id,
        driver_id: result.driver_id,
        transactions: result.amount,
        message: `withdraw deduct amount`
      }
    );

    // let message = "Add Withdraw Request Successfully";
    // let message_code = "UserController:addWithdrawRequest-01";
    // let message_action = "User with given phone";
    // let api_token = "";
    // return Api.setSuccessResponse(
    //   createDriverQueue,
    //   message,
    //   message_code,
    //   message_action,
    //   api_token
    // );


  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:addWithdrawRequest-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End addWithdrawRequestSchema ---


// --- getAllWithdrawRequest ---
exports.getAllWithdrawRequest = async (req, reply) => {
  try {

    var getAllData = await models.withdrawRequests.findAll({
      where: {
        status: 0
      },
      order: [["id", "DESC"]]
    });
    console.log("getAllData::", getAllData);

    var transferData = [];

    for (const transfId of getAllData) {
      console.log("transfId:::", transfId);

      const getTransferData = await models.transferAccount.findOne({
        where: {
          id: transfId.transfer_acc_id
        }
      });
      // console.log("getTransferData::", getTransferData);

      if (getTransferData == null) {

        let message = "getTransferData is null";
        let message_code = "UserController:getAllWithdrawRequest-01";
        let message_action = "User with given phone";
        let api_token = "";
        return Api.setSuccessResponse(
          message,
          message_code,
          message_action,
          api_token
        );

      } else {

        if (getTransferData.transfer_type == 1) {
          var transferType = 'Bank Transfer'
        }

        if (getTransferData.transfer_type == 2) {
          var transferType = 'Cash App Transfer'
        }

        if (getTransferData.transfer_type == 3) {
          var transferType = 'Zelle Transfer'
        }

        var userData;

        if (getTransferData.user_id) {

          userData = await models.User.findOne({
            where: {
              id: getTransferData.user_id
            }
          });
          console.log("userData::", userData);

          const respData = {
            transaction_id: transfId.id,
            user_id: getTransferData.user_id,
            logo: userData.avatar,
            name: userData.firstName,
            transfer_type: transferType,
            amount: parseFloat(transfId.amount) - parseFloat(transfId.withdraw_fee),
            withdraw_fee: transfId.withdraw_fee
          }
          transferData.push(respData)

        }

        if (getTransferData.store_id) {

          userData = await models.Store.findOne({
            where: {
              id: getTransferData.store_id
            }
          });
          const respData = {
            transaction_id: transfId.id,
            store_id: getTransferData.store_id,
            logo: userData.store_logo,
            name: userData.store_name,
            transfer_type: transferType,
            amount: parseFloat(transfId.amount) - parseFloat(transfId.withdraw_fee),
            withdraw_fee: transfId.withdraw_fee
          }
          transferData.push(respData)
        }
        if (getTransferData.driver_id) {
          userData = await models.Driver.findOne({
            where: {
              id: getTransferData.driver_id
            }
          });
          const respData = {
            transaction_id: transfId.id,
            driver_id: getTransferData.driver_id,
            logo: userData.avatar,
            name: userData.firstName,
            transfer_type: transferType,
            amount: parseFloat(transfId.amount) - parseFloat(transfId.withdraw_fee),
            withdraw_fee: transfId.withdraw_fee
          }
          transferData.push(respData)
        }
      }
    }

    let message = "Transfer Details List Successfully";
    let message_code = "UserController:addWithdrawRequest-01";
    let message_action = "User with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      transferData,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getAllWithdrawRequest-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End getAllWithdrawRequest ---


// --- getTransferReqData ---
exports.getTransferReqData = async (req, reply) => {
  try {

    const result = await getTransferReqDataSchema.validateAsync(req.body);
    console.log("result:::", result);

    var getPaymentAmount = await models.withdrawRequests.findOne({
      where: {
        id: result.withdraw_id
      }
    });
    console.log("getPaymentAmount::", getPaymentAmount);

    const response = [];
    if (getPaymentAmount == null) {

      let message = "Data Not Found";
      let message_code = "UserController:getTransferReqData-01";
      let message_action = "User with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );

    } else {

      var getData = await models.transferAccount.findOne({
        where: {
          id: getPaymentAmount.transfer_acc_id
        }
      });
      console.log("getData::", getData);

      if (getData == null) {

        let message = "Data Not Found On transferAccount";
        let message_code = "UserController:getTransferReqData-01";
        let message_action = "User with given phone";
        let api_token = "";
        return Api.setSuccessResponse(
          [],
          message,
          message_code,
          message_action,
          api_token
        );

      } else {

        var userDetail;
        var transferType;

        if (getData.transfer_type == 1) {
          transferType = 'Bank Transfer'
        }

        if (getData.transfer_type == 2) {
          transferType = 'Cash App Transfer'
        }

        if (getData.transfer_type == 3) {
          transferType = 'Zelle Transfer'
        }

      }

    }

    const data = {
      id: getData.id,
      user_id: getData.user_id,
      driver_id: getData.driver_id,
      store_id: getData.store_id,
      name: getData.name,
      first_name: getData.first_name,
      last_name: getData.last_name,
      address: getData.address,
      city: getData.city,
      state: getData.state,
      zip_code: getData.zip_code,
      email: getData.email,
      account_number: getData.account_number,
      routing: getData.routing,
      account_type: getData.account_type,
      cash_app_tag: getData.cash_app_tag,
      cash_app_acc_name: getData.cash_app_acc_name,
      phone_number: getData.phone_number,
      zelle_acc_name: getData.zelle_acc_name,
      transfer_type: getData.transfer_type,
      default: getData.default,
      day_transfer: getPaymentAmount.day_transfer
    }

    // if (getData.user_id) {
    //   userDetail = await models.User.findOne({
    //     where: {
    //       id: getData.user_id
    //     }
    //   })

    //   var respData = {
    //     transfer_type: transferType,
    //     logo: userDetail.avatar,
    //     payment: getPaymentAmount.amount,
    //     firstName: userDetail.firstName,
    //     lastName: userDetail.lastName,
    //     address: '',
    //     city: '',
    //     state: '',
    //     zipCode: '',
    //     email: userDetail.email,
    //     account: getData.account_number,
    //     routing: getData.routing,
    //     account_type: getData.account_type
    //   }

    // }

    // if (getData.driver_id) {
    //   userDetail = await models.Driver.findOne({
    //     where: {
    //       id: getData.driver_id
    //     }
    //   })

    //   var respData = {
    //     transfer_type: transferType,
    //     logo: userDetail.avatar,
    //     payment: getPaymentAmount.amount,
    //     firstName: userDetail.firstName,
    //     lastName: userDetail.lastName,
    //     address: '',
    //     city: '',
    //     state: '',
    //     zipCode: '',
    //     email: userDetail.email,
    //     account: getData.account_number,
    //     routing: getData.routing,
    //     account_type: getData.account_type
    //   }

    // }

    // if (getData.store_id) {
    //   userDetail = await models.Store.findOne({
    //     where: {
    //       id: getData.store_id
    //     }
    //   })

    //   var respData = {
    //     transfer_type: transferType,
    //     logo: userDetail.store_logo,
    //     payment: getPaymentAmount.amount,
    //     storeName: userDetail.store_name,
    //     firstName: userDetail.username,
    //     address: userDetail.store_address,
    //     city: userDetail.city,
    //     state: userDetail.state,
    //     zipCode: '',
    //     email: userDetail.email,
    //     account: getData.account_number,
    //     routing: getData.routing,
    //     account_type: getData.account_type
    //   }

    // }


    let message = "Get Transfer Request Data List";
    let message_code = "UserController:getTransferReqData-01";
    let message_action = "User with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getTransferReqData-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}
// --- End getTransferReqData ---


// --- updateStatus ---
exports.updateStatus = async (req, res) => {
  try {

    console.log("Hello:::;");

    let withdrawId = req.body.withdraw_id;
    console.log("withdrawId::", withdrawId);

    const updateData = await models.withdrawRequests.update(
      {
        status: req.body.status
      },
      {
        where: {
          id: withdrawId
        },
      }
    );

    if (req.body.status == 2) {
      console.log("status::;", req.body.status);

      const reason = req.body.reason ? req.body.reason : "";

      var findWithdrawRequest = await models.withdrawRequests.findOne({
        where: {
          id: withdrawId,
        },
      });
      console.log("getDetailOfWithdraw:=---", findWithdrawRequest);

      var updateReason = await models.withdrawRequests.update(
        {
          reason: reason
        },
        {
          where: {
            id: withdrawId
          }
        }
      )

      if (findWithdrawRequest.user_id) {

        const getUserData = await models.User.findOne({
          where: {
            id: findWithdrawRequest.user_id
          }
        });
        console.log("getUserData::", getUserData);

        if (getUserData == null) {
          console.log("getUserData is null");
        } else {

          const deductAmount = parseFloat(getUserData.walletAmount) + parseFloat(findWithdrawRequest.amount);
          console.log("deductAmount::", deductAmount);

          const insertTransaction = await models.Transaction.create({
            user_id: findWithdrawRequest.user_id,
            type: 2,
            message: reason,
            transactions: deductAmount,
            status: 13
          });

          const updateWallet = await models.sequelize.query(
            `
            UPDATE users SET walletAmount = ${deductAmount} WHERE id = ${findWithdrawRequest.user_id}
            `
          )

          // const registrationToken = getUserData.fcm_token;
          // const title = " iaccesss Notification";
          // const body = `${getUserData.username} send request to `;
          // const req_id = "1";
          // const product_id = "1";
          // const status = '1';


          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // );
          // return;

        }

      }

      if (findWithdrawRequest.driver_id) {

        const getDriverData = await models.Driver.findOne({
          where: {
            id: findWithdrawRequest.driver_id
          }
        });
        console.log("getDriverData::", getDriverData);

        if (getDriverData == null) {
          console.log("getDriverData is null");
        } else {

          const deductAmount = parseFloat(getDriverData.wallet) + parseFloat(findWithdrawRequest.amount);
          console.log("deductAmount::", deductAmount);

          const insertTransaction = await models.Transaction.create({
            driver_id: findWithdrawRequest.driver_id,
            type: 2,
            message: reason,
            transactions: deductAmount,
            status: 13
          });

          const updateWallet = await models.sequelize.query(
            `
          UPDATE drivers SET wallet = ${deductAmount} WHERE id = ${findWithdrawRequest.driver_id}
          `
          )

          // const registrationToken = getDriverData.fcm_token;
          // const title = " iaccesss Notification";
          // const body = `${getDriverData.firstName} send request to `;
          // const req_id = "1";
          // const product_id = "1";
          // const status = '1';


          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // );
          // return;

        }

        // let message = "Update Status Withdraw Request Successfully";
        // let message_code = "UserController:addWithdrawRequest-01";
        // let message_action = "User with given phone";
        // let api_token = "";
        // return Api.setSuccessResponse(
        //   message,
        //   message_code,
        //   message_action,
        //   api_token
        // );

      }

      if (findWithdrawRequest.store_id) {

        const getStoreData = await models.Store.findOne({
          where: {
            id: findWithdrawRequest.store_id
          }
        });
        console.log("getStoreData::", getStoreData);

        if (getStoreData == null) {
          console.log("getStoreData is null");
        } else {

          const deductAmount = parseFloat(getStoreData.wallet) + parseFloat(findWithdrawRequest.amount);
          console.log("deductAmount::", deductAmount);

          const insertTransaction = await models.Transaction.create({
            store_id: findWithdrawRequest.store_id,
            type: 2,
            message: reason,
            transactions: deductAmount,
            status: 13
          });

          const updateWallet = await models.sequelize.query(
            `
          UPDATE stores SET wallet = ${deductAmount} WHERE id = ${findWithdrawRequest.store_id}
          `
          )

          // const registrationToken = getStoreData.fcm_token;
          // const title = " iaccesss Notification";
          // const body = `${getStoreData.username} send request to `;
          // const req_id = "1";
          // const product_id = "1";
          // const status = '1';


          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // );
          // return;

        }

        // let message = "Update Status Withdraw Request Successfully";
        // let message_code = "UserController:addWithdrawRequest-01";
        // let message_action = "User with given phone";
        // let api_token = "";
        // return Api.setSuccessResponse(
        //   message,
        //   message_code,
        //   message_action,
        //   api_token
        // );

      }

    }

    if (req.body.status == 3) {

      console.log("req.body.status--3::", req.body.status);

      const reason = "complete your withdraw request";

      var findWithdrawRequest = await models.withdrawRequests.findOne({
        where: {
          id: withdrawId,
        },
      });
      console.log("getDetailOfWithdraw:=---", findWithdrawRequest);

      var updateReason = await models.withdrawRequests.update(
        {
          reason: reason
        },
        {
          where: {
            id: withdrawId
          }
        }
      )

      if (findWithdrawRequest.user_id) {

        const getUserData = await models.User.findOne({
          where: {
            id: findWithdrawRequest.user_id
          }
        });
        console.log("getUserData3::", getUserData);

        if (getUserData == null) {
          console.log("getUserData is null");
        } else {

          const insertTransaction = await models.Transaction.create({
            user_id: findWithdrawRequest.user_id,
            type: 2,
            message: reason,
            status: 13
          });

          // const registrationToken = getUserData.fcm_token;
          // const title = " iaccesss Notification";
          // const body = `${getUserData.username} send request to `;
          // const req_id = "1";
          // const product_id = "1";
          // const status = '1';


          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // );
          // return;

        }

        // let message = "Update Status Withdraw Request Successfully";
        // let message_code = "UserController:addWithdrawRequest-01";
        // let message_action = "User with given phone";
        // let api_token = "";
        // return Api.setSuccessResponse(
        //   message,
        //   message_code,
        //   message_action,
        //   api_token
        // );

      }

      if (findWithdrawRequest.driver_id) {

        const getDriverData = await models.Driver.findOne({
          where: {
            id: findWithdrawRequest.driver_id
          }
        });
        console.log("getDriverData3::", getDriverData);

        if (getDriverData == null) {
          console.log("getDriverData is null");

        } else {

          const insertTransaction = await models.Transaction.create({
            driver_id: findWithdrawRequest.driver_id,
            type: 2,
            message: reason,
            status: 13
          });

          // const registrationToken = getDriverData.fcm_token;
          // const title = " iaccesss Notification";
          // const body = `${getDriverData.firstName} send request to `;
          // const req_id = "1";
          // const product_id = "1";
          // const status = '1';


          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // );
          // return;

        }

        // let message = "Update Status Withdraw Request Successfully";
        // let message_code = "UserController:addWithdrawRequest-01";
        // let message_action = "User with given phone";
        // let api_token = "";
        // return Api.setSuccessResponse(
        //   message,
        //   message_code,
        //   message_action,
        //   api_token
        // );

      }

      if (findWithdrawRequest.store_id) {

        const getStoreData = await models.Store.findOne({
          where: {
            id: findWithdrawRequest.store_id
          }
        });
        console.log("getStoreData3:::", getStoreData);

        if (getStoreData == null) {
          console.log("getStoreData-null");
        } else {

          const insertTransaction = await models.Transaction.create({
            store_id: findWithdrawRequest.store_id,
            type: 2,
            message: reason,
            status: 13
          });

          // const registrationToken = getStoreData.fcm_token;
          // const title = " iaccesss Notification";
          // const body = `${getStoreData.username} send request to `;
          // const req_id = "1";
          // const product_id = "1";
          // const status = '1';


          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // );
          // return;

        }

      }

    }

    let message = "Update Status Withdraw Request Successfully";
    let message_code = "UserController:addWithdrawRequest-01";
    let message_action = "User with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {

    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getAllWithdrawRequest-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );

  }
}
// --- End updateStatus ---


exports.trasactionFCMToken = async (req, res) => {
  try {

    const result = await trasactionFCMTokenSchema.validateAsync(req.body);
    console.log("result:::", result);

    const findData = await models.trasactionFCM.findOne();
    console.log("findData::", findData);

    if (findData == null) {

      const data = await models.trasactionFCM.create({
        fcm_token: req.body.fcm_token
      });

      let message = "Save FCM_Token Successfully";
      let message_code = "UserController:userRegister-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

    } else {

      const data = req.body.fcm_token
      const updateData = await models.trasactionFCM.update(
        {
          fcm_token: data
        },
        {
          where: {
            id: 1
          }
        }
      )

      let message = "Update FCM_Token Successfully";
      let message_code = "UserController:userRegister-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

    }

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:trasactionFCMToken-02";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setErrorResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  }
}


/*
var storeDataArr = await models.Store.findAll({
        attributes: ["id", "store_name"],
        where: {
          store_name: {
            [Op.ne]: null,
          },
        },
        order: models.sequelize.random(),
      });
*/