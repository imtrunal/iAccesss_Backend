var cron = require("node-cron");
import bcrypt from "bcrypt";
import models from "../../../setup/models";
import * as Api from "../../../setup/ApiResponse";

// ---- otpSendSystem ---- //
const accountSid = "ACa0774e852f6ea56f2426a8790b050825";
const authToken = "d7c1d74940ba330282157969be1a14be";

const client = require('twilio')(accountSid, authToken);

const SendOtp = require("sendotp");
const sendOtp = new SendOtp("332533AhDBihu7o608ce1a0P1");
const stripe = require('stripe')("sk_test_51LN8OVCTyqcVtzly3nSmJjBjijlsVVN2TN6bmL7eF3ojcnR0Gabi89SRapl3cfFOzQacNmXuIlnHkxTICQ9YxjzV005ddY95Bi");
import serverConfig from "../../../config/server.json";
import Driver from "../../../migrations/1-driver";
import { date } from "joi";
import { verify } from "jsonwebtoken";
 
const {
  driverRegisterSchema,
  driverMobileCheckSchema,
  addDriverVehicleDataSchema,
  driverLoginSchema,
  driverStatusSchema,
  getAllStoreSchema,
  getUserProductStoreAcceptedSchema,
  getDataByDriverStatusSchema,
  addDriverCardDetailsSchema,
  getCardDetailsByDriverIdSchema,
  deleteDriverCardDetailsSchema,
  defaultCardDriverSchema,
  withdrawByDriverSchema,
  driverOtpVerifySchema,
  requestQueueListSchema,
  finalRequestByUserSchema,
  demoMultiReqSchema,
  driverRequestedSchema,
  driverCheckMobileSchema,
  userRequestDemoSchema,
} = require("./driverValidate");
const { Op, AggregateError } = require("sequelize");

var generateRandomNDigits = (n) => {
  return 1234;
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};

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

