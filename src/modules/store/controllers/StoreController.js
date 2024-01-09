import bcrypt from "bcrypt";
require("dotenv").config();
import models from "../../../setup/models";
import * as Api from "../../../setup/ApiResponse";
const SendOtp = require("sendotp");

// ---- otpSendSystem ---- //
const accountSid = "ACa0774e852f6ea56f2426a8790b050825";
const authToken = "d7c1d74940ba330282157969be1a14be";

const client = require('twilio')(accountSid, authToken);
// ---- End otpSendSystem ---- //

const stripe = require('stripe')("sk_test_51LN8OVCTyqcVtzly3nSmJjBjijlsVVN2TN6bmL7eF3ojcnR0Gabi89SRapl3cfFOzQacNmXuIlnHkxTICQ9YxjzV005ddY95Bi");
const sendOtp = new SendOtp("332533AhDBihu7o608ce1a0P1");

import serverConfig from "../../../config/server.json";
import { contrast } from "jimp";
const {
  storeLoginSchema,
  storeRegisterSchema,
  storecheckSchema,
  storeVerifyOTPSchema,
  storeresetStoreOTPSchema,
  storeForgetPasswordSchema,
  storeForgetPasswordRequestSchema,
  storeProductCategorySchema,
  getstoreProductCategorySchema,
  saveStoreProductSubCategorySchema,
  getStoreProductSubCategorySchema,
  setSizeToStore,
  userRequestItemToStore,
  deleteProductByIdSchema,
  setColorToStoreSchme,
  deleteCategoryByIdSchema,
  deleteSubCategoryByIdSchema,
  uniqueStoreNameSchema,
  fmcTokenUpdate,
  fcmTokemRemove,
  updateStoreDetails,
  productDetails,
  openCloseStoreSchema,
  addStoreCardDetailsSchema,
  getStoreCardDetailsSchema,
  deleteStoreCardDetailsSchema,
  defaultCardStoreSchema,
  withdrawByStoreSchema,
  productSoldOutSchema,
  productUnsoldSchema,
  storeDeactivateSchema,
  storeActiveSchema,
  storeOtpVerifySchema,
  insertStoreCommentSchema,
  getStoreCommentsSchema,
  getStoreAddress,
  insertStoreW9TaxSchema,
  getW9Tax,
  // deleteStoreByIdSchema
} = require("./storeValidate");

var generateRandomNDigits = (n) => {
  return 1234;
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};
const { Op, where } = require("sequelize");

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: rowData } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, rowData, totalPages, currentPage };
};

