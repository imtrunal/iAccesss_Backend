// const { string } = require("joi");
const Joi = require("joi");

// --- driverRegister --- 
const driverRegisterSchema = Joi.object({
  driver_id: Joi.required(),
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  fcm_token: Joi.required(),
  firstName: Joi.string(),
  password: Joi.string(),
  verify_otp: Joi.string(),
  // update
  firstName: Joi.string(),
  gender: Joi.string(),
  deviceType: Joi.string(),
});
// --- End driverRegister ---

// --- driverMobileCheckSchema ---
const driverMobileCheckSchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.string().required(),
  OTP: Joi.number()
});
// --- End driverMobileCheckSchema ---

// --- addDriverVehicleData ---
const addDriverVehicleDataSchema = Joi.object({
  driver_id: Joi.required(),
  vehicle: Joi.required(),
  year: Joi.required(),
  make: Joi.required(),
  model: Joi.required(),
  color: Joi.required()
});
// --- End addDriverVehicleData ---

// --- driverLoginSchema ---
const driverLoginSchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required()
});
// --- End driverLoginSchema ---


// --- driverStatusSchema ---
const driverStatusSchema = Joi.object({
  driver_id: Joi.required(),
  status: Joi.required(),
  driver_lat: Joi.required(),
  driver_long: Joi.required()
})
// --- End driverStatusSchema ---


// --- getAllStoreSchema ---
const getAllStoreSchema = Joi.object({
  driver_id: Joi.required()
})
// --- getAllStoreSchema ---

// --- getUserProductStoreAccepted ---
const getUserProductStoreAcceptedSchema = Joi.object({
  req_id: Joi.required(),
  user_id: Joi.string(),
  store_id: Joi.string(),
  product_id: Joi.string(),
});
// --- getUserProductStoreAccepted ---

// --- getDataByDriverStatusSchema ---
const getDataByDriverStatusSchema = Joi.object({
  driver_id: Joi.required()
})
// --- getDataByDriverStatusSchema ---

// --- addDriverCardDetailsSchema ---
const addDriverCardDetailsSchema = Joi.object({
  driver_id: Joi.required(),
  holderName: Joi.required(),
  cardNumber: Joi.required(),
  cardExpiryDate: Joi.required(),
  cvvNumber: Joi.required(),
  cardType: Joi.required(),
  cardService: Joi.required(),
  zipcode: Joi.required()
})
// --- End addDriverCardDetailsSchema ---

// --- getCardDetailsByDriverIdSchema ---
const getCardDetailsByDriverIdSchema = Joi.object({
  driver_id: Joi.required()
})
// --- End getCardDetailsByDriverIdSchema ---

// --- deleteDriverCardDetailsSchema ---
const deleteDriverCardDetailsSchema = Joi.object({
  driver_id: Joi.required(),
  card_id: Joi.required()
})
// --- End deleteDriverCardDetailsSchema ---

// --- defaultCardDriverSchema ---
const defaultCardDriverSchema = Joi.object({
  driver_id: Joi.required(),
  card_id: Joi.required(),
});
// --- End defaultCardDriverSchema ---

// --- withdrawByDriverSchema ---
const withdrawByDriverSchema = Joi.object({
  driver_id: Joi.required(),
  card_id: Joi.required(),
  amount: Joi.required(),
  withdrawFee: Joi.required(),
})
// --- End withdrawByDriverSchema ---

// --- driverOtpVerifySchema ---
const driverOtpVerifySchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  otp: Joi.required(),
  driver_id: Joi.required()
})
// --- End driverOtpVerifySchema ---

// --- driverRequestedSchema ---
const driverRequestedSchema = Joi.object({
  driver_id: Joi.required()
})
// --- End driverRequestedSchema ---

// --- driverCheckMobileSchema ---
const driverCheckMobileSchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required()
})
// --- End driverCheckMobileSchema ---

// --- requestQueueListSchema ---
const requestQueueListSchema = Joi.object({
  vehicle_id: Joi.required(),
  driver_lat: Joi.required(),
  driver_long: Joi.required()
})
// --- End requestQueueListSchema ---

// --- finalRequestByUserSchema ---
const finalRequestByUserSchema = Joi.object({
  store_id: Joi.required()
});
// --- finalRequestByUserSchema ---

// --- userRequestDemoSchema ---
const userRequestDemoSchema = Joi.object({
  product_id: Joi.required(),
  size: Joi.required(),
  user_id: Joi.required(),
  store_id: Joi.required()
});
// --- End userRequestDemoSchema ---

// --- demoMultiReqSchema ---
const demoMultiReqSchema = Joi.object({
  req_id: Joi.required(),
  // driver_id: Joi.required(),
  // product_id: Joi.required(),
  // store_id: Joi.required(),
  // phoneCode: Joi.required(),
  // phoneNumber: Joi.required()
});
// --- End demoMultiReqSchema ---


module.exports = {
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
  driverRequestedSchema,
  driverCheckMobileSchema,
  requestQueueListSchema,
  finalRequestByUserSchema,
  demoMultiReqSchema,
  userRequestDemoSchema,
};