// --- driverMobileCheck ---
exports.driverMobileCheck = async (req, reply) => {
  try {

    const result = await driverMobileCheckSchema.validateAsync(req.body);
    console.log("result", result);

    var driver = await models.Driver.findOne({
      where: {
        phone: result.phoneCode + result.phoneNumber,
      },
    });

    console.log("driver", driver);

    if (!driver) {
      // --- Save Driver With Phone Number ---

      const data = await models.Driver.create({
        phoneCode: result.phoneCode,
        phoneNumber: result.phoneNumber,
        phone: result.phoneCode + result.phoneNumber,
        phoneVerify: 1,
        role: 4,
      });

      var driverData = await models.Driver.findOne({
        where: {
          id: data.id,
        },
      });

      const driverDetails = driverData.get();

      const driverDataArr = {
        OTP: result.OTP,
        driver_id: driverDetails.id,
        phoneCode: driverDetails.phoneCode,
        phoneNumber: driverDetails.phoneNumber,
      };

      console.log("==> driverDataArr", driverDataArr);

      let message = "driver with given phone number";
      let message_code = "DriverController:checkMobile-01";
      let message_action = "driver with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        driverDataArr,
        message,
        message_code,
        message_action,
        api_token
      );
    } else {

      let message = "Phone already exists";
      let message_code = "DriverController:checkMobile-02";
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
    console.log(error);
    let data = "opps";
    let message = err;
    let message_code = "DriverController:checkMobile-04";
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
// --- End driverMobileCheck ---

// --- driverRegister ---
exports.driverRegister = async (req, reply) => {
  try {
    const result = await driverRegisterSchema.validateAsync(req.body);
    console.log("==> result", result);

    var driverPhoneNumber = await models.Driver.findOne({
      where: {
        phone: result.phoneCode + result.phoneNumber,
      },
    });
    console.log("==> driver", driverPhoneNumber);

    if (!driverPhoneNumber) {
      if (result.verify_otp == 0) {
        const OTP = generateRandomNDigits(5);

        let message = "OTP Sent";
        let message_code = "DriverController:userRegister-01";
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

      if (result.verify_otp == 1) {
        const driverData = await models.Driver.create({
          firstName: result.firstName,
          phone: result.phoneCode + result.phoneNumber,
          phoneCode: result.phoneCode,
          phoneNumber: result.phoneNumber,
          gender: result.gender,
          deviceType: result.deviceType,
          fcm_token: result.fcm_token,
          password: result.password,
          role: 4,
          phoneVerify: 1,
        });

        var driver = await models.Driver.findOne({
          where: {
            phone: result.phoneCode + result.phoneNumber,
          },
        });
        const driverDetails = driver.get();

        const driverDataAll = {
          id: driverDetails.id,
          firstName: driverDetails.firstName,
          password: driverDetails.password,
          phoneCode: driverDetails.phoneCode,
          phoneNumber: driverDetails.phoneNumber,
          phone: driverDetails.phone,
          avatar: driverDetails.avatar,
          role: driverDetails.role,
          lastName: driverDetails.lastName,
          userName: driverDetails.firstName,
          email: driverDetails.email,
          fcm_token: result.fcm_token,
          gender: driverDetails.gender,
          phoneVerify: driverDetails.phoneVerify,
          birthDate: driverDetails.birthDate,
          vehicle_img: driverDetails.vehicle_img,
          vehicle: driverDetails.vehicle,
          year: driverDetails.year,
          make: driverDetails.make,
          model: driverDetails.model,
          color: driverDetails.color,
          deviceType: driverDetails.deviceType,
          lastloginAt: driverDetails.lastLoginAt,
          status: driverDetails.status,
          createdAt: driverDetails.createdAt,
          updatedAt: driverDetails.updatedAt,
          // token: token,
          // OTP: OTP
        };

        let message = "driver Created ";
        let message_code = "DriverController:driverRegister-01";
        let message_action = "Get back to login or Get started screen";
        let api_token = "";
        return Api.setSuccessResponse(
          driverDataAll,
          message,
          message_code,
          message_action,
          api_token
        );
      }
    } else {
      const driverDataUpdate = await models.Driver.update(
        {
          firstName: result.firstName,
          phone: result.phoneCode + result.phoneNumber,
          phoneCode: result.phoneCode,
          phoneNumber: result.phoneNumber,
          gender: result.gender,
          deviceType: result.deviceType,
          fcm_token: result.fcm_token,
          password: result.password,
          role: 4,
          phoneVerify: 1,
        },
        {
          where: {
            id: driverPhoneNumber.id,
          },
        }
      );

      var driver = await models.Driver.findOne({
        where: {
          phone: result.phoneCode + result.phoneNumber,
        },
      });
      const driverDetails = driver.get();

      const driverDataAll = {
        id: driverDetails.id,
        firstName: driverDetails.firstName,
        password: driverDetails.password,
        phoneCode: driverDetails.phoneCode,
        phoneNumber: driverDetails.phoneNumber,
        phone: driverDetails.phone,
        avatar: driverDetails.avatar,
        role: driverDetails.role,
        lastName: driverDetails.lastName,
        userName: driverDetails.firstName,
        email: driverDetails.email,
        fcm_token: result.fcm_token,
        gender: driverDetails.gender,
        phoneVerify: driverDetails.phoneVerify,
        birthDate: driverDetails.birthDate,
        vehicle_img: driverDetails.vehicle_img,
        vehicle: driverDetails.vehicle,
        year: driverDetails.year,
        make: driverDetails.make,
        model: driverDetails.model,
        color: driverDetails.color,
        deviceType: driverDetails.deviceType,
        lastloginAt: driverDetails.lastLoginAt,
        status: driverDetails.status,
        createdAt: driverDetails.createdAt,
        updatedAt: driverDetails.updatedAt,
        // token: token,
        // OTP: OTP
      };
      let message = "driver Update ";
      let message_code = "DriverController:driverRegister-02";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        driverDataAll,
        message,
        message_code,
        message_action,
        api_token
      );
    }
  } catch (error) {
    console.log("Registration", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:userLogin-04";
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
// --- End driverRegister ---

// --- addDriverVehicleData ---
exports.addDriverVehicleData = async (req, reply) => {
  try {
    const result = await addDriverVehicleDataSchema.validateAsync(req.body);
    console.log("result::", result);

    const insertDriverVehicleData = await models.Driver.update(
      {
        vehicle: result.vehicle,
        year: result.year,
        make: result.make,
        model: result.model,
        color: result.color,
      },
      {
        where: {
          id: result.driver_id,
        },
      }
    );
    console.log("insertDriverVehicleData", insertDriverVehicleData);

    var driver = await models.Driver.findOne({
      where: {
        id: result.driver_id,
      },
    });
    console.log("driver::", driver);

    const driverDetails = await driver.get();
    console.log("driverDetails::", driverDetails);

    const responseData = {
      id: driverDetails.id,
      firstName: driverDetails.firstName,
      password: driverDetails.password,
      phoneCode: driverDetails.phoneCode,
      phoneNumber: driverDetails.phoneNumber,
      phone: driverDetails.phone,
      avatar: driverDetails.avatar,
      role: driverDetails.role,
      lastName: driverDetails.lastName,
      userName: driverDetails.firstName,
      email: driverDetails.email,
      fcm_token: driverDetails.fcm_token,
      gender: driverDetails.gender,
      phoneVerify: driverDetails.phoneVerify,
      birthDate: driverDetails.birthDate,
      vehicle_img: driverDetails.vehicle_img,
      vehicle: result.vehicle,
      year: result.year,
      make: result.make,
      model: result.model,
      color: result.color,
      deviceType: driverDetails.deviceType,
      lastloginAt: driverDetails.lastLoginAt,
      status: driverDetails.status,
      createdAt: driverDetails.createdAt,
      updatedAt: driverDetails.updatedAt,
    };

    let message = "driver vehicle data Created ";
    let message_code = "DriverController:addDriverVehicleData-01";
    let message_action = "Get back to login or Get started screen";
    let api_token = "";
    return Api.setSuccessResponse(
      responseData,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (error) {
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:addDriverVehicleData-04";
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
// --- End addDriverVehicleData ---

// --- driverLogin ---
exports.driverLogin = async (req, reply) => {
  try {
    const result = await driverLoginSchema.validateAsync(req.body);

    var driver = await models.Driver.findOne({
      where: {
        phone: result.phoneCode + result.phoneNumber,
      },
    });

    if (!driver) {
      let message = "No Phone found";
      let message_code = "DriverController:Err";
      let message_action = "";
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
      //   .create({ to: `${result.phoneCode}${result.phoneNumber}`, channel: 'sms' })
      //   .then(verification => console.log(verification.status))
      //   .catch((err) => console.log("We Hace Error:", err))
      // ---- otpSendCode ---- //


      const driverDetails = driver.get();

      console.log("driverDetails", driverDetails);

      const { email, id } = driverDetails;
      const token = await reply.jwtSign(
        {
          email,
          id,
        },
        {
          expiresIn: 86400,
        }
      );
      let message = "Driver Detail with token";
      let message_code = "DriverController:driverLogin-03";
      let message_action =
        "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

      const driverdataUpdate = await models.Driver.update(
        {
          fcm_token: result.fcm_token,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const OTP = generateRandomNDigits(5);

      const driverData = {
        id: driverDetails.id,
        firstName: driverDetails.firstName,
        password: driverDetails.password,
        phoneCode: driverDetails.phoneCode,
        phoneNumber: driverDetails.phoneNumber,
        phone: driverDetails.phone,
        avatar: driverDetails.avatar,
        role: driverDetails.role,
        lastName: driverDetails.lastName,
        userName: driverDetails.firstName,
        email: driverDetails.email,
        fcm_token: result.fcm_token,
        gender: driverDetails.gender,
        phoneVerify: driverDetails.phoneVerify,
        birthDate: driverDetails.birthDate,
        vehicle_img: driverDetails.vehicle_img,
        vehicle: driverDetails.vehicle,
        year: driverDetails.year,
        make: driverDetails.make,
        model: driverDetails.model,
        color: driverDetails.color,
        deviceType: driverDetails.deviceType,
        lastloginAt: driverDetails.lastLoginAt,
        status: driverDetails.status,
        createdAt: driverDetails.createdAt,
        updatedAt: driverDetails.updatedAt,
        OTP: 1234
        // token: token,
      };

      return Api.setSuccessResponse(
        driverData,
        message,
        message_code,
        message_action
      );
    }
  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:addDriverVehicleData-04";
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
// --- End driverLogin ---

// --- driverStatus ---
exports.driverStatus = async (req, reply) => {
  try {
    const result = await driverStatusSchema.validateAsync(req.body);

    const driver = await models.Driver.findOne({
      where: {
        id: result.driver_id,
      },
    });

    if (driver) {
      const checkStatus = await models.Driver.update(
        {
          status: result.status,
          driver_lat: result.driver_lat,
          driver_long: result.driver_long,
        },
        {
          where: {
            id: result.driver_id,
          },
        }
      );
      const data = {
        data: checkStatus[0],
      };
      let message = "Driver Detail";
      let message_code = "DriverController:driverStatus-01";
      let message_action = "status: 0 offline 1 online";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action
      );
    } else {

      let message = "Driver not exist";
      let message_code = "DriverController:addDriverVehicleData-02";
      let message_action = "catched Error:";
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
    let message_code = "DriverController:addDriverVehicleData-03";
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
// --- End driverStatus ---

// --- getAllStore ---
exports.getAllStore = async (req, reply) => {
  try {
    const result = await getAllStoreSchema.validateAsync(req.body);
    console.log("result", result);
    const driver = await models.Driver.findOne({
      where: {
        id: result.driver_id,
      },
    });

    console.log("driver", driver);
    if (driver) {
      var [storeData] = await models.sequelize.query(
        `SELECT  
          id, 
          store_logo, 
          store_lat, 
          store_long, 
          store_name  
         FROM 
          stores 
         WHERE
         store_logo != "NULL"
         AND
         store_lat != "NULL"
         AND
         store_long != "NULL"
         AND
         store_name != "NULL"
        `
      );

      console.log("storeData:::", storeData);

      let message = "All Store Detail Get By Driver Id";
      let message_code = "DriverController:driverStatus-01";
      let message_action = "catched Error:";
      return Api.setSuccessResponse(
        storeData,
        message,
        message_code,
        message_action
      );
    } else {
      let message = "Driver not exist";
      let message_code = "DriverController:checkMobile-02";
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
    let message_code = "DriverController:addDriverVehicleData-04";
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
// --- End getAllStore ---

// --- getUserProductStoreAccepted ---
exports.getUserProductStoreAcceptedData = async (req, reply) => {
  try {
    const result = await getUserProductStoreAcceptedSchema.validateAsync(
      req.body
    );
    console.log("Data::", result);

    if (result.req_id && result.user_id) {
      const getUserProductStoreAccepted =
        await models.UserProductItemRequetAcceptedStore.findOne({
          where: {
            req_id: result.req_id,
            user_id: result.user_id,
          },
        });
      console.log(
        "getUserProductStoreAccepted==>",
        getUserProductStoreAccepted
      );

      const [storeDataResponse] = await models.sequelize.query(
        `
            SELECT 
              stores.store_logo,
              stores.store_name,
              stores.store_address,
              stores.store_lat,
              stores.store_long,
              storeCategories.cat_name 
            FROM 
              stores 
            JOIN
              storeCategories 
            ON 
              stores.id = storeCategories.store_id 
            WHERE 
              stores.id = ${result.store_id};
            `
      );
      console.log("storeDataResponse::=>", storeDataResponse);

      const [getDeliveryPrice] = await models.sequelize.query(
        `
        SELECT
          delivery_price,
          selected_user_id,
          driver_id,
          store_code,
          store_verify,
          user_code,
          user_verify,
          drop_location_address,
          drop_location_lat,
          drop_location_long
        FROM
          final_request_by_users
        WHERE
          req_id = ${result.req_id}
        `
      );
      console.log("addDataToRequestTable::=", getDeliveryPrice);

      const [getUserData] = await models.sequelize.query(
        `
        SELECT
          avatar
        FROM
          users
        WHERE
          id = ${getDeliveryPrice[0].selected_user_id}
        `
      );
      console.log("getUserData::=", getUserData);

      const [getColorAndSizeStatus] = await models.sequelize.query(
        `
        SELECT
          color,
          size,
          status
        FROM
          users_product_store_accepteds
        WHERE
          product_id = ${result.product_id}
        AND
          req_id = ${result.req_id}
        `
      );
      console.log("getColorAndSizeStatus:", getColorAndSizeStatus);
      console.log("DriverID::", getDeliveryPrice[0].driver_id);

      if (getDeliveryPrice[0].driver_id) {
        const [driverResponse] = await models.sequelize.query(
          `
              SELECT 
                avatar,
                firstName,
                driver_lat,
                driver_long,
                model,
                color,
                fcm_token
              FROM
                drivers
              WHERE
                id = ${getDeliveryPrice[0].driver_id}
          `
        );
        console.log("driverResponse:=>", driverResponse);

        // ----- forProductData -----
        var requestData = await models.UserProductItemRequetAcceptedStore.findAll(
          {
            where: {
              user_id: result.user_id,
              store_id: result.store_id,
              req_id: result.req_id
            }
          }
        );
        console.log("requestData::", requestData);

        const productMultipleDataArr = [];
        for (const productData of requestData) {

          console.log("productData.store_id::", productData.store_id);

          var [productDatavalueArr] = await models.sequelize.query(
            `
            SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productData.store_id}" AND t1.id = ${productData.product_id}
            `
          );

          var [productGallery] = await models.sequelize.query(
            `
            SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productData.store_id} AND product_id=${productData.product_id} AND isActive = 1
            `
          );

          const responseColorData = [
            {
              "name": productData.color,
              "code": productData.color
            }
          ]

          const responseSizeData = [
            {
              "size": productData.size
            }
          ]

          const responseProductData = {
            productData: productDatavalueArr[0],
            productColor: responseColorData,
            productSize: responseSizeData,
            productGallery: productGallery
          }
          productMultipleDataArr.push(responseProductData);
        }
        // ----- End forProductData -----

        const responseData = {
          req_id: result.req_id,
          store_id: result.store_id,
          product_id: result.product_id,
          user_id: result.user_id,
          driver_id: getDeliveryPrice[0].driver_id,
          store_logo: storeDataResponse[0].store_logo,
          store_lat: storeDataResponse[0].store_lat,
          store_long: storeDataResponse[0].store_long,
          user_selected_img: getUserData[0].avatar,
          driver_img: driverResponse[0].avatar,
          driver_name: driverResponse[0].firstName,
          driver_lat: driverResponse[0].driver_lat,
          driver_long: driverResponse[0].driver_long,
          drop_location_address: getDeliveryPrice[0].drop_location_address,
          drop_location_lat: getDeliveryPrice[0].drop_location_lat,
          drop_location_long: getDeliveryPrice[0].drop_location_long,
          driver_model: driverResponse[0].model,
          driver_model_color: driverResponse[0].color,
          product_color: getColorAndSizeStatus[0].color,
          product_size: getColorAndSizeStatus[0].size,
          store_code: getDeliveryPrice[0].store_code,
          store_verify: getDeliveryPrice[0].store_verify,
          user_code: getDeliveryPrice[0].user_code,
          user_verify: getDeliveryPrice[0].user_verify,
          status: getColorAndSizeStatus[0].status,
          productDetails: productMultipleDataArr
        };

        let message =
          "getUserProductStoreAccepted by req_id store_id or user_id";
        let message_code = "DriverController:driverStatus-01";
        let message_action = "catched Error:";
        return Api.setSuccessResponse(
          responseData,
          message,
          message_code,
          message_action
        );
      } else {
        // const responseData = {};

        // let message =
        //   "getUserProductStoreAccepted by req_id store_id or user_id";
        // let message_code = "DriverController:driverStatus-01";
        // let message_action = "catched Error:";
        // return Api.setSuccessResponse(
        //   responseData,
        //   message,
        //   message_code,
        //   message_action
        // );

        let message = "getUserProductStoreAccepted by req_id store_id or user_id";
        let message_code = "DriverController:checkMobile-02";
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
    } else if (result.req_id && result.store_id) {
      const getUserProductStoreAccepted =
        await models.UserProductItemRequetAcceptedStore.findOne({
          where: {
            req_id: result.req_id,
            store_id: result.store_id,
          },
        });
      console.log(
        "getUserProductStoreAccepted==>",
        getUserProductStoreAccepted
      );

      const [storeDataResponse] = await models.sequelize.query(
        `
            SELECT 
              stores.store_logo,
              stores.store_name,
              stores.store_address,
              stores.store_lat,
              stores.store_long,
              storeCategories.cat_name 
            FROM 
              stores 
            JOIN
              storeCategories 
            ON 
              stores.id = storeCategories.store_id 
            WHERE 
              stores.id = ${result.store_id};
            `
      );
      console.log("storeDataResponse::=>", storeDataResponse);

      const [getDeliveryPrice] = await models.sequelize.query(
        `
        SELECT
          delivery_price,
          selected_user_id,
          driver_id
        FROM
          final_request_by_users
        WHERE
          req_id = ${result.req_id}
        `
      );
      console.log("addDataToRequestTable::=", getDeliveryPrice);

      const [getUserData] = await models.sequelize.query(
        `
        SELECT
          avatar
        FROM
          users
        WHERE
          id = ${getDeliveryPrice[0].selected_user_id}
        `
      );
      console.log("getUserData::=", getUserData);

      const [getColorAndSizeStatus] = await models.sequelize.query(
        `
        SELECT
          color,
          size,
          status
        FROM
          users_product_store_accepteds
        WHERE
          product_id = ${result.product_id}
        `
      );
      console.log("getColorAndSizeStatus:", getColorAndSizeStatus);

      const [driverResponse] = await models.sequelize.query(
        `
            SELECT 
              avatar,
              firstName,
              driver_lat,
              driver_long,
              model,
              fcm_token
            FROM
              drivers
            WHERE
              id = ${getDeliveryPrice[0].driver_id}
        `
      );
      console.log("driverResponse:=>", driverResponse);

      const responseData = {
        req_id: result.req_id,
        store_id: result.store_id,
        product_id: result.product_id,
        user_id: result.user_id,
        driver_id: getDeliveryPrice[0].driver_id,
        store_logo: storeDataResponse[0].store_logo,
        store_lat: storeDataResponse[0].store_lat,
        store_long: storeDataResponse[0].store_long,
        user_selected_img: getUserData[0].avatar,
        driver_img: driverResponse[0].avatar,
        driver_name: driverResponse[0].firstName,
        driver_lat: driverResponse[0].driver_lat,
        driver_long: driverResponse[0].driver_long,
        driver_model: driverResponse[0].model,
        product_color: getColorAndSizeStatus[0].color,
        product_size: getColorAndSizeStatus[0].size,
        status: getColorAndSizeStatus[0].status,
      };

      let message = "getUserProductStoreAccepted by req_id store_id or user_id";
      let message_code = "DriverController:driverStatus-01";
      let message_action = "catched Error:";
      return Api.setSuccessResponse(
        responseData,
        message,
        message_code,
        message_action
      );
    }
  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:addDriverVehicleData-04";
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
// --- End getUserProductStoreAccepted ---

// --- getDataByDriverStatus ---
exports.getDataByDriverStatus = async (req, reply) => {
  try {
    const result = await getDataByDriverStatusSchema.validateAsync(req.body);
    console.log("Data::", result);

    var [checkStatusOfDriver] = await models.sequelize.query(
      `
    SELECT
      *
    FROM
      final_request_by_users
    WHERE
      driver_id = ${result.driver_id}
    AND
      status IN (3, 4, 5, 6, 7, 8, 9)
    `
    );
    console.log("checkStatusOfDriver", checkStatusOfDriver);

    if (checkStatusOfDriver[0] == undefined) {

      let responseMessage = "Data Undefined";
      let message = "Get Driver Data By Status 3, 4, 5, 6, 7, 8, 9";
      let message_code = "DriverController:getDataByDriverStatus-01";
      let message_action = "catched Error:";
      return Api.setSuccessResponse(
        responseMessage,
        message,
        message_code,
        message_action
      );

    } else {

      // console.log("storeId:", checkStatusOfDriver[0].store_id);
      const [getStoreDataRes] = await models.sequelize.query(
        `
          SELECT 
            stores.store_logo,
            stores.store_name,
            stores.phone,
            stores.store_address,
            stores.store_lat,
            stores.store_long,
            storeCategories.cat_name 
          FROM 
            stores 
          JOIN
            storeCategories 
          ON 
            stores.id = storeCategories.store_id 
          WHERE 
            stores.id = ${checkStatusOfDriver[0].store_id};
          `
      );
      // console.log("getStoreDataRes::=>", getStoreDataRes);

      const [getProductDataRes] = await models.sequelize.query(
        `
          SELECT
            product_title,
            product_photo
          FROM
            products
          WHERE
            id = ${checkStatusOfDriver[0].product_id}
          `
      );
      // console.log("getProductDataRes:=>", getProductDataRes);

      const [getDriverDataRes] = await models.sequelize.query(
        `
          SELECT 
            avatar as driver_img,
            driver_lat,
            driver_long,
            fcm_token,
            isAvailable
          FROM
            drivers
          WHERE
            id = ${result.driver_id}
          `
      );
      // console.log("getDriverDataRes:=>", getDriverDataRes);

      // ----- forProductData -----

      console.log("checkStatusOfDriver::", checkStatusOfDriver[0].user_id);
      console.log("checkStatusOfDriver::", checkStatusOfDriver[0].store_id);
      console.log("checkStatusOfDriver::", checkStatusOfDriver[0].req_id);

      var requestdataArr = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            user_id: checkStatusOfDriver[0].user_id,
            store_id: checkStatusOfDriver[0].store_id,
            req_id: checkStatusOfDriver[0].req_id
          }
        }
      );
      // console.log("requestdataArr::", requestdataArr);

      const productMultipledateArr = [];
      for (const productDataArr of requestdataArr) {
        var [productDataValueArr] = await models.sequelize.query(
          `
            SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
            `
        );
        // console.log("productDataValueArr::", productDataValueArr);

        var [productGallery] = await models.sequelize.query(
          `
          SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
          `
        );
        // console.log("productGallery::", productGallery);


        const responseProductColorData = [
          {
            "name": productDataArr.color,
            "code": productDataArr.color
          }
        ]
        // console.log("responseProductColorData::", responseProductColorData);

        const responseProductSizeData = [
          {
            "size": productDataArr.size
          }
        ]
        // console.log("responseProductSizeData::", responseProductSizeData);

        const responseProductData = {
          productData: productDataValueArr[0],
          productColor: responseProductColorData,
          productSize: responseProductSizeData,
          productGallery: productGallery
        }
        productMultipledateArr.push(responseProductData);

      }
      // ----- End forProductData -----

      // ----- deliveryPriceCaculation ----- //
      const totalDeliveryPrice = parseFloat(checkStatusOfDriver[0].delivery_price) * 75 / 100;
      // ----- End deliveryPriceCaculation ----- //

      // ----- remainingTime Portion ----- //
      const [getDriverQueue] = await models.sequelize.query(
        `
        SELECT * FROM driverQueues WHERE req_id = ${checkStatusOfDriver[0].req_id} ORDER BY id DESC;
        `
      )

      var remainingTime = 0;
      function addSeconds(numOfSeconds, date = new Date()) {
        date.setSeconds(date.getSeconds() + numOfSeconds);

        return date;
      }

      if (getDriverQueue.length == 0) {

        const startingTime = addSeconds(90, new Date(checkStatusOfDriver[0].createdAt));
        console.log("startingTime::", startingTime);

        const difference = +new Date(startingTime) - +new Date();
        console.log("difference:", difference);
        remainingTime = 0;

        if (difference > 0) {

          const parts = {
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
          var total = (parts.minutes * 60) + parts.seconds;
          remainingTime = total;

        }

      } else {

        const startingTime = addSeconds(90, new Date(getDriverQueue[0].createdAt));
        console.log("startingTimeElseIf::", startingTime);
        const difference = +new Date(startingTime) - +new Date();
        remainingTime = 0;

        console.log("differenceElsePart:::",difference);

        if (difference > 0) {

          const parts = {
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
          var total = (parts.minutes * 60) + parts.seconds;
          remainingTime = total;

        }
      }
      // ----- End remainingTime Portion ----- //

      const responseData = {
        req_id: checkStatusOfDriver[0].req_id,
        store_id: checkStatusOfDriver[0].store_id,
        product_id: checkStatusOfDriver[0].product_id,
        user_id: checkStatusOfDriver[0].user_id,
        driver_id: parseInt(result.driver_id),
        store_name: getStoreDataRes[0].store_name,
        store_phone: getStoreDataRes[0].phone,
        store_logo: getStoreDataRes[0].store_logo,
        store_address: getStoreDataRes[0].store_address,
        delivery_address: checkStatusOfDriver[0].drop_location_address,
        store_lat: getStoreDataRes[0].store_lat,
        store_long: getStoreDataRes[0].store_long,
        cat_name: getStoreDataRes[0].cat_name,
        product_title: getProductDataRes[0].product_title,
        product_img: getProductDataRes[0].product_photo,
        driver_img: getDriverDataRes[0].driver_img,
        driver_lat: getDriverDataRes[0].driver_lat,
        driver_long: getDriverDataRes[0].driver_long,
        delivery_price: totalDeliveryPrice.toString(),
        isAvailable: getDriverDataRes[0].isAvailable,
        store_verify: checkStatusOfDriver[0].store_verify,
        store_code: checkStatusOfDriver[0].store_code,
        user_verify: checkStatusOfDriver[0].user_verify,
        user_code: checkStatusOfDriver[0].user_code,
        note_number: checkStatusOfDriver[0].note_number,
        note_desc: checkStatusOfDriver[0].note_desc,
        status: checkStatusOfDriver[0].status,
        time: remainingTime,
        productDetails: productMultipledateArr
      };

      let message = "Get Driver Data By Status 3, 4, 5, 6, 7, 8, 9";
      let message_code = "DriverController:getDataByDriverStatus-01";
      let message_action = "catched Error:";
      return Api.setSuccessResponse(
        responseData,
        message,
        message_code,
        message_action
      );
    }
  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:addDriverVehicleData-04";
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
// --- getDataByDriverStatus ---

// --- addDriverCardDetails ---
exports.addDriverCardDetails = async (req, reply) => {
  try {
    const driverData = await addDriverCardDetailsSchema.validateAsync(req.body);
    console.log("driverData:", driverData);

    const insertDetails = await models.userCardDetails.create({
      driver_id: driverData.driver_id,
      holderName: driverData.holderName,
      cardNumber: driverData.cardNumber,
      cardExpiryDate: driverData.cardExpiryDate,
      cvvNumber: parseInt(driverData.cvvNumber),
      cardType: driverData.cardType,
      zipcode: driverData.zipcode,
      cardService: driverData.cardService,
    });
    console.log("DrivverInsertDetails:", insertDetails);

    let message = "driverCardDetails Inserted ";
    let message_code = "DriverController:addDriverCardDetails-01";
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
    let message_code = "DriverController:addDriverCardDetails-02";
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
// --- End addDriverCardDetails ---

// --- getCardDetailsByDriverId ---
exports.getCardDetailsByDriverId = async (req, reply) => {
  try {
    const result = await getCardDetailsByDriverIdSchema.validateAsync(req.body);
    console.log("Data:", result);

    const getDriverCardDetails = await models.userCardDetails.findOne({
      where: {
        driver_id: result.driver_id,
        defaultCard: 1,
      },
    });
    console.log("getDriverCardDetails:", getDriverCardDetails);

    const getCardDetails = await models.userCardDetails.findAll({
      where: {
        driver_id: result.driver_id,
        defaultCard: 0,
      },
    });

    const response = {
      DefaultCard: getDriverCardDetails,
      otherCard: getCardDetails,
    };

    let message = "Get Driver Card Details ";
    let message_code = "UserController:getCardDetailsByDriverId-02";
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
    let message_code = "DriverController:getCardDetailsByDriverId-03";
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
// --- End getCardDetailsByDriverId ---

// --- deleteDriverCardDetails ---
exports.deleteDriverCardDetails = async (req, reply) => {
  try {
    const result = await deleteDriverCardDetailsSchema.validateAsync(req.body);
    console.log("Data:", result);

    const deleteCardDetails = await models.sequelize.query(
      `
      DELETE FROM userCardDetails WHERE id = ${result.card_id} AND driver_id = ${result.driver_id}
      `
    );
    let message = "driver deleted";
    let message_code = "DriverController:deleteDriverCardDetails-01";
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
    let message_code = "DriverController:deleteDriverCardDetails-03";
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
// --- End deleteDriverCardDetails ---

// --- defaultCardDriver ---
exports.defaultCardDriver = async (req, reply) => {
  try {
    const result = await defaultCardDriverSchema.validateAsync(req.body);
    console.log("Data:", result);

    const setDefaultCard = await models.userCardDetails.update(
      {
        defaultCard: 1,
      },
      {
        where: {
          id: result.card_id,
          driver_id: result.driver_id,
        },
      }
    );
    let message = `card set as default card`;
    let message_code = "DriverController:defaultCardDriver-01";
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
    let message_code = "DriverController:defaultCardDriver-02";
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
// --- End defaultCardDriver ---

// --- withdrawByDriver ---
exports.withdrawByDriver = async (req, res) => {
  try {

    const result = await withdrawByDriverSchema.validateAsync(req.body);
    console.log("result::", result);

    const getDriver = await models.Driver.findOne(
      {
        where: {
          id: result.driver_id
        }
      }
    );
    console.log("getDriver::", getDriver);

    const getCardDetails = await models.userCardDetails.findOne(
      {
        where: {
          id: result.card_id
        }
      }
    )
    console.log("getCardDetails::", getCardDetails);

    const finalCardNumber = getCardDetails.cardNumber.toString();
    const finalCvvNumber = getCardDetails.cvvNumber.toString();

    console.log("CardDetails::", finalCardNumber, finalCvvNumber);

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
    console.log("paymentMethod::", paymentMethod);

    const bankAccount = await stripe.accounts.createExternalAccount(
      'acct_1LN8OVCTyqcVtzly',
    );
    console.log("bankAccount::", bankAccount);

    const transfer = await stripe.transfers.create({
      amount: result.amount,
      currency: 'inr',
      destination: 'acct_1LN8OVCTyqcVtzly'
    }).then(() => {
      console.log("Successful");
    }).catch((err) => {
      console.log("Error::", err);
    })

    const customer = await stripe.customers.create({
      // email: getDriver.email,
      name: getDriver.firstName
    });
    console.log("customer::", customer);

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
        message: `${getDriver.firstName} withdrawal ${result.amount} from your wallet using this card ${finalCardNumber}`,
        transactions: result.amount,
        status: 13
      }
    )
    console.log("insertTrasaction::", insertTrasaction);

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:withdrawByDriver-03";
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
// --- End withdrawByDriver ---

// --- driverRequested --- 
exports.driverRequested = async (req, reply) => {
  try {

    const result = await driverRequestedSchema.validateAsync(req.body);
    console.log("result::", result);

    const getDriverRequestedData = await models.finalRequestByUser.findAll(
      {
        where: {
          driver_id: result.driver_id,
          status: 10
        },
        order: [["createdAt", "DESC"]]
      }
    );
    console.log("getDriverRequestedData::", getDriverRequestedData);

    const response = [];

    for (const fileterData of getDriverRequestedData) {

      const getStoreData = await models.Store.findOne(
        {
          where: {
            id: fileterData.store_id
          }
        }
      )
      console.log("getStoreData::", getStoreData.id);



      var requestedProductArr = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            req_id: fileterData.req_id
          }
        }
      );
      console.log("requestedProductArr:;", requestedProductArr);

      const productResponse = [];

      for (const productArr of requestedProductArr) {

        var [productArrDataValue] = await models.sequelize.query(
          `SELECT t2.store_name,t2.store_photo, t2.store_lat, t2.store_long, t1.* from  products t1 join stores t2 on t1.store_id = t2.id where  t1.store_id="${productArr.store_id}" and t1.id=${productArr.product_id}`
        );
        console.log("productArrDataValue::", productArrDataValue[0]);

        var colorValue = [
          {
            "name": productArr.color,
            "code": productArr.color
          }
        ];
        console.log("colorValue::;", colorValue);

        var sizevalue = [
          {
            "size": productArr.size
          }
        ]

        var [galleryValue] = await models.sequelize.query(
          `
          SELECT product_img from productGalleries t1 where t1.store_id=${productArr.store_id} and product_id=${productArr.product_id} AND isActive = 1
          `
        );

        // var [getDeliveryPrice] = await models.sequelize.query(
        //   `
        //   SELECT delivery_price FROM final_request_by_users WHERE product_id = ${productArr.product_id} AND store_id = ${productArr.store_id}
        //   `
        // )

        var getDeliveryPrice = await models.finalRequestByUser.findOne(
          {
            where: {
              driver_id: result.driver_id,
              product_id: productArr.product_id,
              store_id: productArr.store_id
            }
          }
        );

        console.log("getDeliveryPrice::;", getDeliveryPrice);
        console.log("Hello...productArr ", productArr.length);
        console.log("firstLog::::", productArr);

        if (productArrDataValue.length > 0) {
          const productData = {
            product: productArrDataValue[0],
            productColor: colorValue,
            productSizes: sizevalue,
            productGalleries: galleryValue,
            deliveryPrice: parseInt(getDeliveryPrice.delivery_price) * 75 / 100
          }
          productResponse.push(productData)
          console.log("productData::;", productData);
        }




        // const delivery_price = getDeliveryPrice.delivery_price


      }

      console.log("productResponse:::", productResponse);

      const finalResponse = {
        reqId: fileterData.req_id,
        isAccepted: fileterData.status,
        store_id: getStoreData.id,
        store_name: getStoreData.store_name,
        store_photo: getStoreData.store_photo,
        productDetails: productResponse
      }
      response.push(finalResponse);
    }

    let message = "Get Requested Driver List";
    let message_code = "UserController:driverRequested-01";
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
    let message_code = "DriverController:driverRequested-02";
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
// --- End driverRequested ---

// --- driverOtpVerify ---
exports.driverOtpVerify = async (req, reply) => {
  try {

    const result = await driverOtpVerifySchema.validateAsync(req.body);
    console.log("result::", result);

    // ---- otpVerifyCode ---- //
    // const codeVerify = await client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
    //   .verificationChecks
    //   .create({
    //     to: `${result.phoneCode}${result.phoneNumber}`,
    //     code: result.otp
    //   })
    // console.log("codeVerify::;", codeVerify);
    // console.log("codeVerify::;", codeVerify.status);

    // if (codeVerify.status == "approved") {
    //   const getDriverData = await models.Driver.findOne(
    //     {
    //       where: {
    //         id: result.driver_id
    //       }
    //     }
    //   );
    //   console.log("getDriverData::", getDriverData);

    //   console.log("data1", getDriverData.firstName);
    //   console.log("data2", getDriverData.fcm_token);
    //   console.log("data3", getDriverData.status);
    //   console.log("data4", getDriverData.avatar);
    //   console.log("data5", getDriverData.color);
    //   console.log("data6", getDriverData.phone);


    //   const driverData = {
    //     id: getDriverData.id,
    //     firstName: getDriverData.firstName,
    //     password: getDriverData.password,
    //     phoneCode: getDriverData.phoneCode,
    //     phoneNumber: getDriverData.phoneNumber,
    //     phone: getDriverData.phone,
    //     avatar: getDriverData.avatar,
    //     role: getDriverData.role,
    //     lastName: getDriverData.lastName,
    //     userName: getDriverData.firstName,
    //     email: getDriverData.email,
    //     fcm_token: getDriverData.fcm_token,
    //     gender: getDriverData.gender,
    //     phoneVerify: getDriverData.phoneVerify,
    //     birthDate: getDriverData.birthDate,
    //     vehicle_img: getDriverData.vehicle_img,
    //     vehicle: getDriverData.vehicle,
    //     year: getDriverData.year,
    //     make: getDriverData.make,
    //     model: getDriverData.model,
    //     color: getDriverData.color,
    //     deviceType: getDriverData.deviceType,
    //     lastloginAt: getDriverData.lastLoginAt,
    //     status: getDriverData.status,
    //     createdAt: getDriverData.createdAt,
    //     updatedAt: getDriverData.updatedAt,
    //   }

    //   console.log("driverData::", driverData);

    //   let message = "OTP Verified";
    //   let message_code = "UserController:driverRequested-01";
    //   let message_action = "Get back to login or Get started screen";
    //   let api_token = "";
    //   return Api.setSuccessResponse(
    //     driverData,
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
      console.log("conditionInDriver::", result.otp == otp);

      const getDriverData = await models.Driver.findOne(
        {
          where: {
            id: result.driver_id
          }
        }
      );

      const driverData = {
        id: getDriverData.id,
        firstName: getDriverData.firstName,
        password: getDriverData.password,
        phoneCode: getDriverData.phoneCode,
        phoneNumber: getDriverData.phoneNumber,
        phone: getDriverData.phone,
        avatar: getDriverData.avatar,
        role: getDriverData.role,
        lastName: getDriverData.lastName,
        userName: getDriverData.firstName,
        email: getDriverData.email,
        fcm_token: getDriverData.fcm_token,
        gender: getDriverData.gender,
        phoneVerify: getDriverData.phoneVerify,
        birthDate: getDriverData.birthDate,
        vehicle_img: getDriverData.vehicle_img,
        vehicle: getDriverData.vehicle,
        year: getDriverData.year,
        make: getDriverData.make,
        model: getDriverData.model,
        color: getDriverData.color,
        deviceType: getDriverData.deviceType,
        lastloginAt: getDriverData.lastLoginAt,
        status: getDriverData.status,
        createdAt: getDriverData.createdAt,
        updatedAt: getDriverData.updatedAt,
      }

      let message = "OTP Verified";
      let message_code = "UserController:driverRequested-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        driverData,
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
    // --- tempOtpPortion --- //


    // ---- otpSendCode ---- //

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:driverRequested-02";
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

// --- End driverOtpVerify ---


// --- driverCheckMobile ---
exports.driverCheckMobile = async (req, reply) => {
  try {

    const result = await driverCheckMobileSchema.validateAsync(req.body);
    console.log("result:;", result);

    const driverData = await models.Driver.findOne(
      {
        where: {
          phone: result.phoneCode + result.phoneNumber
        }
      }
    );

    if (!driverData) {

      // ---- otpSendCode ---- //
      // const codeVerify = await client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
      //   .verifications
      //   .create({ to: `${result.phoneCode}${result.phoneNumber}`, channel: 'sms' })
      // console.log("codeVerify::", codeVerify);
      // ---- End otpSendCode ---- //

      const insertData = await models.Driver.create(
        {
          phoneCode: result.phoneCode,
          phoneNumber: result.phoneNumber,
          phone: result.phoneCode + result.phoneNumber,
          phoneVerify: 1,
          role: 4
        }
      );
      console.log("insertData:;", insertData);

      const driverDetails = await models.Driver.findOne(
        {
          where: {
            id: insertData.id
          }
        }
      );
      console.log("driverDetails::", driverDetails);

      const getDriverData = driverDetails.get();
      console.log("getDriverData::", getDriverData);

      const response = {
        OTP: 1234,
        driver_id: driverDetails.id,
        driver_photo: driverDetails.avatar,
        phoneVerify: driverDetails.phoneVerify,
        phone: driverDetails.phone,
        email: driverDetails.email,
        driver_lat: driverDetails.driver_lat,
        driver_long: driverDetails.driver_long,
        role: driverDetails.role,
        isAvailable: driverDetails.isAvailable,
        createdAt: driverDetails.createdAt
      }
      console.log("response::", response);

      let message = "Driver with given phone number";
      let message_code = "DriverController:driverCheckMobile-01";
      let message_action = "Driver with given phone";
      let api_token = "";
      return Api.setSuccessResponse(
        response,
        message,
        message_code,
        message_action,
        api_token
      );

    } else {

      // const getDriverData = Driver.get();
      // console.log("driverData::", driverData);

      // const driverDetails = await models.Driver.findOne(
      //   {
      //     where: {
      //       id: insertData.id
      //     }
      //   }
      // );
      // console.log("driverDetails::", driverDetails);


      // const response = {
      //   OTP: 'OTP',
      //   driver_id: driverDetails.id,
      //   driver_photo: driverDetails.avatar,
      //   phoneVerify: driverDetails.phoneVerify,
      //   phone: driverDetails.phone,
      //   email: driverDetails.email,
      //   driver_lat: driverDetails.driver_lat,
      //   driver_long: driverDetails.driver_long,
      //   role: driverDetails.role,
      //   isAvailable: driverDetails.isAvailable,
      //   createdAt: driverDetails.createdAt
      // }

      let message = "PhoneNumber already exists";
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

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:driverRequested-02";
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
// --- End driverCheckMobile ---


// --- requestQueueList ---
exports.requestQueueList = async (req, reply) => {
  try {

    const result = await requestQueueListSchema.validateAsync(req.body);
    console.log("result::", result);

    // console.log("driverLat::", result.driver_lat);
    // console.log("driverLong::", result.driver_long);
    const finalResponse = [];
    if (result.vehicle_id == 1) {
      console.log("1=scooter--30KM");

      var [getRequestList] = await models.sequelize.query(
        `
        SELECT *, ( 3959 * acos(cos(radians(store_lat)) * cos(radians(${result.driver_lat})) * cos(radians(${result.driver_long}) - radians(store_long)) + sin(radians(store_lat)) * sin(radians(${result.driver_lat}))) ) AS distance FROM requestQueues HAVING distance < 30 ORDER BY id DESC;
        `
      )
      console.log("getRequestList::", getRequestList);

    } else {
      console.log("2=Car--90KM");

      var [getRequestList] = await models.sequelize.query(
        `
        SELECT *, ( 3959 * acos(cos(radians(store_lat)) * cos(radians(${result.driver_lat})) * cos(radians(${result.driver_long}) - radians(store_long)) + sin(radians(store_lat)) * sin(radians(${result.driver_lat}))) ) AS distance FROM requestQueues HAVING distance < 90 ORDER BY id DESC;
        `
      )
      console.log("getRequestList-else::",getRequestList);

    }


    for (const requestData of getRequestList) {
      // console.log("requestDataIdss:::", requestData.store_id, requestData.product_id, requestData.req_id);

      const getAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            req_id: requestData.req_id,
            store_id: requestData.store_id,
            product_id: requestData.product_id,
          }
        }
      );
      // console.log("getAcceptData::", getAcceptData);

      const productResponse = [];
      for (const filterData of getAcceptData) {
        console.log("requestDataIdss:::", filterData.store_id, filterData.product_id, filterData.req_id);


        const [productDataValue] = await models.sequelize.query(
          `
              SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${filterData.store_id}" AND t1.id = ${filterData.product_id} 
          `
        );
        console.log("productDataValue::", productDataValue);

        const [productGallery] = await models.sequelize.query(
          `
              SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${filterData.store_id} AND product_id=${filterData.product_id} AND isActive = 1
              `
        );
        console.log("productGallery::", productGallery);

        const productColor = [
          {
            "name": filterData.color,
            "code": filterData.color
          }
        ];
        // console.log("productColor::", productColor);

        const productSize = [
          {
            "size": filterData.size
          }
        ];
        // console.log("productSize::", productSize);

        const productPushValue = {
          productData: productDataValue[0],
          productColor: productColor,
          productSize: productSize,
          productGallery: productGallery
        }
        productResponse.push(productPushValue);

        const [getStoreData] = await models.sequelize.query(
          `
            SELECT 
              stores.store_logo,
              stores.store_name,
              stores.store_address,
              stores.store_lat,
              stores.store_long,
              storeCategories.cat_name 
            FROM 
              stores 
            JOIN 
              storeCategories 
            ON 
              stores.id = storeCategories.store_id 
            WHERE 
              stores.id = ${filterData.store_id}
            `
        );

        const [getProductData] = await models.sequelize.query(
          `
            SELECT
              product_title,
              product_photo
            FROM
              products
            WHERE
              id = ${filterData.product_id}
          `
        );

        const getFinalRequestData = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: requestData.req_id,
              store_id: requestData.store_id,
              product_id: requestData.product_id,
            }
          }
        )


        const totalDeliveryPrice = parseFloat(getFinalRequestData.delivery_price) * 75 / 100;
        console.log("totalDeliveryPrice:", totalDeliveryPrice);

        const response = {
          req_id: filterData.req_id,
          store_id: filterData.store_id,
          product_id: filterData.product_id,
          user_id: filterData.user_id,
          store_name: getStoreData[0].store_name,
          store_logo: getStoreData[0].store_logo,
          store_address: getStoreData[0].store_address,
          delivery_address: getFinalRequestData.drop_location_address,
          store_lat: getStoreData[0].store_lat,
          store_long: getStoreData[0].store_long,
          cat_name: getStoreData[0].cat_name,
          product_title: getProductData[0].product_title,
          product_img: getProductData[0].product_photo,
          delivery_price: totalDeliveryPrice.toString(),
          store_verify: filterData.store_verify,
          store_code: filterData.store_code,
          user_verify: filterData.user_verify,
          user_code: filterData.user_code,
          note_number: filterData.note_number,
          note_desc: filterData.note_desc,
          status: filterData.status,
          productDetails: productResponse
        }
        finalResponse.push(response)

      }

    }

    const final = [...finalResponse]

    let message = "driver request queue list";
    let message_code = "DriverController:requestQueueList-01";
    let message_action = "Driver with given phone";
    let api_token = "";
    return Api.setSuccessResponse(
      finalResponse,
      message,
      message_code,
      message_action,
      api_token
    );

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:driverRequested-02";
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
// --- End requestQueueList ---


// --- finalRequestByUser ---
exports.finalRequestByUser = async (req, reply) => {
  try {

    const result = await finalRequestByUserSchema.validateAsync(req.body);
    console.log("data::", result);

    const productDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
      {
        where: {
          store_id: result.store_id
        },
        group: ['user_id'],
        order: [["id", "DESC"]]
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
      console.log("userData::", userData);

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

      var requestProductArr = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            user_id: fProductData.user_id,
            store_id: fProductData.store_id
          },
          group: ["req_id"],
          order: [["status", "DESC"]]
        }
      );
      console.log("requestProductArr::", requestProductArr);

      for (const productRData of requestProductArr) {

        const [productData] = await models.sequelize.query(
          `
          SELECT t1.*, t2.store_name, t2.store_photo FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.id = ${productRData.product_id}
          `
        )

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
          SELECT product_img FROM productGalleries WHERE store_id = ${fProductData.store_id} AND product_id = ${fProductData.product_id} AND isActive = 1
          `
        )

        const finalProductData = {
          reqId: productRData.req_id,
          reqStatus: productRData.status,
          products: {
            id: productData[0].id,
            store_id: productData[0].store_id,
            user_id: fProductData.user_id,
            product_title: productData[0].product_title,
            product_infomation: productData[0].product_infomation,
            product_photo: productData[0].product_photo,
            product_qty: productData[0].product_qty,
            regular_price: productData[0].regular_price,
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

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:addDriverVehicleData-04";
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

exports.userRequestDemo = async (req, reply) => {
  try {

    const result = await userRequestDemoSchema.validateAsync(req.body);
    console.log("result::", result);

  } catch (error) {
    console.log("error==>", error);
    let data = "opps";
    let message = error.message;
    let message_code = "DriverController:addDriverVehicleData-04";
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

// --- demoMultiReq ---
exports.demoMultiReq = async (req, reply) => {
  try {

    const result = await demoMultiReqSchema.validateAsync(req.body);
    console.log("result::", result);

    // ---- otpSendCode ---- //
    // client.verify.v2.services('VA746e70cf9e083cac8eca19fd39b0aff1')
    //   .verifications
    //   .create({ to: `${result.phoneCode}${result.phoneNumber}`, channel: 'sms' })
    //   .then(verification => console.log(verification.status))
    //   .catch((err) => console.log("We Hace Error:", err))
    // ---- otpSendCode ---- //


    const getRequestQueue = await models.requestQueue.findOne(
      {
        where: {
          req_id: result.req_id
        }
      }
    );
    // console.log("getRequestQueue::", getRequestQueue);

    // const addSecond = [];
    // const startingTime = new Date(getRequestQueue.start_timestamp);
    // const endingTime = new Date(getRequestQueue.end_timestamp);
    // const presentTime = new Date();
    // const exactTime = presentTime.setSeconds(presentTime.getSeconds() + 90);
    // addSecond.push(exactTime);
    // console.log("startingTime::", startingTime);
    // console.log("endingTime::", endingTime);
    // console.log("presentTime::", presentTime);
    // console.log("exactTime::", exactTime);
    // console.log("addSecond::", addSecond);

    // const getDate = (presentTime - startingTime) / 1000;
    // const days = Math.floor(getDate / (3600 * 24));
    // const hours = Math.floor((getDate - (days * (3600 * 24))) / 3600);
    // const minutes = Math.floor((getDate - (days * (3600 * 24)) - (hours * 3600)) / 60);
    // const seconds = Math.floor(getDate - (days * (3600 * 24)) - (hours * 3600) - (minutes * 60));
    // console.log("===============================================");
    // console.log("getDate::", getDate);
    // console.log("days::", days);
    // console.log("hours::", hours);
    // console.log("minutes::", minutes);
    // console.log("seconds::", seconds);
    // console.log("===============================================");

    function seconds(numOfSeconds, date) {
      const adddate = new Date(date.getTime());
      adddate.setSeconds(adddate.getSeconds() + numOfSeconds);
      return adddate;
    }

    const startingTime = new Date(getRequestQueue.start_timestamp)
    const date = new Date();
    const add = seconds(90, date);
    console.log("currentData----", date);

    console.log("startingTime::", startingTime);
    console.log("date::", date);
    console.log("add::", add);

    const remainingTime = Math.floor((add - startingTime) / 1000);
    console.log("remainingTime::", remainingTime);


    let data = "Demo Successfull";
    let message = `card set as default card`;
    let message_code = "DriverController:defaultCardDriver-01";
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
    let message_code = "DriverController:addDriverVehicleData-04";
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