//storeLogin
exports.storeLoginOK = async (req, reply) => {
  try {
    const results = await storeLoginSchema.validateAsync(req.body);
    console.log("=>", results);
    var stores = await models.Store.findOne({
      where: {
        username: results.username,
      },
    });
    if (!stores) {
      let message = "No username found in Stores";
      let message_code = "StoreController:storeLogin-01";
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

      const userDetails = stores.get();
      const passwordMatch = await bcrypt.compare(
        results.password,
        userDetails.password
      );
      if (!passwordMatch) {
        let message = "Invalid credential";
        let message_code = "StoreController:storeLogin-02";
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
        let message = "Store user successfully logged in";
        let message_code = "StoreController:userLogin-03";
        let message_action =
          "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

        // / sendOtp.send("7703886088", "PRIIND", "4635", function (error, data) {
        //    console.log(data);
        //  });
        //  sendOtp.retry("917703886088", true, function (error, data) {
        //    console.log(data);
        //  });

        const OTP = generateRandomNDigits(5);

        var storeTimingData = await models.StoreTiming.findOne({
          where: {
            store_id: userDetails.id,
          },
        });
        const StoreTimeDetails = storeTimingData.get();

        //upating fcm
        const dataA = await models.Store.update(
          {
            fcm_token: results.fcm_token,
          },
          {
            where: {
              id: userDetails.id,
            },
          }
        );
        //upating fcm

        //const OTP = 12345;
        const userData = {
          store_id: userDetails.id,
          deviceType: userDetails.deviceType,
          fcm_token: results.fcm_token,
          store_photo: userDetails.store_photo,
          store_name: userDetails.store_name,
          store_logo: userDetails.store_logo,
          store_address: userDetails.store_address,
          securiy_pin: userDetails.securiy_pin,
          phoneVerify: userDetails.phoneVerify,
          phone: userDetails.phone,
          email: userDetails.email,
          store_lat: userDetails.store_lat,
          store_long: userDetails.store_long,
          role: userDetails.role,
          isActive: userDetails.isActive,
          createdAt: userDetails.createdAt,
          OTP: OTP,
          token: token,
          storetiming: StoreTimeDetails,
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
    let message_code = "StoreController:userLogin-04";
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

exports.storeLogin = async (req, reply) => {
  try {
    const results = await storeLoginSchema.validateAsync(req.body);
    console.log("results::", results);

    var stores = await models.Store.findOne({
      where: {
        phone: results.phoneCode + results.phoneNumber,
      },
    });
    console.log("stores::", stores);

    if (!stores) {

      let message = "No user found in Stores";
      let message_code = "StoreController:storeLogin-01";
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
      //   .create({ to: `${results.phoneCode}${results.phoneNumber}`, channel: 'sms' })
      //   .then(verification => console.log(verification.status))
      //   .catch((err) => console.log("We Hace Error:", err))
      // ---- otpSendCode ---- //


      // check password and login
      const userDetails = stores.get();
      console.log("userDetails::;", userDetails);

      // const storeCategoryDetails = StoreCategory.findOne({
      //   where: {
      //     store_id: userDetails.store_id
      //   }
      // })


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


      let message = "Store user successfully logged in";
      let message_code = "StoreController:userLogin-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      // const OTP = generateRandomNDigits(5);

      var storeTimingData = await models.StoreTiming.findOne({
        where: {
          store_id: userDetails.id,
        },
      });
      console.log("storeTimingData::", storeTimingData);

      const finalStoreTimingData = {
        id: storeTimingData.id,
        sun_open: storeTimingData.sun_open,
        sun_open_timing: storeTimingData.sun_open_timing,
        mon_open: storeTimingData.mon_open,
        mon_open_timing: storeTimingData.mon_open_timing,
        tue_open: storeTimingData.tue_open,
        tue_open_timing: storeTimingData.tue_open_timing,
        wed_open: storeTimingData.wed_open,
        wed_open_timing: storeTimingData.wed_open_timing,
        thurs_open: storeTimingData.thurs_open,
        thurs_open_timing: storeTimingData.thurs_open_timing,
        fri_open: storeTimingData.fri_open,
        fri_open_timing: storeTimingData.fri_open_timing,
        sat_open: storeTimingData.sat_open,
        sat_open_timing: storeTimingData.sat_open_timing,
        all_days_open: storeTimingData.all_days_open,
        all_day_open_timing: storeTimingData.all_day_open_timing,
      }

      const dataStoreCategory = await models.StoreCategory.findOne({
        where: {
          store_id: userDetails.id
        }
      });
      console.log("dataStoreCategory", dataStoreCategory.cat_name);


      // const [storeTimingData] = await models.sequelize.query(
      //   `
      //   SELECT
      //     stores.id,
      //     storeTimings.store_id
      //   FROM
      //     stores
      //   INNER JOIN
      //     storeTimings
      //   ON
      //     stores.id = ${userDetails.id}
      //   `
      // );
      // const StoreTimeDetails = storeTimingData.get();

      //upating fcm
      const dataA = await models.Store.update(
        {
          fcm_token: results.fcm_token,
        },
        {
          where: {
            id: userDetails.id,
          },
        }
      );
      //upating fcm

      const OTP = 1234;
      const userData = {
        store_id: userDetails.id,
        deviceType: userDetails.deviceType,
        fcm_token: results.fcm_token,
        store_photo: userDetails.store_photo,
        store_name: userDetails.store_name,
        store_logo: userDetails.store_logo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phoneCode: userDetails.phoneCode,
        phone: userDetails.phoneNumber,
        email: userDetails.email,
        cat_name: dataStoreCategory.cat_name,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        country_name: userDetails.country_name,
        state_name: userDetails.state_name,
        city_name: userDetails.city_name,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        OTP: OTP,
        token: token,
        storetiming: finalStoreTimingData,
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
    let message = err.message;
    let message_code = "StoreController:userLogin-04";
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

//storeRegister
exports.storeRegisterOK = async (req, reply) => {
  try {
    const results = await storeRegisterSchema.validateAsync(req.body);
    var stores = await models.Store.findOne({
      where: {
        username: results.username,
      },
    });
    if (stores) {
      let message = "username already exist";
      let message_code = "StoreController:storeRegister-01";
      let message_action = "not avaible";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      var storesPhone = await models.Store.findOne({
        where: {
          phone: results.phoneCode + results.phoneNumber,
        },
      });

      // if (storesPhone) {

      //   let message = "phone already exist";
      //   let message_code = "StoreController:storeRegister-02";
      //   let message_action = "not avaible";
      //   let api_token = "";
      //   return Api.setWarningResponse(
      //     [],
      //     message,
      //     message_code,
      //     message_action,
      //     api_token
      //   );
      // }

      //now avaible then register store
      const passwordHashed = await bcrypt.hash(
        req.body.password,
        serverConfig.saltRounds
      );

      const dataA = await models.Store.update(
        {
          store_name: results.storename,
          username: results.username,
          password: passwordHashed,
          securiy_pin: results.securiy_pin,
          store_address: results.store_address,
          store_lat: results.store_lat,
          phoneCode: results.phoneCode,
          phoneNumber: results.phoneNumber,
          phone: results.phoneCode + results.phoneNumber,
          store_long: results.store_long,
          deviceType: results.deviceType,
          fcm_token: results.fcm_token,
          phoneVerify: 1,
          role: 3,
        },
        {
          where: {
            id: results.store_id,
          },
        }
      );

      // const data = await models.Store.create({
      //   store_name: results.storename,
      //   username: results.username,
      //   password: passwordHashed,
      //   securiy_pin: results.securiy_pin,
      //   store_address: results.store_address,
      //   store_lat: results.store_lat,
      //   phoneCode: results.phoneCode,
      //   phoneNumber: results.phoneNumber,
      //   phone: results.phoneCode + results.phoneNumber,
      //   store_long: results.store_long,
      //   phoneVerify: 1,
      //   role: 3,
      // });
      const dataStoreCategory = await models.StoreCategory.create({
        store_id: results.store_id,
        cat_name: results.store_category,
      });
      const dataStoreTiming = await models.StoreTiming.create({
        store_id: results.store_id,
        sun_open: req.body.store_opening_days.sun_open,
        mon_open: req.body.store_opening_days.mon_open,
        tue_open: req.body.store_opening_days.tue_open,
        wed_open: req.body.store_opening_days.wed_open,
        thurs_open: req.body.store_opening_days.thurs_open,
        fri_open: req.body.store_opening_days.fri_open,
        sat_open: req.body.store_opening_days.sat_open,
        sun_open_timing: req.body.open_hours,
        mon_open_timing: req.body.open_hours,
        tue_open_timing: req.body.open_hours,
        wed_open_timing: req.body.open_hours,
        thurs_open_timing: req.body.open_hours,
        fri_open_timing: req.body.open_hours,
        sat_open_timing: req.body.open_hours,
        all_day_open_timing: req.body.open_hours,
        all_days_open: req.body.all_days_open,
      });

      var storeTimingData = await models.StoreTiming.findOne({
        where: {
          store_id: results.store_id,
        },
      });
      const userDetails = await models.Store.findOne({
        where: {
          id: results.store_id,
        },
      });

      //const userDetails = data.get();
      const StoreTimeDetails = storeTimingData.get();
      const userData = {
        store_id: userDetails.id,
        deviceType: userDetails.deviceType,
        fcm_token: userDetails.fcm_token,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_photo: userDetails.store_photo,
        store_logo: userDetails.store_logo,
        role: userDetails.role,
        securiy_pin: userDetails.securiy_pin,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        storetiming: StoreTimeDetails,
      };
      let message = "Store Created ";
      let message_code = "StoreController:storeRegister-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action,
        api_token
      );
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "StoreController:userLogin-04";
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

exports.storeRegister = async (req, reply) => {
  try {
    const results = await storeRegisterSchema.validateAsync(req.body);

    var stores = await models.Store.findOne({
      where: {
        phone: results.phoneCode + results.phoneNumber,
      },
    });

    if (stores) {

      // client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
      //   .verifications
      //   .create({ to: `${results.phoneCode}${results.phoneNumber}`, channel: 'sms' })
      //   .then(verification => console.log(verification.status))
      //   .catch((err) => console.log("We Hace Error:", err))

      const dataA = await models.Store.update(
        {
          store_name: results.storename,
          username: "NA",
          // password: passwordHashed,
          securiy_pin: results.securiy_pin,
          store_address: results.store_address,
          // store_address: results.store_address,
          store_lat: results.store_lat,
          phoneCode: results.phoneCode,
          phoneNumber: results.phoneNumber,
          phone: results.phoneCode + results.phoneNumber,
          store_long: results.store_long,
          deviceType: results.deviceType,
          fcm_token: results.fcm_token,
          country_name: results.country_name,
          state_name: results.state_name,
          city_name: results.city_name,
          phoneVerify: 1,
          role: 3,
        },
        {
          where: {
            id: results.store_id,
          },
        }
      );

      const catTableData = await models.StoreCategory.findOne({
        where: {
          store_id: results.store_id
        }
      }
      )

      if (!catTableData) {
        const dataStoreCategory = await models.StoreCategory.create(
          {
            cat_name: results.cat_name,
            store_id: results.store_id
          }
        );
      } else {
        const catData = await models.StoreCategory.update(
          {
            cat_name: results.cat_name
          },
          {
            where: {
              store_id: results.store_id
            }
          }
        )
      }

      const storeTimingTableData = await models.StoreTiming.findOne({
        where: {
          store_id: results.store_id
        }
      });


      if (storeTimingTableData) {

        var dataStoreTiming = await models.StoreTiming.update(
          {
            sun_open: req.body.store_opening_days.sun_open,
            sun_open_timing: req.body.open_hours,
            mon_open: req.body.store_opening_days.mon_open,
            mon_open_timing: req.body.open_hours,
            tue_open: req.body.store_opening_days.tue_open,
            tue_open_timing: req.body.open_hours,
            wed_open: req.body.store_opening_days.wed_open,
            wed_open_timing: req.body.open_hours,
            thurs_open: req.body.store_opening_days.thurs_open,
            thurs_open_timing: req.body.open_hours,
            fri_open: req.body.store_opening_days.fri_open,
            fri_open_timing: req.body.open_hours,
            sat_open: req.body.store_opening_days.sat_open,
            sat_open_timing: req.body.open_hours,
            all_days_open: req.body.all_days_open,
            all_day_open_timing: req.body.open_hours,
          },
          {
            where: {
              store_id: results.store_id
            }
          })

      } else {

        var dataStoreTiming = await models.StoreTiming.create({
          store_id: req.body.store_id,
          sun_open: req.body.store_opening_days.sun_open,
          sun_open_timing: req.body.open_hours,
          mon_open: req.body.store_opening_days.mon_open,
          mon_open_timing: req.body.open_hours,
          tue_open: req.body.store_opening_days.tue_open,
          tue_open_timing: req.body.open_hours,
          wed_open: req.body.store_opening_days.wed_open,
          wed_open_timing: req.body.open_hours,
          thurs_open: req.body.store_opening_days.thurs_open,
          thurs_open_timing: req.body.open_hours,
          fri_open: req.body.store_opening_days.fri_open,
          fri_open_timing: req.body.open_hours,
          sat_open: req.body.store_opening_days.sat_open,
          sat_open_timing: req.body.open_hours,
          all_days_open: req.body.all_days_open,
          all_day_open_timing: req.body.open_hours,
        });

      }

      var storeTimingData = await models.StoreTiming.findOne({
        where: {
          store_id: results.store_id,
        },
      });

      var finalStoreTimingData = {
        id: storeTimingData.id,
        sun_open: storeTimingData.sun_open,
        sun_open_timing: storeTimingData.sun_open_timing,
        mon_open: storeTimingData.mon_open,
        mon_open_timing: storeTimingData.mon_open_timing,
        tue_open: storeTimingData.tue_open,
        tue_open_timing: storeTimingData.tue_open_timing,
        wed_open: storeTimingData.wed_open,
        wed_open_timing: storeTimingData.wed_open_timing,
        thurs_open: storeTimingData.thurs_open,
        thurs_open_timing: storeTimingData.thurs_open_timing,
        fri_open: storeTimingData.fri_open,
        fri_open_timing: storeTimingData.fri_open_timing,
        sat_open: storeTimingData.sat_open,
        sat_open_timing: storeTimingData.sat_open_timing,
        all_days_open: storeTimingData.all_days_open,
        all_day_open_timing: storeTimingData.all_day_open_timing
      }

      const userDetails = await models.Store.findOne({
        where: {
          id: results.store_id,
        },
      });


      //const userDetails = data.get();
      // const StoreTimeDetails = storeTimingData.get();
      const userData = {
        store_id: userDetails.id,
        deviceType: userDetails.deviceType,
        fcm_token: userDetails.fcm_token,
        phoneVerify: userDetails.phoneVerify,
        phoneCode: userDetails.phoneCode,
        phone: userDetails.phoneNumber,
        email: userDetails.email,
        store_photo: userDetails.store_photo,
        store_logo: userDetails.store_logo,
        cat_name: req.body.cat_name,
        role: userDetails.role,
        store_address: userDetails.store_address,
        country_name: userDetails.country_name,
        state_name: userDetails.state_name,
        city_name: userDetails.city_name,
        securiy_pin: userDetails.securiy_pin,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        storetiming: finalStoreTimingData,
      };
      let message = "Store Created ";
      let message_code = "StoreController:storeRegister-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      var storesPhone = await models.Store.findOne({
        where: {
          phone: results.phoneCode + results.phoneNumber,
        },
      });
      let message = "not exist";
      let message_code = "StoreController:storeRegister-01";
      let message_action = "not avaible";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );

      // if (storesPhone) {

      //   let message = "phone already exist";
      //   let message_code = "StoreController:storeRegister-02";
      //   let message_action = "not avaible";
      //   let api_token = "";
      //   return Api.setWarningResponse(
      //     [],
      //     message,
      //     message_code,
      //     message_action,
      //     api_token
      //   );
      // }

      //now avaible then register store
      // const passwordHashed = await bcrypt.hash(
      //   req.body.password,
      //   serverConfig.saltRounds
      // );
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    console.log("Registration", err);
    let data = "opps";
    let message = err.message;
    let message_code = "StoreController:userLogin-04";
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

//checkMobile
exports.checkMobile = async (req, reply) => {
  try {
    const results = await storecheckSchema.validateAsync(req.body);
    var stores = await models.Store.findOne({
      where: {
        phone: results.country_code + results.phone_number,
      },
    });
    console.log("stores::;", stores);

    if (!stores) {

      // ---- otpSendCode ---- //
      // const codeVerify = await client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
      //   .verifications
      //   .create({ to: `${results.country_code}${results.phone_number}`, channel: 'sms' })
      // console.log("codeVerify::", codeVerify);
      // ---- End otpSendCode ---- //

      //save store with phone number
      const data = await models.Store.create({
        phoneCode: results.country_code,
        phoneNumber: results.phone_number,
        phone: results.country_code + results.phone_number,
        phoneVerify: 1,
        role: 3,
      });
      console.log("data:;", data);

      var storesData = await models.Store.findOne({
        where: {
          id: data.id,
        },
      });
      console.log("storesData:;;", storesData);


      // const OTP = generateRandomNDigits(5);
      // console.log("OTP::;", OTP);

      const userDetails = storesData.get();
      console.log("userDetails:;", userDetails);

      const dataArr = {
        OTP: 1234,
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };
      console.log("dataArr::;", dataArr);
      //save store with phone number

      let message = "store with given phone number";
      let message_code = "StoreController:checkMobile-01";
      let message_action = "store with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        dataArr,
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      //now avaible then register store
      const userDetails = stores.get();

      const data = {
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };

      let message = "Phone already exists";
      let message_code = "StoreController:checkMobile-01";
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
    //382 271 637
    // let data=data;
  } catch (err) {
    console.log("error", err);
    let data = "opps";
    let message = err;
    let message_code = "StoreController:checkMobile-04";
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

//checkMobile

//verifyOTP
exports.verifyOTP = async (req, reply) => {
  try {
    const results = await storeVerifyOTPSchema.validateAsync(req.body);
    var stores = await models.Store.findOne({
      where: {
        id: results.store_id,
      },
    });
    if (!stores) {
      let message = "Store does  exist";
      let message_code = "StoreController:verifyOTP-01";
      let message_action = "Store not available";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      //now avaible then register store
      const userDetails = stores.get();

      const data = {
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };

      let message = "Phone Exist  ";
      let message_code = "StoreController:checkMobile-01";
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
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "StoreController:checkMobile-04";
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
//verifyOTP

//resetStoreOTP
exports.resetStoreOTP = async (req, reply) => {
  try {
    const results = await storeresetStoreOTPSchema.validateAsync(req.body);
    var stores = await models.Store.findOne({
      where: {
        id: results.store_id,
      },
    });
    if (!stores) {
      let message = "Store does  exist";
      let message_code = "StoreController:resetStoreOTP-01";
      let message_action = "Store not available";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      //now avaible then register store
      const userDetails = stores.get();

      const data = {
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };

      let message = "Store Exists";
      let message_code = "StoreController:resetStoreOTP-01";
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
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err;
    let message_code = "StoreController:resetStoreOTP-04";
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
//resetStoreOTP
//updateStoreForgetPassword
exports.updateStoreForgetPassword = async (req, reply) => {
  try {
    const results = await storeForgetPasswordSchema.validateAsync(req.body);
    var users = await models.Store.findOne({
      where: {
        id: results.store_id,
      },
    });
    if (!users) {
      let message = "No store id found";
      let message_code = "StoreController:updateStoreForgetPassword-01";
      let message_action = "store is not exist";
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
        let message_code = "StoreController:updateStoreForgetPassword-03";
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
        const passwordHashedNew = await bcrypt.hash(
          results.new_password,
          serverConfig.saltRounds
        );
        const userdata = await models.Store.update(
          { password: passwordHashedNew },
          {
            where: {
              id: results.store_id,
            },
          }
        );
        var stores = await models.Store.findOne({
          where: {
            id: results.store_id,
          },
        });

        const userDetails = stores.get();

        const data = {
          store_id: userDetails.id,
          store_photo: userDetails.store_photo,
          store_address: userDetails.store_address,
          securiy_pin: userDetails.securiy_pin,
          phoneVerify: userDetails.phoneVerify,
          phone: userDetails.phone,
          email: userDetails.email,
          store_lat: userDetails.store_lat,
          store_long: userDetails.store_long,
          role: userDetails.role,
          isActive: userDetails.isActive,
          createdAt: userDetails.createdAt,
        };

        let message = "Store Detail";
        let message_code =
          "Success StoreController:updateStoreForgetPassword-03";
        let message_action = "role:1=Admin 2:User:3:Store";

        return Api.setSuccessResponse(
          data,
          message,
          message_code,
          message_action
        );
      }
      // check password and login
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
//updateStoreForgetPassword

//storeForgetPasswordRequest
exports.storeForgetPasswordRequest = async (req, reply) => {
  try {
    const results = await storeForgetPasswordRequestSchema.validateAsync(
      req.body
    );
    var users = await models.Store.findOne({
      where: {
        username: results.username,
      },
    });
    if (!users) {
      let message = " username found";
      let message_code = "StoreController:storeForgetPasswordRequest-01";
      let message_action = "store is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      var stores = await models.Store.findOne({
        where: {
          username: results.username,
        },
      });

      const userDetails = stores.get();

      const data = {
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };

      let message = "Store Detail";
      let message_code = "Success StoreController:updateStoreForgetPassword-03";
      let message_action = "role:1=Admin 2:User:3:Store";
      return Api.setSuccessResponse(
        data,
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

//storeForgetPasswordRequest

//editStoreDetails
exports.editStoreDetails = async (req, reply) => {
  try {
    var users = await models.Store.findOne({
      where: {
        id: req.body.store_id,
      },
    });
    if (!users) {
      let message = " store id not  found";
      let message_code = "StoreController:storeForgetPasswordRequest-01";
      let message_action = "store is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      var storesd = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });

      const userDetails = storesd.get();

      const data = {
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        country_name: userDetails.country_name,
        state_name: userDetails.state_name,
        city_name: userDetails.city_name,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
      };

      let message = "Store Detail";
      let message_code = "Success StoreController:updateStoreForgetPassword-03";
      let message_action = "role:1=Admin 2:User:3:Store";

      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action
      );
    }
    //382 271 637
    // let data=data;
  } catch (err) {
    let data = "opps";
    let message = err.message;
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
//editStoreDetails

//getStoreCategoryMaster
exports.getStoreCategoryMaster = async (req, reply) => {
  try {
    var data = await models.StoreCategory.findAll({
      attributes: [["id", "store_cat_id"], "store_category_name", "CreatedAt"],
    });
    let message = "All Categories of Stores";
    let message_code = "Success StoreController:getStoreCategoryMaster-03";
    let message_action = "role:1=Admin 2:User:3:Store";

    return Api.setSuccessResponse(data, message, message_code, message_action);
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getStoreCategoryMaster-04";
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
//getStoreCategoryMaster

//getItemCategoryMaster
exports.getItemCategoryMaster = async (req, reply) => {
  try {
    var data = await models.ItemCategoryMaster.findAll({
      attributes: [
        ["id", "item_cat_id"],
        "item_cat_name",
        "isActive",
        "CreatedAt",
      ],
    });
    let message = "All Item Categories of Stores";
    let message_code = "Success StoreController:getItemCategoryMaster-03";
    let message_action = "role:1=Admin 2:User:3:Store";

    return Api.setSuccessResponse(data, message, message_code, message_action);
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getStoreCategoryMaster-04";
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

//getItemCategoryMaster

//getItemSubCategoryMaster
exports.getItemSubCategoryMaster = async (req, reply) => {
  try {
    var data = await models.ItemSubCategoryMaster.findAll({
      attributes: [
        ["id", "sub_cat_id"],
        "cat_id",
        "sub_cat_name",
        "isActive",
        "CreatedAt",
      ],
    });
    let message = "All Item Sub Categories of Stores";
    let message_code = "Success StoreController:getItemSubCategoryMaster-03";
    let message_action = "role:1=Admin 2:User:3:Store";

    return Api.setSuccessResponse(data, message, message_code, message_action);
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getItemSubCategoryMaster-04";
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
//getItemSubCategoryMaster

exports.uploadIMG = async (req, reply) => {
  try {
    if (!req.isMultipart()) {
      // you can use this decorator instead of checking headers
      reply.code(400).send(new Error("Request is not multipart"));
      return;
    }

    return "Welcome";
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getItemSubCategoryMaster-04";
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

exports.addProuctCategory = async (req, reply) => {
  try {
    var users = await models.StoreCategory.findOne({
      where: {
        id: req.body.store_id,
      },
    });
    if (!users) {
      let message = " store id not  found";
      let message_code = "StoreController:addProuctCategory-01";
      let message_action = "store is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    }
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:addProuctCategory-04";
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

//saveProductCategory  : this api is used to save category as per store
exports.saveProductCategory = async (req, reply) => {
  try {
    const results = await storeProductCategorySchema.validateAsync(req.body);

    var productcatArr = await models.ItemCategoryMaster.findOne({
      where: {
        store_id: results.store_id,
        item_cat_name: results.item_cat_name,
      },
    });

    const data = await models.ItemCategoryMaster.create({
      store_id: results.store_id,
      item_cat_name: results.item_cat_name,
    });

    let message = `Category ${req.body.item_cat_name} added successfully`;
    let message_code = "StoreController:getItemSubCategoryMaster-03";
    let message_action =
      "Get added category by :getProductCategory with store_id API";

    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action
    );

  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:addProuctCategory-04";
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
//--saveProductCategory  : this api is used to save category as per store

//getProductCategory: this api is used to return all category as respect to store_cat_id
exports.getProductCategory = async (req, reply) => {
  try {
    const results = await getstoreProductCategorySchema.validateAsync(req.body);
    var productcatArr = await models.ItemCategoryMaster.findOne({
      where: {
        store_id: results.store_id,
        isActive: {
          [Op.ne]: 2,
        },
      },
    });
    if (!productcatArr) {
      let message = `Category not found!`;
      let message_code = "StoreController:getProductCategory-01";
      let message_action = "Provides valid store Id";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      const data = await models.ItemCategoryMaster.findAll({
        where: {
          store_id: results.store_id,
          isActive: {
            [Op.ne]: 2,
          },
        },
        attributes: ["item_cat_name", ["id", "cat_id"]],
      });

      let message = `Store ID ${req.body.store_id} related categories`;
      let message_code = "StoreController:getProductCategory-03";
      let message_action =
        "saveProductCategory API is used to save category by stoer id and category name";

      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action
      );
    }
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:addProuctCategory-04";
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
//--getProductCategory: this api is used to return all category as respect to store_cat_id

//saveProductSubCategory--save sub cateory wity catId storeId sub_cat_name
exports.saveProductSubCategory = async (req, reply) => {
  try {
    const results = await saveStoreProductSubCategorySchema.validateAsync(
      req.body
    );
    var productcatArr = await models.ItemSubCategoryMaster.findOne({
      where: {
        store_id: results.store_id,
        cat_id: results.cat_id,
        sub_cat_name: results.sub_cat_name,
      },
    });


    const data = await models.ItemSubCategoryMaster.create({
      store_id: results.store_id,
      cat_id: results.cat_id,
      sub_cat_name: results.sub_cat_name,
    });

    let message = `Sub Category ${req.body.sub_cat_name} added successfully`;
    let message_code = "StoreController:saveProductSubCategory-03";
    let message_action =
      "Get added category by :getProductSubCategory with store_id,cat_id API";

    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action
    );

  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:saveProductSubCategory-04";
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
//saveProductSubCategory--save sub cateory wity catId storeId sub_cat_name

//getProductSubCategory
exports.getProductSubCategory = async (req, reply) => {
  try {
    const results = await getStoreProductSubCategorySchema.validateAsync(
      req.body
    );
    var productcatArr = await models.ItemSubCategoryMaster.findOne({
      where: {
        store_id: results.store_id,
        cat_id: results.cat_id,
        isActive: {
          [Op.ne]: 2,
        },
      },
    });
    if (!productcatArr) {
      let message = `Subcategory not found`;
      let message_code = "StoreController:getProductCategory-01";
      let message_action = "Provides valid store Id and Category Id";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      let arrData = [];
      const dataArr = await models.ItemSubCategoryMaster.findAll({
        where: {
          store_id: results.store_id,
          cat_id: results.cat_id,
          isActive: {
            [Op.ne]: 2,
          },
        },
        attributes: ["sub_cat_name", "cat_id", "id"],
        order: [["id", "DESC"]],
      });

      for (const isubcat of dataArr) {
        // console.log(isubcat)
        const subcatData = {
          sub_cat_name: isubcat.sub_cat_name,
          cat_id: isubcat.cat_id,
          sub_id: isubcat.id,
          subCatIMG:
            "https://res.cloudinary.com/imajkumar/image/upload/v1642656543/iaccess/iaccess1642656542971.jpg",
        };
        arrData.push(subcatData);
      }

      let message = `Product does not  exits respect to cat id and sub cat id`;
      let message_code = "StoreController:getProductSubCategory-03";
      let message_action = "get product list with cat id and susb cat id";

      return Api.setSuccessResponse(
        arrData,
        message,
        message_code,
        message_action
      );
    }
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getProductSubCategory-04";
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
//getProductSubCategory

//getAttributesListWithValues
exports.getAttributesList = async (req, reply) => {
  try {
    var data = await models.StoreAttributesMasters.findAll({
      attributes: [["id", "attr_id"], "attr_name", "CreatedAt"],
    });

    let message = "All Attributes of Stores";
    let message_code = "StoreController:getAttributesListWithValues-03";
    let message_action = "Show list of attributes of stores";

    return Api.setSuccessResponse(data, message, message_code, message_action);
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getAttributesListWithValues-04";
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
//getAttributesListWithValues

//getAttributesListWithValues
exports.getAttributesListWithValues = async (req, reply) => {
  try {
    const attr_id = req.body.attr_id;
    const [data] = await models.sequelize.query(
      `select * from attributeValueMasters where attr_id=${attr_id}`
    );

    let message = "All Attributes of Stores";
    let message_code = "StoreController:getAttributesListWithValues-03";
    let message_action = "Show list of attributes of stores";

    return Api.setSuccessResponse(data, message, message_code, message_action);
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getAttributesListWithValues-04";
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
//getAttributesListWithValues

//updateStoreProduct new
// exports.updateStoreProduct = async (req, reply) => {
//   try {
//     //console.log(req.body.color);
//     const colorArrZ = req.body.color;
//     const colorArrA = [];
//     for (const c of colorArrZ) {
//       colorArrA.push(c.attri_val);
//     }

//     const colorArr = [...new Set(colorArrA)];

//     const sizeArrZ = req.body.size;
//     const sizeArrA = [];
//     for (const s of sizeArrZ) {
//       sizeArrA.push(s.attri_val);
//     }

//     const sizeArr = [...new Set(sizeArrA)];

//     const data = await models.StoreProduct.update(
//       {

//         product_title: req.body.product_title,
//         product_infomation: req.body.product_infomation,
//         product_qty: req.body.product_qty,
//         regular_price: req.body.product_price,
//       },
//       {
//         where: {
//           id: req.body.product_id,
//           store_id: req.body.store_id
//         },
//       }
//     );

//     const dataColorDelete = models.StoreProductColor.update(
//       {
//         isActive: 2,

//       },
//       {
//         where: {
//           id: req.body.product_id,
//           store_id: req.body.store_id,
//         },
//       }
//     );

//     const dataSizeDelete = models.StoreProductSize.update(
//       {
//         isActive: 2,
//       },
//       {
//         where: {
//           id: req.body.product_id,
//           store_id: req.body.store_id,
//         },
//       }
//     );

//     //  --product_color create new data-- 
//     // colorArr.forEach((colorDetails) => {
//     //   const dataColor = models.StoreProductColor.create({
//     //     store_id: req.body.store_id,
//     //     product_id: req.body.product_id,
//     //     color_id: colorDetails,
//     //   });
//     // });
//     // ---product_color create new data--- 

//     /* --product_color update new data-- */
//     colorArr.forEach((colorDetails) => {
//       const dataColor = models.StoreProductColor.update({
//         color_id: colorDetails,
//       }, {
//         where: {
//           store_id: req.body.store_id,
//           product_id: req.body.product_id
//         }
//       });
//     });
//     /* ---product_color update new data--- */


//     //  --product_size create new data-- 
//     // sizeArr.forEach(async (sizeDetails) => {
//     //   const dataSize = await models.StoreProductSize.create({
//     //     store_id: req.body.store_id,
//     //     product_id: req.body.product_id,
//     //     size_id: sizeDetails,
//     //   });
//     // });
//     //  ---product_size create new data--- 

//     /* --product_size update new data-- */
//     sizeArr.forEach(async (sizeDetails) => {
//       const dataSize = await models.StoreProductSize.update({
//         size_id: sizeDetails
//       }, {
//         where: {
//           store_id: req.body.store_id,
//           product_id: req.body.product_id
//         }
//       });
//     });
//     /* ---product_size update new data--- */

//     const dataCatproductUpdate = models.StoreProductCategory.update(
//       {
//         cat_id: req.body.product_cat,
//       },
//       {
//         where: {
//           id: req.body.product_id,
//           store_id: req.body.store_id,
//         },
//       }
//     );

//     const datasubCategoryUpdate = models.StoreProductSubCategory.update(
//       {
//         product_cat_id: req.body.product_cat,
//         product_sub_cat_id: req.body.product_sub_cat,
//       },
//       {
//         where: {
//           id: req.body.product_id,
//           store_id: req.body.store_id,
//         },
//       }
//     );



//     let message = "Your product updated successfully3";
//     let message_code = "StoreController:getAttributesListWithValues-03";
//     let message_action = "Show list of attributes of stores";

//     return Api.setSuccessResponse(
//       dataSizeDelete,
//       message,
//       message_code,
//       message_action
//     );

//   } catch (err) {
//     let data = "opps";
//     let message = err.message;
//     let message_code = "UserController:getAttributesListWithValues-04";
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
// }; 
//updateStoreProduct new


//updateStoreProduct
exports.updateStoreProduct = async (req, reply) => {
  try {
    //console.log(req.body.color);
    const colorArrZ = req.body.color;
    const colorArrA = [];
    for (const c of colorArrZ) {
      colorArrA.push(c.attri_val);
    }
    const colorArr = [...new Set(colorArrA)];

    const sizeArrZ = req.body.size;
    const sizeArrA = [];
    for (const s of sizeArrZ) {
      sizeArrA.push(s.attri_val);
    }
    const sizeArr = [...new Set(sizeArrA)];

    const regularPrice = parseFloat(req.body.product_price)
    const chargeOnProduct = regularPrice * 1.5 / 100;
    const totalPrice = regularPrice + parseFloat(chargeOnProduct) + 1;


    const data = await models.StoreProduct.update(
      {
        product_title: req.body.product_title,
        product_infomation: req.body.product_infomation,
        product_qty: req.body.product_qty,
        regular_price: req.body.product_price,
        extra_price: chargeOnProduct,
        total_price: totalPrice
      },
      {
        where: {
          id: req.body.product_id,
          store_id: req.body.store_id
        },
      }
    );

    const getManageSizeTable = await models.manageProductSize.findOne(
      {
        where: {
          id: req.body.product_id,
          store_id: req.body.store_id
        }
      }
    )

    var totalQty = 0;
    if (getManageSizeTable == null) {
      totalQty = parseInt(req.body.product_qty);
    }
    else {
      totalQty = parseInt(getManageSizeTable.qty) + parseInt(req.body.product_qty);
    }

    const updateManageData = await models.manageProductSize.update(
      {
        qty: totalQty
      },
      {
        where: {
          id: req.body.product_id,
          store_id: req.body.store_id
        }
      }
    )

    // const dataColorDelete = await models.StoreProductColor.update(
    //   {
    //     isActive: 2,
    //   },
    //   {
    //     where: {
    //       product_id: req.body.product_id,
    //       store_id: req.body.store_id,
    //     },
    //   }
    // );

    const ColorDelete = await models.sequelize.query(
      `
      UPDATE
        product_colors 
      SET
       isActive = 2 
      WHERE 
        product_id = ${req.body.product_id}
      OR
        store_id = ${req.body.store_id}
      `
    )
    console.log("dataColorDelete", ColorDelete);

    // const dataSizeDelete = await models.StoreProductSize.update(
    //   {
    //     isActive: 2,
    //   },
    //   {
    //     where: {
    //       product_id: req.body.product_id,
    //       store_id: req.body.store_id,
    //     },
    //   }
    // );

    const sizeDelete = await models.sequelize.query(
      `
      UPDATE
        product_sizes 
      SET
       isActive = 2 
      WHERE 
        product_id = ${req.body.product_id}
      OR
        store_id = ${req.body.store_id}
      `
    )


    const getColorId = await models.sequelize.query(
      `
      SELECT
        color_id
      FROM
        product_colors
      WHERE
        store_id = ${req.body.store_id}
      AND
        product_id = ${req.body.product_id}
      AND
        isActive = 2
      `
    )


    for (const color_id of getColorId[0]) {

      const attrValueDelete = models.sequelize.query(
        `
            UPDATE 
              attributeValueMasters 
            SET
             isActive = 2 
            WHERE 
              attr_value = ${color_id.color_id}
            AND
              store_id = ${req.body.store_id}
            AND
              attr_id=1
            `
      )
    }

    const getSizeId = await models.sequelize.query(
      `
      SELECT
        size_id
      FROM
        product_sizes
      WHERE
        store_id = ${req.body.store_id}
      AND
        product_id = ${req.body.product_id}
      AND
        isActive = 2
      `
    )


    for (const size_id of getSizeId[0]) {

      var attrValueDelete = models.sequelize.query(
        `
            UPDATE 
              attributeValueMasters 
            SET
             isActive = 2 
            WHERE 
              attr_value = ${size_id.size_id}
            AND
              store_id = ${req.body.store_id}
            AND
              attr_id=2
            `
      )
    }



    colorArr.forEach((colorDetails) => {
      const dataColor = models.StoreProductColor.create({
        store_id: req.body.store_id,
        product_id: req.body.product_id,
        color_id: colorDetails,
      });
    });
    sizeArr.forEach(async (sizeDetails) => {
      const dataSize = await models.StoreProductSize.create({
        store_id: req.body.store_id,
        product_id: req.body.product_id,
        size_id: sizeDetails,
      });
    });


    const dataCatproductUpdate = models.StoreProductCategory.update(
      {
        cat_id: req.body.product_cat,
      },
      {
        where: {
          id: req.body.product_id,
          store_id: req.body.store_id,
        },
      }
    );
    const datasubCategoryUpdate = models.StoreProductSubCategory.update(
      {
        product_cat_id: req.body.product_cat,
        product_sub_cat_id: req.body.product_sub_cat,
      },
      {
        where: {
          id: req.body.product_id,
          store_id: req.body.store_id,
        },
      }
    );

    let message = "Your product updated successfully3";
    let message_code = "StoreController:getAttributesListWithValues-03";
    let message_action = "Show list of attributes of stores";

    return Api.setSuccessResponse(attrValueDelete, message, message_code, message_action);
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getAttributesListWithValues-04";
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
//updateStoreProduct

//saveStoreProduct
exports.saveStoreProduct = async (req, reply) => {
  try {
    console.log("Data::::;", req.body);

    const colorArrZ = req.body.color;
    console.log("colorArrZ:", colorArrZ);

    const colorArrA = [];
    for (const c of colorArrZ) {
      colorArrA.push(c.attri_val);
    }
    const colorArr = [...new Set(colorArrA)];

    const sizeArrZ = req.body.size;
    console.log("sizeArrZ:", sizeArrZ);

    const sizeArrA = [];
    for (const s of sizeArrZ) {
      sizeArrA.push(s.attri_val);
    }
    const sizeArr = [...new Set(sizeArrA)];

    // ----- forExtraPrice ----- //
    const regularPrice = parseFloat(req.body.product_price);
    const chargeOnProduct = 1 + (regularPrice * 1.5 / 100);
    const maintenanceFee = regularPrice * 2.5 / 100;
    console.log("regularPrice::", regularPrice);
    console.log("chargeOnProduct::", chargeOnProduct);
    console.log("maintenanceFee::", maintenanceFee);

    const totalPrice = regularPrice + parseFloat(chargeOnProduct);
    console.log("totalPrice::", totalPrice);
    // ----- End forExtraPrice ----- //

    const data = await models.StoreProduct.create({
      store_id: req.body.store_id,
      product_title: req.body.product_title,
      product_infomation: req.body.product_infomation,
      product_qty: req.body.product_qty,
      maintenance_fee: maintenanceFee,
      regular_price: req.body.product_price,
      extra_price: chargeOnProduct,
      total_price: totalPrice
    });
    console.log("data::", data);

    colorArr.forEach(async (colorDetails) => {
      const dataColor = await models.StoreProductColor.create({
        store_id: req.body.store_id,
        product_id: data.id,
        color_id: colorDetails,
      });
      console.log("dataColor:", dataColor);
    });

    sizeArr.forEach(async (sizeDetails) => {
      const dataSize = await models.StoreProductSize.create({
        store_id: req.body.store_id,
        product_id: data.id,
        size_id: sizeDetails,
      });
      console.log("dataSize:", dataSize);
    });
    //StoreProductCategory
    const dataCat = await models.StoreProductCategory.create({
      product_id: data.id,
      store_id: req.body.store_id,
      cat_id: req.body.product_cat,
    });
    console.log("dataCat::", dataCat);

    const dataSubCat = await models.StoreProductSubCategory.create({
      product_cat_id: req.body.product_cat,
      product_sub_cat_id: req.body.product_sub_cat,
      store_id: req.body.store_id,
      product_id: data.id,
    });
    console.log("dataSubCat::", dataSubCat);

    //StoreProductCategory

    let message = "Your product added successfully";
    let message_code = "StoreController:getAttributesListWithValues-03";
    let message_action = "Show list of attributes of stores";

    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action
    );

  } catch (err) {
    console.log("Error::", err);
    let data = "opps";
    let message = err.message;
    let message_code = "UserController:getAttributesListWithValues-04";
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
//saveStoreProduct

//getStoreProductList
exports.getStoreProductList = async (req, reply) => {
  try {
    const { title } = req.query;
    var condition = title
      ? { product_title: { [Op.like]: `%${title}%` } }
      : null;


    // StoreProduct

    var data = await models.StoreProduct.findAndCountAll({
      // where: condition,
      where: {
        store_id: req.query.store_id
      },
    });

    var storesArr = await models.Store.findOne({
      where: {
        id: req.query.store_id,
      },
    });

    const productArrData = [];

    for (const rowData of data.rows) {
      //product
      var [productDataArr] = await models.sequelize.query(
        `
        SELECT 
          t1.*,t2.store_name,t2.store_photo
        FROM 
          products t1 
        JOIN
          stores t2
        ON
          t1.store_id = t2.id 
        WHERE
          t1.isActive!=2 
        AND
          t1.id="${rowData.id}"
        `
      );


      var [soldOut] = await models.sequelize.query(
        `SELECT * FROM  productSoldOuts WHERE  store_id = ${rowData.store_id} AND product_id = ${rowData.id} AND isActive!=2`
      );
      console.log("soldOut", soldOut[0]);




      const productColorArrData = [];
      const productSizeArrData = [];
      const productQTYArrData = [];

      for (const productArr of productDataArr) {
        let catID = "";
        let subcatID = "";

        var catIDArr = await models.StoreProductCategory.findOne({
          where: {
            store_id: storesArr.id,
            product_id: productArr.id,
            isActive: {
              [Op.ne]: 2,
            },
          },
        });

        if (catIDArr) {
          catID = catIDArr.cat_id;
        }
        var catSubIDArr = await models.StoreProductSubCategory.findOne({
          where: {
            store_id: storesArr.id,
            product_id: productArr.id,
            product_cat_id: catID,
            isActive: {
              [Op.ne]: 2,
            },
          },
        });
        if (catSubIDArr) {
          subcatID = catSubIDArr.product_sub_cat_id;
        }

        console.log("rowData.store_id:", rowData.store_id);

        var [productColorArr] = await models.sequelize.query(
          `
          SELECT 
            t1.id,t2.attr_name,t2.attr_code
          FROM 
            product_colors t1 
          JOIN
           attributeValueMasters t2 on t1.color_id = t2.attr_value 
          WHERE
           t1.store_id=${rowData.store_id}  
          AND
           t2.store_id=${rowData.store_id} 
          AND
           t1.product_id=${rowData.id} 
          AND
            t2.isActive = 1
          AND
           t2.attr_id=1
          `
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
          `
          SELECT 
            t1.id,t2.attr_name 
          from
           product_sizes t1 
          join
           attributeValueMasters t2 on t1.size_id=t2.attr_value 
          where
           t1.store_id=${rowData.store_id} 
          and
           t2.store_id=${rowData.store_id} 
          and
           t1.product_id=${rowData.id} 
          and
            t2.isActive = 1 
          and 
            t2.attr_id=2`
        );
        for (const productSize of productSizeArr) {
          //console.log(productColor.attr_name);
          productSizeArrData.push(productSize.attr_name);
        }
        //productQTYArrData
        var [productQtyArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_qty from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${rowData.store_id}  and t2.store_id=${rowData.store_id} and t1.product_id=${rowData.id} and t2.isActive = 1 and t2.attr_id=2`
        );
        for (const productQty of productQtyArr) {
          //console.log(productColor.attr_name);
          productQTYArrData.push(productQty.attr_qty);
        }
        //productQTYArrData

        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${rowData.store_id} and product_id=${rowData.id} and isActive = 1`
        );

        if (catID == "" || subcatID == "") {

          if (soldOut[0] == undefined) {

            var productAll = {
              //reqStatus: pRdata.id,
              reqId: "",
              reqStatus: "",
              products: {
                id: productArr.id,
                store_id: productArr.store_id,
                product_title: productArr.product_title,
                product_infomation: productArr.product_infomation,
                product_photo: productArr.product_photo,
                product_qty: productArr.product_qty,
                regular_price: productArr.regular_price,
                selling_price: productArr.selling_price,
                min_stock_qty: productArr.min_stock_qty,
                isActive: productArr.isActive,
                createdAt: productArr.createdAt,
                updatedAt: productArr.updatedAt,
                store_name: productArr.store_name,
                store_photo: productArr.store_photo,
                soldOut: 0
              },
              productsAttrColor: productColorArrData,
              productsAttrSize: productSizeArrData,
              productsAttrQty: productQTYArrData,
              productsAttrGallry: productGalleryArr,
            };


          } else {

            var productAll = {
              //reqStatus: pRdata.id,
              reqId: "",
              reqStatus: "",
              products: {
                id: productArr.id,
                store_id: productArr.store_id,
                product_title: productArr.product_title,
                product_infomation: productArr.product_infomation,
                product_photo: productArr.product_photo,
                product_qty: productArr.product_qty,
                regular_price: productArr.regular_price,
                selling_price: productArr.selling_price,
                min_stock_qty: productArr.min_stock_qty,
                isActive: productArr.isActive,
                createdAt: productArr.createdAt,
                updatedAt: productArr.updatedAt,
                store_name: productArr.store_name,
                store_photo: productArr.store_photo,
                soldOut: 1
              },
              productsAttrColor: productColorArrData,
              productsAttrSize: productSizeArrData,
              productsAttrQty: productQTYArrData,
              productsAttrGallry: productGalleryArr,
            };
          }


        } else {


          if (soldOut[0] == undefined) {

            var productAll = {
              //reqStatus: pRdata.id,
              reqId: "",
              reqStatus: "",
              products: {
                id: productArr.id,
                store_id: productArr.store_id,
                cat_id: catID,
                subcat_id: subcatID,
                product_title: productArr.product_title,
                product_infomation: productArr.product_infomation,
                product_photo: productArr.product_photo,
                product_qty: productArr.product_qty,
                regular_price: productArr.regular_price,
                selling_price: productArr.selling_price,
                min_stock_qty: productArr.min_stock_qty,
                isActive: productArr.isActive,
                createdAt: productArr.createdAt,
                updatedAt: productArr.updatedAt,
                store_name: productArr.store_name,
                store_photo: productArr.store_photo,
                soldOut: 0
              },
              productsAttrColor: productColorArrData,
              productsAttrSize: productSizeArrData,
              productsAttrQty: productQTYArrData,
              productsAttrGallry: productGalleryArr,
            };


          } else {

            var productAll = {
              //reqStatus: pRdata.id,
              reqId: "",
              reqStatus: "",
              products: {
                id: productArr.id,
                store_id: productArr.store_id,
                cat_id: catID,
                subcat_id: subcatID,
                product_title: productArr.product_title,
                product_infomation: productArr.product_infomation,
                product_photo: productArr.product_photo,
                product_qty: productArr.product_qty,
                regular_price: productArr.regular_price,
                selling_price: productArr.selling_price,
                min_stock_qty: productArr.min_stock_qty,
                isActive: productArr.isActive,
                createdAt: productArr.createdAt,
                updatedAt: productArr.updatedAt,
                store_name: productArr.store_name,
                store_photo: productArr.store_photo,
                soldOut: 1
              },
              productsAttrColor: productColorArrData,
              productsAttrSize: productSizeArrData,
              productsAttrQty: productQTYArrData,
              productsAttrGallry: productGalleryArr,
            };
          }


        }
        productArrData.push(productAll);
      }
    }


    const abc = {
      productDetails: productArrData,
    };
    const ajK = {
      count: data.count,
      rows: abc,
    };

    // return ajK;
    // console.log( data );

    const responseData = getPagingData(ajK);
    let message = "Get list of product of stores with Filter and Pagination";
    let message_code = "StoreController:getStoreProductList-03";
    let message_action = "Get list of product of store by store id";

    return Api.setSuccessResponse(
      responseData,
      message,
      message_code,
      message_action
    );
    //Added paginations with filters now
  } catch (err) {
    let data = "opps Error";
    let message = err.message;
    let message_code = "UserController:getStoreProductList-04";
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

//getStoreProductList
exports.getStoreProductListNEW = async (req, reply) => {
  try {
    const { page, size, title } = req.query;
    var condition = title
      ? { product_title: { [Op.like]: `%${title}%` } }
      : null;
    console.log(title);
    const { limit, offset } = getPagination(page, size);

    // StoreProduct

    var data = await models.StoreProduct.findAndCountAll({
      // where: condition,
      where: { store_id: req.query.store_id },
      limit,
      offset,
    });
    var storesArr = await models.Store.findOne({
      where: {
        id: req.query.store_id,
      },
    });

    const productArrData = [];

    for (const rowData of data.rows) {
      //product
      var [productDataArr] = await models.sequelize.query(
        `SELECT t1.*,t2.store_name,t2.store_photo from  products t1 join stores t2 on t1.store_id=t2.id where t1.isActive!=2 and  t1.id="${rowData.id}"`
      );
      const productColorArrData = [];
      const productSizeArrData = [];
      const productQTYArrData = [];

      for (const productArr of productDataArr) {
        let catID;
        let subcatID;

        var catIDArr = await models.StoreProductCategory.findOne({
          where: {
            store_id: storesArr.id,
            product_id: productArr.id,
            isActive: {
              [Op.ne]: 2,
            },
          },
        });
        if (catIDArr) {
          catID = catIDArr.cat_id;
        }
        var catSubIDArr = await models.StoreProductSubCategory.findOne({
          where: {
            store_id: storesArr.id,
            product_id: productArr.id,
            product_cat_id: catID,
            isActive: {
              [Op.ne]: 2,
            },
          },
        });
        if (catSubIDArr) {
          subcatID = catSubIDArr.product_sub_cat_id;
        }

        var [productColorArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name,t2.attr_code,t2.id as master_id from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${rowData.store_id}  and t2.store_id=${rowData.store_id} and t1.product_id=${rowData.id} and t2.attr_id=1`
        );
        for (const productColor of productColorArr) {
          //console.log(productColor.attr_name);
          const colorData = {
            name: productColor.attr_name,
            code: productColor.attr_code,
            master_id: productColor.master_id,
          };
          productColorArrData.push(colorData);
        }
        var [productSizeArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_name,t2.attr_code,t2.id as master_id from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${rowData.store_id}  and t2.store_id=${rowData.store_id} and t1.product_id=${rowData.id} and t2.attr_id=2`
        );
        for (const productSize of productSizeArr) {
          //console.log(productColor.attr_name);
          const colorData = {
            name: productSize.attr_name,
            code: productSize.attr_code,
            master_id: productSize.master_id,
          };

          productSizeArrData.push(colorData);
        }
        //productQTYArrData
        var [productQtyArr] = await models.sequelize.query(
          `SELECT t1.id,t2.attr_qty, t2.attr_code,t2.id as master_id from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${rowData.store_id}  and t2.store_id=${rowData.store_id} and t1.product_id=${rowData.id} and t2.attr_id=2`
        );
        for (const productQty of productQtyArr) {
          //console.log(productColor.attr_name);

          const colorData = {
            attr_qty: productQty.attr_qty,
            code: productQty.attr_code,
            master_id: productQty.master_id,
          };
          productQTYArrData.push(colorData);

        }
        //productQTYArrData

        var [productGalleryArr] = await models.sequelize.query(
          `SELECT product_img from productGalleries t1 where t1.store_id=${rowData.store_id} and product_id=${rowData.id}`
        );

        const productAll = {
          //reqStatus: pRdata.id,
          reqId: "",
          reqStatus: "",
          products: {
            id: productArr.id,
            store_id: productArr.store_id,
            cat_id: catID,
            subcat_id: subcatID,
            product_title: productArr.product_title,
            product_infomation: productArr.product_infomation,
            product_photo: productArr.product_photo,
            product_qty: productArr.product_qty,
            regular_price: productArr.regular_price,
            selling_price: productArr.selling_price,
            min_stock_qty: productArr.min_stock_qty,
            isActive: productArr.isActive,
            createdAt: productArr.createdAt,
            updatedAt: productArr.updatedAt,
            store_name: productArr.store_name,
            store_photo: productArr.store_photo,
          },
          productsAttrColor: productColorArrData,
          productsAttrSize: productSizeArrData,
          productsAttrQty: productQTYArrData,
          productsAttrGallry: productGalleryArr,
        };
        productArrData.push(productAll);
      }
    }
    const abc = {
      productDetails: productArrData,
    };
    const ajK = {
      count: data.count,
      rows: abc,
    };

    // return ajK;
    // console.log( data );

    const responseData = getPagingData(ajK, page, limit);
    let message = "Get list of product of stores with Filter and Pagination";
    let message_code = "StoreController:getStoreProductList-03";
    let message_action = "Get list of product of store by store id";

    return Api.setSuccessResponse(
      responseData,
      message,
      message_code,
      message_action
    );
    //Added paginations with filters now
  } catch (err) {
    let data = "opps Error";
    let message = err.message;
    let message_code = "UserController:getStoreProductList-04";
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

//setColorToStore
exports.setColorToStore = async (req, reply) => {

  try {
    const results = await setColorToStoreSchme.validateAsync(req.body);
    console.log("Data:", results);
    var dataC = [];

    for (const attr_sizeVal of results.attr_color) {
      // console.log( attr_sizeVal );
      const attr_sizeX = attr_sizeVal;

      console.log("attr_sizeX::", attr_sizeX);

      const attrvArr = await models.StoreAttributesValuesMasters.findOne({
        where: {
          store_id: results.store_id,
          attr_name: attr_sizeX
        },
      });
      console.log("attrvArr::", attrvArr);

      const attrvArrA = await models.StoreAttributesValuesMasters.findOne({
        attributes: [
          [
            models.sequelize.fn("max", models.sequelize.col("attr_value")),
            "maxV",
          ],
        ],
        where: { store_id: results.store_id, attr_id: 1 },
        raw: true,
      });
      console.log("attrvArrA::", attrvArrA);

      const AttrVX = attrvArrA.maxV + 1;

      console.log("AttrVX::", AttrVX);

      const A = await models.StoreAttributesValuesMasters.create({
        store_id: results.store_id,
        attr_id: 1,
        attr_value: AttrVX,
        attr_name: attr_sizeX,
        attr_code: attr_sizeX,
      });
      console.log("A Data::", A);

      var FinalData = {
        id: A.id,
        attr_id: A.attr_id,
        attr_name: A.attr_name,
        attr_value: A.attr_value,
        attr_code: A.attr_code,
        CreatedAt: A.createdAt,
      }
      dataC.push(FinalData);
      // console.log("A", A);
    }

    console.log("dataC::", dataC);



    // for (const attr_sizeValX of results.attr_color) {
    //   const attr_sizeXA = attr_sizeValX;
    //   var dataw = await models.StoreAttributesValuesMasters.findOne({
    //     attributes: [
    //       ["id", "id"],
    //       "attr_id",
    //       "attr_name",
    //       "attr_value",
    //       "attr_code",
    //       "CreatedAt",
    //     ],
    //     where: {
    //       store_id: results.store_id,
    //       attr_id: 1,
    //       attr_code: attr_sizeXA,
    //     },
    //   });
    //   dataC.push(dataw);
    // }


    // var dataw = await models.StoreAttributesValuesMasters.findAll({
    //   attributes: [["id", "attr_id"], "attr_name", "CreatedAt"],
    //   where: { store_id: results.store_id, attr_id: 2 },
    // });

    let data = dataC;
    let message = "";
    let message_code = "UserController:setColorToStore-04";
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
    let data = "opps Error";
    let message = err.message;
    let message_code = "UserController:setColorToStore-04";
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

//setSizeToStoreAOL
exports.setSizeToStoreAOL = async (req, reply) => {
  try {
    const results = await setSizeToStore.validateAsync(req.body);

    for (const attr_sizeVal of results.attr_size) {
      console.log(attr_sizeVal);
      const attr_sizeX = attr_sizeVal;
      const attrvArr = await models.StoreAttributesValuesMasters.findOne({
        where: { store_id: results.store_id, attr_name: attr_sizeX },
      });
      if (attrvArr) {
      } else {
        const attrvArrA = await models.StoreAttributesValuesMasters.findOne({
          attributes: [
            [
              models.sequelize.fn("max", models.sequelize.col("attr_value")),
              "maxV",
            ],
          ],
          where: { store_id: results.store_id, attr_id: 2 },
          raw: true,
        });

        const AttrVX = attrvArrA.maxV + 1;

        const A = await models.StoreAttributesValuesMasters.create({
          store_id: results.store_id,
          attr_id: 2,
          attr_value: AttrVX,
          attr_name: attr_sizeX,
        });
      }
    }

    var dataC = [];
    for (const attr_sizeValX of results.attr_size) {
      const attr_sizeXA = attr_sizeValX;
      var dataw = await models.StoreAttributesValuesMasters.findOne({
        attributes: [["id", "attr_id"], "attr_name", "CreatedAt"],
        where: {
          store_id: results.store_id,
          attr_id: 2,
          attr_name: attr_sizeXA,
        },
      });
      dataC.push(dataw);
    }

    // var dataw = await models.StoreAttributesValuesMasters.findAll({
    //   attributes: [["id", "attr_id"], "attr_name", "CreatedAt"],
    //   where: { store_id: results.store_id, attr_id: 2 },
    // });

    let data = dataC;
    let message = "";
    let message_code = "UserController:getStoreProductList-04";
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
    let data = "opps Error";
    let message = err.message;
    let message_code = "UserController:getStoreProductList-04";
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

exports.setSizeToStoreOK = async (req, reply) => {
  try {
    const results = await setSizeToStore.validateAsync(req.body);

    for (const attr_sizeVal of results.attr_size) {
      console.log(attr_sizeVal);
      const attr_sizeX = attr_sizeVal;
      const attrvArr = await models.StoreAttributesValuesMasters.findOne({
        where: { store_id: results.store_id, attr_name: attr_sizeX },
      });
      if (attrvArr) {
      } else {
        const attrvArrA = await models.StoreAttributesValuesMasters.findOne({
          attributes: [
            [
              models.sequelize.fn("max", models.sequelize.col("attr_value")),
              "maxV",
            ],
          ],
          where: { store_id: results.store_id, attr_id: 2 },
          raw: true,
        });

        const AttrVX = attrvArrA.maxV + 1;

        const A = await models.StoreAttributesValuesMasters.create({
          store_id: results.store_id,
          attr_id: 2,
          attr_value: AttrVX,
          attr_name: attr_sizeX,
        });
      }
    }

    var dataC = [];
    for (const attr_sizeValX of results.attr_size) {
      const attr_sizeXA = attr_sizeValX;
      var dataw = await models.StoreAttributesValuesMasters.findOne({
        attributes: [
          ["id", "id"],
          "attr_id",
          "attr_name",
          "attr_value",
          "attr_code",
          "CreatedAt",
        ],
        where: {
          store_id: results.store_id,
          attr_id: 2,
          attr_name: attr_sizeXA,
        },
      });
      dataC.push(dataw);
    }

    // var dataw = await models.StoreAttributesValuesMasters.findAll({
    //   attributes: [["id", "attr_id"], "attr_name", "CreatedAt"],
    //   where: { store_id: results.store_id, attr_id: 2 },
    // });

    let data = dataC;
    let message = "";
    let message_code = "UserController:getStoreProductList-04";
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
    let data = "opps Error";
    let message = err.message;
    let message_code = "UserController:getStoreProductList-04";
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

exports.setSizeToStore = async (req, reply) => {
  try {
    const results = await setSizeToStore.validateAsync(req.body);
    var dataC = [];

    var QTYArr = results.attr_qty;
    var i = 0;
    for (const attr_sizeVal of results.attr_size) {
      console.log(QTYArr[i]);
      const attr_sizeX = attr_sizeVal;
      const attrvArr = await models.StoreAttributesValuesMasters.findOne({
        where: { store_id: results.store_id, attr_name: attr_sizeX },
      });

      const attrvArrA = await models.StoreAttributesValuesMasters.findOne({
        attributes: [
          [
            models.sequelize.fn("max", models.sequelize.col("attr_value")),
            "maxV",
          ],
        ],
        where: { store_id: results.store_id, attr_id: 2 },
        raw: true,
      });

      const AttrVX = attrvArrA.maxV + 1;

      const A = await models.StoreAttributesValuesMasters.create({
        store_id: results.store_id,
        attr_id: 2,
        attr_value: AttrVX,
        attr_name: attr_sizeX,
        attr_qty: QTYArr[i],
      });
      i++;


      const FinalData = {
        id: A.id,
        attr_id: A.attr_id,
        attr_name: A.attr_name,
        attr_qty: A.attr_qty,
        attr_value: A.attr_value,
        attr_code: A.attr_code,
        CreatedAt: A.createdAt,
      }
      dataC.push(FinalData);
    }

    // for (const attr_sizeValX of results.attr_size) {
    //   const attr_sizeXA = attr_sizeValX;
    //   var dataw = await models.StoreAttributesValuesMasters.findOne({
    //     attributes: [
    //       ["id", "id"],
    //       "attr_id",
    //       "attr_name",
    //       "attr_qty",
    //       "attr_value",
    //       "attr_code",
    //       "CreatedAt",
    //     ],
    //     where: {
    //       store_id: results.store_id,
    //       attr_id: 2,
    //       attr_name: attr_sizeXA,
    //     },
    //   });
    //   dataC.push(dataw);
    // }

    // var dataw = await models.StoreAttributesValuesMasters.findAll({
    //   attributes: [["id", "attr_id"], "attr_name", "CreatedAt"],
    //   where: { store_id: results.store_id, attr_id: 2 },
    // });




    let data = dataC;
    let message = "";
    let message_code = "UserController:getStoreProductList-04";
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
    let data = "opps Error";
    let message = err.message;
    let message_code = "UserController:getStoreProductList-04";
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

exports.userRequestItemToStore = async (req, reply) => {
  try {

    const result = await userRequestItemToStore.validateAsync(req.body);

    const productDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
      {
        where: {
          store_id: result.store_id
        },
        group: ['user_id'],
        order: [["status", "DESC"]]
      }
    );
    console.log("productDataArr::", productDataArr.length);

    const productDataResponse = [];
    for (const fProductData of productDataArr) {

      const userData = await models.User.findOne(
        {
          where: {
            id: fProductData.user_id
          }
        }
      );
      // console.log("userData::", userData);

      const userDataResponse = {
        user_id: userData.id,
        phoneVerify: userData.phoneVerify,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: userData.email,
        avatar: userData.avatar,
        gender: userData.gender,
        role: userData.role,
        isActive: userData.isActive,
        createdAt: userData.createdAt,
      }

      var requestProductArrA = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            user_id: fProductData.user_id,
            store_id: fProductData.store_id
          },
          group: ["req_id"],
          order: [["status", "DESC"]]
        }
      );
      // console.log("requestProductArr::", requestProductArr);

      var [requestProductArr] = await models.sequelize.query(
        `
        SELECT * FROM users_product_store_accepteds WHERE user_id=${fProductData.user_id} AND store_id = ${result.store_id} ORDER BY users_product_store_accepteds.status DESC, id DESC
        `
      );
      console.log("userId&StoreId::", requestProductArr.length);

      for (const productRData of requestProductArr) {
        console.log("productRDataProduct_id::", productRData.product_id);
        console.log("productRDataStore_id::", productRData.store_id);

        const [productData] = await models.sequelize.query(
          `
          SELECT t1.*, t2.store_name, t2.store_photo FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.id = ${productRData.product_id}
          `
        )
        // console.log("productData::",productData);

        const productColorData = [
          {
            "name": productRData.color,
            "code": productRData.color
          }
        ]

        const productSizeData = [
          productRData.size
        ]

        const [productGalleryData] = await models.sequelize.query(
          `
          SELECT product_img FROM productGalleries WHERE store_id = ${productRData.store_id} AND product_id = ${productRData.product_id} AND isActive = 1
          `
        )
        // console.log("galleryIds::;", productRData.product_id, productRData.store_id);

        const maintenanceFee = parseFloat(productData[0].regular_price) * 2.5 / 100;
        const regularPrice = parseFloat(productData[0].regular_price) - parseFloat(maintenanceFee);
        console.log("maintenanceFee::", maintenanceFee);

        const finalProductData = {
          reqId: productRData.req_id,
          reqStatus: productRData.status,
          products: {
            id: productData[0].id,
            store_id: productData[0].store_id,
            user_id: fProductData.user_id,
            user_name: userData.firstName,
            product_title: productData[0].product_title,
            product_infomation: productData[0].product_infomation,
            product_photo: productData[0].product_photo,
            product_qty: productData[0].product_qty,
            regular_price: regularPrice,
            selling_price: productData[0].selling_price,
            min_stock_qty: productData[0].min_stock_qty,
            isActive: productData[0].isActive,
            createdAt: productData[0].createdAt,
            updatedAt: productData[0].updatedAt,
            store_name: productData[0].store_name,
            store_photo: productData[0].store_photo,
          },
          productsAttrColor: productColorData,
          productsAttrSize: productSizeData,
          productsAttrGallry: productGalleryData
        }
        productDataResponse.push(finalProductData)
      }
      // console.log("productDataResponse:::",productDataResponse);
      var response = {
        userDetail: userDataResponse,
        productDetails: productDataResponse
      }
    }

    let data = response;
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

//getStoreProductList

/*
 models.Store.belongsTo(models.StoreCategory,{foreignKey: 'store_cat_id'});
     models.StoreCategory.hasMany( models.Store,{foreignKey : 'id'});
    var arr = await models.Store.findAll({include: [models.StoreCategory]});
let data=[];
    arr.forEach(userDetails => {


      data.push({
        store_id: userDetails.id,
        store_photo: userDetails.store_photo,
        store_address: userDetails.store_address,
        securiy_pin: userDetails.securiy_pin,
        phoneVerify: userDetails.phoneVerify,
        phone: userDetails.phone,
        email: userDetails.email,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        role: userDetails.role,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        store_cate_name:userDetails.storeCategoryMaster.store_category_name,
        store_cate_id:userDetails.id
      });
    });
*/

exports.deleteProductById = async (req, reply) => {
  try {
    const results = await deleteProductByIdSchema.validateAsync(req.body);

    const dataA = await models.StoreProduct.update(
      {
        isActive: 2,
      },
      {
        where: {
          id: results.product_id,
        },
      }
    );

    let data = dataA;
    let message = "Deleted Successfully";
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
    let message_code = "deleteProductById:userSearch-02";
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

//deleteCategoryById
exports.deleteCategoryById = async (req, reply) => {
  try {
    const results = await deleteCategoryByIdSchema.validateAsync(req.body);

    const dataAA = await models.ItemCategoryMaster.update(
      {
        isActive: 2,
      },
      {
        where: {
          //store_id: results.store_id,
          id: results.cat_id,
        },
      }
    );

    const dataAAA = await models.ItemSubCategoryMaster.update(
      {
        isActive: 2,
      },
      {
        where: {
          //store_id: results.store_id,
          cat_id: results.cat_id,
        },
      }
    );

    const dataAS = await models.StoreProductCategory.update(
      {
        isActive: 2,
      },
      {
        where: {
          //store_id: results.store_id,
          cat_id: results.cat_id,
        },
      }
    );

    const dataA = await models.StoreProductSubCategory.update(
      {
        isActive: 2,
      },
      {
        where: {
          //store_id: results.store_id,
          product_cat_id: results.cat_id,
        },
      }
    );


    var [productArrData] = await models.sequelize.query(
      `SELECT product_id from productCategories where cat_id = ${results.cat_id}`
    );
    for (const productData of productArrData) {
      const dataADE = await models.StoreProduct.update(
        {
          isActive: 2,
        },
        {
          where: {
            //store_id: results.store_id,
            id: productData.product_id,
          },
        }
      );
    }


    let data = dataA;
    let message = "Deleted Successfully";
    let message_code = "UserController:deleteCategoryById-02";
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
    let message_code = "deleteProductById:userSearch-02";
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
//deleteCategoryById

//deletesubCategoryById
exports.deletesubCategoryById = async (req, reply) => {
  try {
    const results = await deleteSubCategoryByIdSchema.validateAsync(req.body);

    const dataAAA = await models.sequelize.query(
      `
      UPDATE 
        itemSubCategories 
      SET
       isActive = 2 
      WHERE 
        id = ${results.sub_cat_id};
      `
    )

    const dataA = await models.sequelize.query(
      `
      UPDATE 
        productSubCategories 
      SET
       isActive = 2 
      WHERE 
        product_sub_cat_id = ${results.sub_cat_id};
      `
    )

    // --- For Product Deletation ---
    const productDeleteData = await models.StoreProductSubCategory.findOne(
      {
        where: {
          product_sub_cat_id: results.sub_cat_id
        }
      }
    );

    const deleteProductData = await models.sequelize.query(
      `
      UPDATE 
        products 
      SET
       isActive = 2 
      WHERE 
        id = ${productDeleteData.product_id};
      `
    )
    // ----- For Product Deletation -----

    const [categoryData] = await models.StoreProductSubCategory.findAll(
      {
        where: {
          product_sub_cat_id: results.sub_cat_id
        }
      }
    );
    console.log("categoryData", [categoryData]);

    const arrcategoryData = [categoryData]
    for (const product_cat_id of arrcategoryData) {

      var updateProduct = await models.sequelize.query(
        `
      UPDATE 
        productCategories 
      SET
       isActive = 2 
      WHERE 
        id = ${product_cat_id.product_id};
      `
      )
    }

    var [productArrData] = await models.sequelize.query(
      `
      SELECT 
        product_id
      from
       productSubCategories 
      where
       product_sub_cat_id = ${results.sub_cat_id}
      `
    );
    for (const productData of productArrData) {
      // const dataADE = await models.StoreProduct.update(
      //   {
      //     isActive: 2,
      //   },
      //   {
      //     where: {
      //       //store_id: results.store_id,
      //       id: productData.product_id,
      //     },
      //   }
      // );

      var updateProductTable = await models.sequelize.query(
        `
      UPDATE 
        products 
      SET
       isActive = 2 
      WHERE 
        id = ${productData.product_id};
      `
      )
    }


    let data = dataA;
    let message = "Deleted Successfully";
    let message_code = "UserController:deletesubCategoryById-02";
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
    let message_code = "deleteProductById:userSearch-02";
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
/*-- deletesubCategoryById-- */


/* Unique Store Name */
exports.uniqueStoreName = async (req, res) => {
  try {

    const result = await uniqueStoreNameSchema.validateAsync(req.body);

    const data = await models.Store.findOne({
      where: {
        store_name: result.storename
      }
    })

    if (data) {
      let message = "Store Already Exist";
      let message_code = "StoreController:uniqueStoreName";
      let message_action = "store is exist";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      let message = "Store Is Not Exist";
      let message_code = "StoreController:uniqueStoreName";
      let message_action = "store is not exist";
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
    let data = "opps!";
    let message = err.message;
    let message_code = "StoreController:uniqueStoreName";
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
/* --Unique Store Name-- */

/* Update FCM Token */
exports.tokenUpdate = async (req, res) => {
  try {

    const data = await fmcTokenUpdate.validateAsync(req.body);
    console.log("==>", data);

    if (data.store_id) {

      const fcmTokenUpdateByStoreId = await models.Store.update(
        {
          fcm_token: data.fcm_token,
        }, {
        where: {
          id: data.store_id
        }
      });

      let message = "Updated Successfully";
      let message_code = "StoreController:fcmTokenUpdateByStoreId";
      let message_action = "catched Error:";
      let api_token = "";
      return Api.setSuccessResponse(
        message,
        message_code,
        message_action,
        api_token
      );

    } else if (data.user_id) {

      const fcmTokenUpdateByUserId = await models.User.update(
        {
          fcm_token: data.fcm_token,
        }, {
        where: {
          id: data.user_id
        }
      })

      let message = "Updated Successfully";
      let message_code = "StoreController:fcmTokenUpdateByUserId";
      let message_action = "catched Error:";
      let api_token = "";
      return Api.setSuccessResponse(
        message,
        message_code,
        message_action,
        api_token
      );

    } else {
      let data = "opps!";
      let message = err.message;
      let message_code = "StoreController:fcmTokenUpdate";
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

  } catch (error) {
    let data = "opps!";
    let message = err.message;
    let message_code = "StoreController:fcmTokenUpdate";
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
/* --Update FCM Token-- */

/* fcmTokenRemove */
exports.tokenRemove = async (req, res) => {
  try {
    const data = await fcmTokemRemove.validateAsync(req.body);
    console.log("==>", data);

    if (data.store_id) {

      const fcmTokenRemoveByStoreId = await models.Store.update(
        {
          fcm_token: null,
        }, {
        where: {
          id: data.store_id
        }
      });

      let message = "fcm Token Remove Successfully";
      let message_code = "StoreController:fcmTokenRemoveByStoreId";
      let message_action = "catched Error:";
      let api_token = "";
      return Api.setSuccessResponse(
        message,
        message_code,
        message_action,
        api_token
      );

    } else if (data.user_id) {

      const fcmTokenRemoveByUserId = await models.User.update(
        {
          fcm_token: null,
        }, {
        where: {
          id: data.user_id
        }
      });

      let message = "fcm Token Remove Successfully";
      let message_code = "StoreController:fcmTokenRemoveByUserId";
      let message_action = "catched Error:";
      let api_token = "";
      return Api.setSuccessResponse(
        message,
        message_code,
        message_action,
        api_token
      );

    } else {
      let data = "opps!";
      let message = err.message;
      let message_code = "StoreController:fcmTokenUpdate";
      let message_action = "catched Error:";
      let api_token = "";
      return Api.setErrorResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      )
    }

  } catch (error) {
    let data = "opps!";
    let message = err.message;
    let message_code = "StoreController:fcmTokenUpdate";
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
/* --fcmTokenRemove-- */

/* updateStoreDetails */
exports.updateStoreDetails = async (req, res) => {
  try {

    const result = await updateStoreDetails.validateAsync(req.body);
    console.log("==>", result);

    const storeOpeningDays = await models.StoreTiming.update(
      {
        sun_open: result.store_opening_days.sun_open,
        mon_open: result.store_opening_days.mon_open,
        tue_open: result.store_opening_days.tue_open,
        wed_open: result.store_opening_days.wed_open,
        thurs_open: result.store_opening_days.thurs_open,
        fri_open: result.store_opening_days.fri_open,
        sat_open: result.store_opening_days.sat_open,
        all_days_open: result.all_days_open,
        all_day_open_timing: result.all_day_open_timing
      }, {
      where: {
        store_id: result.store_id
      }
    }
    );

    const updateData = await models.Store.update(
      {
        store_name: result.storename,
        deviceType: result.deviceType,
        fcm_token: result.fcm_token,
        password: result.password,
        securiy_pin: result.securiy_pin,
        store_address: result.store_address,
        store_lat: result.store_lat,
        store_long: result.store_long,
        // store_category: result.store_category,
      },
      {
        where: {
          id: result.store_id
        }
      }
    );

    let message = "Store Updated ";
    let message_code = "StoreController:updateStoreDetails";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {

    let data = "opps";
    let message = err.message;
    let message_code = "StoreController:updateStoreDetails";
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
/* --updateStoreDetails-- */

/* Product Details With ProductColor, ProductSize, ProductGallery By userId, storeId and productId */
exports.productDetails = async (req, res) => {
  try {

    const result = await productDetails.validateAsync(req.body);
    console.log("result:", result);

    let storeId = result.store_id;
    let productId = result.product_id;
    let userId = result.user_id;

    console.log("datas:::", storeId, productId, userId);

    const [product] = await models.sequelize.query(
      `
      SELECT
        products.*,
        stores.store_name,
        stores.store_photo
      FROM
        products
      JOIN
        stores
      WHERE
        products.id = ${productId}
      AND
        stores.id = products.store_id
      `
    );
    console.log("product::", product);

    const finalData = {
      "id": product[0].id,
      "user_id": product[0].user_id,
      "store_id": product[0].store_id,
      "store_name": product[0].store_name,
      "product_title": product[0].product_title,
      "product_infomation": product[0].product_infomation,
      "product_photo": product[0].product_photo,
      "product_qty": product[0].product_qty,
      "regular_price": product[0].regular_price,
      "extra_price": product[0].extra_price,
      "total_price": product[0].total_price,
      "selling_price": product[0].selling_price,
      "min_stock_qty": product[0].min_stock_qty,
      "store_photo": product[0].store_photo,
      "createdAt": product[0].createdAt,
      "updatedAt": product[0].updatedAt,
      "isActive": product[0].isActive,
    }

    var [productColor] = await models.sequelize.query(
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
        t1.store_id=${storeId}
      AND
        t2.store_id=${storeId}
      AND
        t1.product_id=${productId}
      AND
        t2.isActive = 1
      AND
        t2.attr_id = 1
      `
    );

    var [productSizeArr] = await models.sequelize.query(
      `
      SELECT
        t2.attr_name
      AS
        size
      FROM
        product_sizes t1
      JOIN
        attributeValueMasters t2
      ON
        t1.size_id = t2.attr_value
      WHERE
        t1.store_id=${storeId}
      AND
        t2.store_id=${storeId}
      AND
        t1.product_id=${productId}
      AND
        t2.isActive = 1
      AND
        t2.attr_id = 2
      `
    );
    console.log("productSizeArr[0]::", productSizeArr[0]);
    console.log("productSizeArr::", productSizeArr);

    let productSize = [];

    for (const getProdctSize of productSizeArr) {

      console.log("getProdctSize::", getProdctSize);

      const productStock = await models.manageProductSize.findOne(
        {
          where: {
            store_id: storeId,
            product_id: productId,
            size: getProdctSize.size,
          }
        }
      );
      console.log("QTY:::", productStock);

      if (productStock == null) {

        productSize.push(getProdctSize)

      } else {

        if (productStock.qty != 0) {
          productSize.push(getProdctSize)
        }

      }


    }


    var [productGallery] = await models.sequelize.query(
      `
      SELECT
       product_img
      FROM 
       productGalleries
      WHERE
        productGalleries.store_id=${storeId} 
      AND
       product_id=${productId}
      AND
        isActive = 1
      `
    );




    // var userRequestData =
    //   await models.UserProductItemRequetAcceptedStore.findOne({
    //     where: {
    //       user_id: userId,
    //       store_id: storeId,
    //       product_id: productId,
    //       status: {
    //         [Op.ne]: [4, 10],
    //       },
    //     },
    //   });

    var [userRequestData] = await models.sequelize.query(
      `
      SELECT * FROM users_product_store_accepteds WHERE user_id = ${userId} AND store_id = ${storeId} AND product_id = ${productId} AND status NOT IN (4,10)
      `
    );
    console.log("userRequestData::;", userRequestData);

    const userCartData = await models.UserAddTCart.findOne({
      where: {
        user_id: userId,
        store_id: storeId,
        product_id: productId
      }
    });

    let hideCart = 0;
    let hideRequest = 0;

    if (userRequestData[0] == null) {
      hideRequest = 0;
    } else {
      hideRequest = 1;
    }

    if (userCartData) {
      hideCart = 1;
    } else {
      hideCart = 0;
    }

    const [soldOut] = await models.sequelize.query(
      `
      SELECT * FROM productSoldOuts WHERE store_id = ${storeId} AND product_id = ${productId} AND isActive!=2
      `
    )


    if (soldOut[0] == undefined) {
      var Data = {
        product: finalData,
        productColor: productColor,
        productSizes: productSize,
        productGalleries: productGallery,
        hideCart: hideCart,
        hideRequest: hideRequest,
        soldOut: 0
      }
    } else {
      var Data = {
        product: finalData,
        productColor: productColor,
        productSizes: productSize,
        productGalleries: productGallery,
        hideCart: hideCart,
        hideRequest: hideRequest,
        soldOut: 1
      }
    }






    let message = "List of product By UserId, StoreId, ProductId";
    let message_code = "UserController:productDetails";
    let message_action = "catched Error:";
    let api_token = "";
    return Api.setSuccessResponse(
      Data,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("--", error);
    let data = "opps";
    let message = err.message;
    let message_code = "StoreController:updateStoreDetails";
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



// ---openCloseStore ---
exports.openCloseStore = async (req, reply) => {
  try {
    const result = await openCloseStoreSchema.validateAsync(req.body);

    const store = await models.Store.findOne({
      where: {
        id: result.store_id
      }
    })

    if (store) {

      const checkStatus = await models.Store.update({
        status: result.status
      }, {
        where: {
          id: result.store_id
        }
      })
      const data = {
        data: checkStatus[0]
      }

      let message = "Store Detail";
      let message_code = "StoreController:storeStatus-01";
      let message_action = "status: 0 open 1 close";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action
      );
    } else {

      let message = "Store Not Exitst";
      let message_code = "StoreController:storeLogin-01";
      let message_action = "catched Error:";
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
      // let message_code = "StoreController:addStoreData-02";
      // let message_action = "catched Error:";
      // let api_token = "";
      // return Api.setErrorResponse(
      //   data,
      //   message,
      //   message_code,
      //   message_action,
      //   api_token
      // );
    }


  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "StoreController:StoreDataUpdateById-03";
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
// --- End openCloseStore ---


// --- addStoreCardDetails ---
exports.addStoreCardDetails = async (req, reply) => {
  try {

    const storeData = await addStoreCardDetailsSchema.validateAsync(req.body);
    console.log("storeData:", storeData);

    const insertDetails = await models.userCardDetails.create(
      {
        store_id: storeData.store_id,
        holderName: storeData.holderName,
        cardNumber: storeData.cardNumber,
        cardExpiryDate: storeData.cardExpiryDate,
        cvvNumber: parseInt(storeData.cvvNumber),
        cardType: storeData.cardType,
        zipcode: storeData.zipcode,
        cardService: storeData.cardService,
      }
    );
    console.log("storeInsertDetails:", insertDetails);

    let message = "storeCardDetails Inserted ";
    let message_code = "storeController:addStoreCardDetails-01";
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
    let message_code = "StoreController:addStoreCardDetails-02";
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
// --- End addStoreCardDetails ---


// --- getStoreCardDetails ---
exports.getStoreCardDetails = async (req, reply) => {
  try {

    const result = await getStoreCardDetailsSchema.validateAsync(req.body);
    console.log("Data:", result);

    const getDefaultCardDetails = await models.userCardDetails.findOne(
      {
        where: {
          store_id: result.store_id,
          defaultCard: 1
        }
      }
    );
    console.log("getStoreCardDetails:", getCardDetails);

    const getCardDetails = await models.userCardDetails.findAll(
      {
        where: {
          store_id: result.store_id,
          defaultCard: 0
        }
      }
    );

    const response = {
      DefaultCard: getDefaultCardDetails,
      otherCard: getCardDetails
    }

    // if (getCardDetails[0] == undefined) {
    //   let message = "store is not exist";
    //   let message_code = "StoreController:getStoreCardDetails-01";
    //   let message_action = "Get back to login or Get started screen";
    //   let api_token = "";
    //   return Api.setSuccessResponse(
    //     message,
    //     message_code,
    //     message_action,
    //     api_token
    //   );
    // } else {
    let message = "Get Store Card Details";
    let message_code = "StoreController:getStoreCardDetails-02";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      response,
      message,
      message_code,
      message_action,
      api_token
    );
    // }



  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "StoreController:getStoreCardDetails-03";
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
// --- getStoreCardDetails ---


// --- deleteStoreCardDetails ---
exports.deleteStoreCardDetails = async (req, reply) => {
  try {

    const result = await deleteStoreCardDetailsSchema.validateAsync(req.body);
    console.log("Data:", result);

    const deleteCardDetails = await models.sequelize.query(
      `
      DELETE FROM userCardDetails WHERE id = ${result.card_id} AND store_id = ${result.store_id}
      `
    );
    let message = "store deleted";
    let message_code = "StoreController:deleteStoreCardDetails-01";
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
    let message_code = "StoreController:deleteStoreCardDetails-02";
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
// --- End deleteStoreCardDetails ---


// --- defaultCardStore ---
exports.defaultCardStore = async (req, reply) => {
  try {

    const result = await defaultCardStoreSchema.validateAsync(req.body);
    console.log("Data:", result);

    const setDefaultCard = await models.userCardDetails.update(
      {
        defaultCard: 1
      },
      {
        where: {
          id: result.card_id,
          store_id: result.store_id,
        }
      }
    );
    let message = `card set as default card`;
    let message_code = "StoreController:defaultCardStore-01";
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
    let message_code = "StoreController:defaultCardStore-02";
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
// --- End defaultCardStore ---


// --- withdrawByStore ---
exports.withdrawByStore = async (req, reply) => {
  try {

    const result = await withdrawByStoreSchema.validateAsync(req.body);
    console.log("Data::", result);

    const getStore = await models.Store.findOne(
      {
        where: {
          id: result.store_id
        }
      }
    );
    console.log("getStore::", getStore);

    const getCardDetails = await models.userCardDetails.findOne(
      {
        where: {
          id: result.card_id
        }
      }
    );

    console.log("getCardDetails::", getCardDetails);

    console.log("cardNumber::", getCardDetails.cardNumber);
    console.log("cvvNumber::", getCardDetails.cvvNumber);

    const finalCardNumber = getCardDetails.cardNumber.toString();
    const finalCvvNumber = getCardDetails.cvvNumber.toString();

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
    );
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

    const customer = await stripe.customers.create({
      email: getStore.email,
      name: getStore.store_name
    });
    console.log("customer::", customer);

    const getStoreData = await models.Store.findOne(
      {
        where: {
          id: result.store_id
        }
      }
    );

    const insertInAdminAmount = await models.adminAmount.create(
      {
        admin_amount: result.withdrawFee,
        comment: "Transfer Revenue"
      }
    )
    console.log("insertInAdminAmount::", insertInAdminAmount);

    const insertTrasaction = await models.Transaction.create(
      {
        store_id: result.store_id,
        type: 2,
        message: `${getStoreData.store_name} withdrawal ${result.amount} from your wallet using this card ${finalCardNumber}`,
        transactions: result.amount,
        status: 13
      }
    )



    // const transfer = await stripe.transfers.create({
    //   description: 'Add in bank account',
    //   amount: 100 * 100,
    //   currency: 'inr',
    //   destination: 'acct_1032D82eZvKYlo2C',
    //   source_type: "card",
    //   transfer_group: "ORDER_95"
    // }).then(() => {
    //   console.log("Successfull");
    // }).catch((err) => {
    //   console.log("error:", err);
    // })

    // const transfer = await stripe.transfers.create({
    //   amount: 400,
    //   currency: 'inr',
    //   destination: `${customer.id}`,
    // });
    // console.log("transfer::", transfer);

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "StoreController:defaultCardStore-02";
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
// --- End withdrawByStore ---


// --- productSoldOut ---
exports.productSoldOut = async (req, res) => {
  try {

    const data = await productSoldOutSchema.validateAsync(req.body);
    console.log("Data::", data);

    const insertSoldOutProduct = await models.productSoldOut.create(
      {
        store_id: data.store_id,
        product_id: data.product_id,
        isActive: 0
      }
    );
    console.log("insertSoldOutProduct::", insertSoldOutProduct);

    const updateProduct = await models.StoreProduct.update(
      {
        isActive: 3
      },
      {
        where: {
          id: data.product_id
        }
      }
    );
    console.log("updateProduct::", updateProduct);

    let message = "product sold out";
    let message_code = "StoreController:productSoldOut-01";
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
    let message_code = "StoreController:defaultCardStore-02";
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
// --- End productSoldOut ---


// --- productUnsold ---
exports.productUnsold = async (req, res) => {
  try {

    const data = await productUnsoldSchema.validateAsync(req.body);
    console.log("Data::", data);

    const updateData = await models.productSoldOut.update(
      {
        isActive: 2
      },
      {
        where: {
          product_id: data.product_id,
          store_id: data.store_id
        }
      }
    );
    console.log("updateData::", updateData);

    const productTableUpdate = await models.StoreProduct.update(
      {
        isActive: 1
      },
      {
        where: {
          id: data.product_id
        }
      }
    );
    console.log("productTableUpdate::", productTableUpdate);

    let message = "product is unSold";
    let message_code = "StoreController:productSoldOut-01";
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
    let message_code = "StoreController:defaultCardStore-02";
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
// --- End productUnsold --- 


// --- storeDeactivate ---
exports.storeDeactivate = async (req, res) => {
  try {

    const data = await storeDeactivateSchema.validateAsync(req.body);
    console.log("Data::", data);

    const insertDeactiveStore = await models.storeDeactive.create(
      {
        store_id: data.store_id,
        status: 2
      }
    );
    console.log("insertDeactiveStore::", insertDeactiveStore);

    const storeData = await models.Store.update(
      {
        isActive: 2
      },
      {
        where: {
          id: data.store_id
        }
      }
    );
    console.log("storeData::", storeData);

    const productUpdate = await models.StoreProduct.update(
      {
        isActive: 2
      },
      {
        where: {
          store_id: data.store_id
        }
      }
    );
    console.log("productUpdate::", productUpdate);

    let message = "store is deactive";
    let message_code = "StoreController:storeDeactivate-01";
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
    let message_code = "StoreController:storeDeactivate-02";
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
// --- End storeDeactivate ---


// --- storeActive ---
exports.storeActive = async (req, res) => {
  try {

    const data = await storeActiveSchema.validateAsync(req.body);
    console.log("Data::", data);

    const updateActiveData = await models.storeDeactive.update(
      {
        status: 1
      },
      {
        where: {
          store_id: data.store_id
        }
      }
    );
    console.log("updateActiveData::", updateActiveData);

    const storeData = await models.Store.update(
      {
        isActive: 1
      },
      {
        where: {
          id: data.store_id
        }
      }
    );
    console.log("storeData::", storeData);

    const productData = await models.StoreProduct.update(
      {
        isActive: 1
      },
      {
        where: {
          store_id: data.store_id
        }
      }
    );
    console.log("productData::", productData);

    let message = "store is active";
    let message_code = "StoreController:storeActive-01";
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
    let message_code = "StoreController:storeActive-02";
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
// --- End storeActive ---

// --- storeOtpVerify --- 
exports.storeOtpVerify = async (req, reply) => {
  try {

    const result = await storeOtpVerifySchema.validateAsync(req.body);
    console.log("result::", result);

    // ---- otpVerifyCode ---- //
    // const codeVerify = await client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
    //   .verificationChecks
    //   .create({
    //     to: `${result.phoneCode}${result.phoneNumber}`,
    //     code: result.otp
    //   })

    // console.log("codeVerify::;", codeVerify);

    // if (codeVerify.status == "approved") {
    //   const getStoreData = await models.Store.findOne(
    //     {
    //       where: {
    //         id: result.store_id
    //       }
    //     }
    //   );
    //   console.log("getStoreData::", getStoreData);

    //   const getStoreTimingData = await models.StoreTiming.findOne(
    //     {
    //       where: {
    //         store_id: result.store_id
    //       }
    //     }
    //   );
    //   console.log("getStoreTimingData::", getStoreTimingData);

    //   const storeTiming = {
    //     id: getStoreTimingData.id,
    //     sun_open: getStoreTimingData.sun_open,
    //     sun_open_timing: getStoreTimingData.sun_open_timing,
    //     mon_open: getStoreTimingData.mon_open,
    //     mon_open_timing: getStoreTimingData.mon_open_timing,
    //     tue_open: getStoreTimingData.tue_open,
    //     tue_open_timing: getStoreTimingData.tue_open_timing,
    //     wed_open: getStoreTimingData.wed_open,
    //     wed_open_timing: getStoreTimingData.wed_open_timing,
    //     thurs_open: getStoreTimingData.thurs_open,
    //     thurs_open_timing: getStoreTimingData.thurs_open_timing,
    //     fri_open: getStoreTimingData.fri_open,
    //     fri_open_timing: getStoreTimingData.fri_open_timing,
    //     sat_open: getStoreTimingData.sat_open,
    //     sat_open_timing: getStoreTimingData.sat_open_timing,
    //     all_days_open: getStoreTimingData.all_days_open,
    //     all_day_open_timing: getStoreTimingData.all_day_open_timing,
    //   }

    //   const userData = {
    //     store_id: getStoreData.id,
    //     deviceType: getStoreData.deviceType,
    //     fcm_token: getStoreData.fcm_token,
    //     store_photo: getStoreData.store_photo,
    //     store_name: getStoreData.store_name,
    //     store_logo: getStoreData.store_logo,
    //     store_address: getStoreData.store_address,
    //     securiy_pin: getStoreData.securiy_pin,
    //     phoneVerify: getStoreData.phoneVerify,
    //     phoneCode: getStoreData.phoneCode,
    //     phone: getStoreData.phoneNumber,
    //     email: getStoreData.email,
    //     store_lat: getStoreData.store_lat,
    //     store_long: getStoreData.store_long,
    //     role: getStoreData.role,
    //     country_name: getStoreData.country_name,
    //     state_name: getStoreData.state_name,
    //     city_name: getStoreData.city_name,
    //     isActive: getStoreData.isActive,
    //     createdAt: getStoreData.createdAt,
    //     OTP: 'OTP',
    //     token: 'token',
    //     storetiming: storeTiming
    //   }

    //   console.log("userData::", userData);


    //   let message = "OTP Verified";
    //   let message_code = "UserController:driverRequested-01";
    //   let message_action = "Get back to login or Get started screen";
    //   let api_token = "";
    //   return Api.setSuccessResponse(
    //     userData,
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

      const getStoreData = await models.Store.findOne(
        {
          where: {
            id: result.store_id
          }
        }
      );
      console.log("getStoreData::", getStoreData);

      const getStoreTimingData = await models.StoreTiming.findOne(
        {
          where: {
            store_id: result.store_id
          }
        }
      );
      console.log("getStoreTimingData::", getStoreTimingData);

      const storeTiming = {
        id: getStoreTimingData.id,
        sun_open: getStoreTimingData.sun_open,
        sun_open_timing: getStoreTimingData.sun_open_timing,
        mon_open: getStoreTimingData.mon_open,
        mon_open_timing: getStoreTimingData.mon_open_timing,
        tue_open: getStoreTimingData.tue_open,
        tue_open_timing: getStoreTimingData.tue_open_timing,
        wed_open: getStoreTimingData.wed_open,
        wed_open_timing: getStoreTimingData.wed_open_timing,
        thurs_open: getStoreTimingData.thurs_open,
        thurs_open_timing: getStoreTimingData.thurs_open_timing,
        fri_open: getStoreTimingData.fri_open,
        fri_open_timing: getStoreTimingData.fri_open_timing,
        sat_open: getStoreTimingData.sat_open,
        sat_open_timing: getStoreTimingData.sat_open_timing,
        all_days_open: getStoreTimingData.all_days_open,
        all_day_open_timing: getStoreTimingData.all_day_open_timing,
      }

      const userData = {
        store_id: getStoreData.id,
        deviceType: getStoreData.deviceType,
        fcm_token: getStoreData.fcm_token,
        store_photo: getStoreData.store_photo,
        store_name: getStoreData.store_name,
        store_logo: getStoreData.store_logo,
        store_address: getStoreData.store_address,
        securiy_pin: getStoreData.securiy_pin,
        phoneVerify: getStoreData.phoneVerify,
        phoneCode: getStoreData.phoneCode,
        phone: getStoreData.phoneNumber,
        email: getStoreData.email,
        store_lat: getStoreData.store_lat,
        store_long: getStoreData.store_long,
        role: getStoreData.role,
        country_name: getStoreData.country_name,
        state_name: getStoreData.state_name,
        city_name: getStoreData.city_name,
        isActive: getStoreData.isActive,
        createdAt: getStoreData.createdAt,
        OTP: 'OTP',
        token: 'token',
        storetiming: storeTiming
      }

      let message = "OTP Verified";
      let message_code = "UserController:driverRequested-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        userData,
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
    // --- End tempOtpPortion --- //

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "StoreController:storeOtpVerify-02";
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
// --- End storeOtpVerify ---

// --- insertStoreComment ---
exports.insertStoreComment = async (req, reply) => {
  try {

    const result = await insertStoreCommentSchema.validateAsync(req.body);
    console.log("result:;", result);

    const getuserData = await models.User.findOne(
      {
        where: {
          id: result.user_id
        }
      }
    );
    console.log("getuserData::;", getuserData);

    const insertComment = await models.Comments.create(
      {
        user_id: result.user_id,
        store_id: result.store_id,
        comment: result.comment,
        user_name: getuserData.firstName,
        user_image: getuserData.avatar
      }
    )
    console.log("insertComment::", insertComment);

    let data = insertComment
    let message = "Add Store comments";
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
    console.log("error==>", err);
    let data = "Opps";
    let message = error.message;
    let message_code = "StoreController:insertStoreComment-02";
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
// --- End insertStoreComment ---


// --- getStoreComments --- //
exports.getStoreComments = async (req, reply) => {
  try {

    const result = await getStoreCommentsSchema.validateAsync(req.body);
    console.log("result::", result);

    const getCommentsData = await models.Comments.findAll(
      {
        where: {
          store_id: result.store_id
        },
        order: [["createdAt", "DESC"]]
      }
    );
    console.log("getCommentsData::", getCommentsData);

    let data = getCommentsData
    let message = "Get Store Comments Data";
    let message_code = "UserController:getStoreComments-01";
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
    let message_code = "UserController:getStoreComments-02";
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
// --- End getStoreComments --- //


// --- updateAllData --- //
exports.updateProductData = async (req, res) => {
  try {

    const updateProductData = await models.sequelize.query(
      `UPDATE products SET `
    )

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "UserController:getStoreComments-02";
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
// --- End updateAllData --- //


// --- getStoreAddress --- //
exports.getStoreAddress = async (req, res) => {
  try {

    const result = await getStoreAddress.validateAsync(req.body);

    const storeData = await models.Store.findOne(
      {
        where: {
          id: result.store_id
        }
      }
    );

    if (storeData == undefined) {

      let data = "opps";
      let message = "Store Not Found";
      let message_code = "storeController:getStoreAddress-01";
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

      const response = {
        store_address: storeData.store_address
      }

      let data = response
      let message = "Get Store Address Data";
      let message_code = "storeController:getStoreAddress-01";
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
    let message_code = "storeController:getStoreAddress-02";
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
// --- End getStoreAddress --- //


// --- insertW9Tax --- //
exports.insertW9Tax = async (req, res) => {
  try {

    const result = await insertStoreW9TaxSchema.validateAsync(req.body);
    console.log("result:;", result);

    var stores = await models.Store.findOne({
      where: {
        id: result.store_id,
      },
    });
    if (stores == undefined) {
      let message = "Store Not Exists";
      let message_code = "StoreController:insertW9Tax-01";
      let message_action = "not avaible";
      let api_token = "";
      return Api.setWarningResponse(
        [],
        message,
        message_code,
        message_action,
        api_token
      );
    } else {

      const dataStoreW9Tax = await models.StoreW9Tax.create({
        store_id: result.store_id,
        full_name: req.body.full_name,
        business_name: req.body.business_name,
        classification: req.body.classification,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        SSN: req.body.SSN,
        today_date: req.body.today_date,
        e_signature: req.body.e_signature,
      });

      let message = "Store W9 Tax Created ";
      let message_code = "StoreController:insertW9Tax-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        dataStoreW9Tax,
        message,
        message_code,
        message_action,
        api_token
      );
    }
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "StoreController:insertW9Tax-04";
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
// --- End insertW9Tax --- //


// --- getW9Tax --- //
exports.getW9Tax = async (req, res) => {
  try {

    const result = await getW9Tax.validateAsync(req.body);
    console.log("result", result);

    const taxData = await models.StoreW9Tax.findAll(
      {
        where: {
          store_id: result.store_id
        }
      }
    );

    if (taxData == undefined) {

      let data = "opps";
      let message = "W9Tax Not Found";
      let message_code = "storeController:getW9Tax-01";
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

      let data = taxData
      let message = "Get Store Address Data";
      let message_code = "storeController:getW9Tax-01";
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
    
  } catch (err) {
    let data = "opps";
    let message = err.message;
    let message_code = "StoreController-getW9Tax-04";
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
// --- End getW9Tax --- //


// --- deleteStore --- //
// exports.deleteStore = async (req, res) => {
//   try {

//     const results = await deleteStoreByIdSchema.validateAsync(req.body);

//     const findStoreData = await models.Store.findOne(
//       {
//         where: {
//           id: results.store_id
//         }
//       }
//     );

//     if (findStoreData == undefined) {

//       let data = "opps";
//       let message = "Store Not Found";
//       let message_code = "storeController:getStoreAddress-01";
//       let message_action = "";
//       let api_token = "";
//       return Api.setSuccessResponse(
//         data,
//         message,
//         message_code,
//         message_action,
//         api_token
//       );

//     } else {

//       const storeData = await models.Store.update(
//         {
//           isActive: 2,
//         },
//         {
//           where: {
//             id: results.store_id,
//           },
//         }
//       );

//       const storeCategoriesData = await models.StoreCategory.update(
//         {
//           isActive: 2,
//         },
//         {
//           where: {
//             id: results.store_id,
//           },
//         }
//       );
      
//       const storeDeactivesData = await models.storeDeactive.update(
//         {
//           isActive: 2,
//         },
//         {
//           where: {
//             id: results.store_id,
//           },
//         }
//       );

//       let message = "Deleted Successfully";
//       let message_code = "StoreController:deleteStore";
//       let message_action = "catched Error:";
//       let api_token = "";
//       return Api.setSuccessResponse(
//         data,
//         message,
//         message_code,
//         message_action,
//         api_token
//       );
//     }

//   } catch (error) {
//     let data = "opps";
//     let message = error.message;
//     let message_code = "StoreController:deleteStore";
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
// --- End deleteStore --- //