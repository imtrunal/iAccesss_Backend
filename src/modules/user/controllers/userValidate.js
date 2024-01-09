const Joi = require("joi");

const AuthSchema = Joi.object({
  firstName: Joi.string().min(3).required(),
});

//userPasswordResetSchema
const userPasswordResetSchema = Joi.object({
  user_id: Joi.required(),
  current_password: Joi.required(),
  new_password: Joi.required(),
  confirm_password: Joi.required(),
});
//userPasswordResetSchema

//userAvatarUpdatechema
const userAvatarUpdatechema = Joi.object({
  user_id: Joi.required(),
});
//userAvatarUpdatechema

//usersendUserOTPSchema
const usersendUserOTPSchema = Joi.object({
  user_id: Joi.required(),
});
//usersendUserOTPSchema

//userUpdatePasswordSchema
const userUpdatePasswordSchema = Joi.object({
  user_id: Joi.required(),
  password: Joi.string().required(),
});

//userUserNemeSchema
const userUserNemeSchema = Joi.object({
  username: Joi.required(),
});

//userRegisterSchema
const userRegisterSchema = Joi.object({
  // username: Joi.required(),
  country_code: Joi.required(),
  firstName: Joi.required(),
  phone_number: Joi.required(),
  otp_verify: Joi.required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required(),
  // password: Joi.string().required(),
});
//userRegisterSchema

//userProductListSchema
const userProductListSchema = Joi.object({
  lat: Joi.string(),
  long: Joi.string(),
  user_id: Joi.required(),
  city_name: Joi.string(),
});

const userProductSearchListSchema = Joi.object({
  lat: Joi.required(),
  long: Joi.required(),
  searchkey: Joi.required(),
});


//userLoginSchema
const userLoginSchema = Joi.object({
  phone_number: Joi.required(),
  country_code: Joi.string().required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required(),
});

const LoginSchema = Joi.object({
  phone: Joi.required(),
  password: Joi.string().required(),
});
//userAddToCartSchema
const userAddToCartSchema = Joi.object({
  user_id: Joi.required(),
  store_id: Joi.required(),
  product_id: Joi.required(),
  size: Joi.required(),
  color: Joi.required()
});
//userRequestItemAcceptedschema
const userRequestItemAcceptedschema = Joi.object({
  user_id: Joi.required(),
  store_id: Joi.required(),
  product_id: Joi.required(),
});
//userRequestItemAcceptedschema
//userGetToCartSchema
const userGetToCartSchema = Joi.object({
  user_id: Joi.required(),
});
//userSearchSchema
const userSearchSchema = Joi.object({
  search_user_name: Joi.required(),
});
//userSearchSchema
//userGetToCartSchema
//userAddToCartSchema
const UserVerifySchema = Joi.object({
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
});
// getStoreCategoriesSchema
const getStoreCategoriesSchema = Joi.object({
  store_id: Joi.required(),
  cat_id: Joi.required(),
  subcat_id: Joi.required(),
  user_id: Joi.required(),
});
const getStoreCategoriesSchemaA = Joi.object({
  store_id: Joi.required(),

});

const getStoreSubCategoriesSchema = Joi.object({
  store_id: Joi.required(),
  cat_id: Joi.required(),
  sub_cat_id: Joi.required(),
});

//userDeleteFromCart
const userDeleteCartProductScheme = Joi.object({
  user_id: Joi.required(),
  product_id: Joi.required(),

});
//userDeleteFromCart
// userRequestItemMulipleSchema
const userRequestItemMulipleSchema = Joi.object({
  user_id: Joi.required()
});
// userRequestItemMulipleSchema

const getStoreDetailbyIDSchema = Joi.object({
  store_id: Joi.required()
});

//deleteRequestByUserSchema
const deleteRequestByUserSchema = Joi.object({
  user_id: Joi.required(),
  req_id: Joi.required()

});

//deleteRequestByUserSchema

//deleteRequestByStoreSchema
const deleteRequestByStoreSchema = Joi.object({
  store_id: Joi.required(),
  req_id: Joi.required()

});
//deleteRequestByStoreSchema

// --- userListSchema ---
const userListSchema = Joi.object({
  user_id: Joi.required()
});
// --- End userListSchema ---

// --- addUserCardDetails ---
const addUserCardDetailsSchema = Joi.object({
  user_id: Joi.required(),
  holderName: Joi.required(),
  cardNumber: Joi.required(),
  cardExpiryDate: Joi.required(),
  cvvNumber: Joi.required(),
  cardType: Joi.required(),
  cardService: Joi.required(),
  zipcode: Joi.required()
});
// --- End addUserCardDetails ---

// --- getCardDetailsByUserIdSchema ---
const getCardDetailsByUserIdSchema = Joi.object({
  user_id: Joi.required()
});
// --- End getCardDetailsByUserIdSchema ---

// --- deleteUserCardDetailsSchema ---
const deleteUserCardDetailsSchema = Joi.object({
  user_id: Joi.required(),
  card_id: Joi.required()
});
// --- End deleteUserCardDetailsSchema ---

// --- defaultCardUserSchema ---
const defaultCardUserSchema = Joi.object({
  user_id: Joi.required(),
  card_id: Joi.required(),
});
// --- End defaultCardUserSchema ---

// --- addAmountInWalletSchema ---
const addAmountInWalletSchema = Joi.object({
  user_id: Joi.required(),
  // card_id: Joi.required(),
  walletAmount: Joi.required()
});
// --- End addAmountInWalletSchema ---

// --- getUserBalanceSchema ---
const getUserBalanceSchema = Joi.object({
  user_id: Joi.required()
})
// --- End getUserBalanceSchema ---

// --- getTransactionsDetailsSchema ---
const getTransactionsDetailsSchema = Joi.object({
  store_id: Joi.string(),
  user_id: Joi.string(),
  driver_id: Joi.string(),
})
// --- End getTransactionsDetailsSchema ---

// --- getBalanceByIdsSchema ---
const getBalanceByIdsSchema = Joi.object({
  driver_id: Joi.string(),
  store_id: Joi.string()
})
// --- End getBalanceByIdsSchema ---

// --- refundMoneySchema ---
const refundMoneySchema = Joi.object({
  req_id: Joi.required(),
  user_id: Joi.required(),
  store_id: Joi.required(),
  product_id: Joi.required()
})
// --- End refundMoneySchema ---

// --- relativeProductSchema ---
const relativeProductSchema = Joi.object({
  product_id: Joi.required(),
  store_id: Joi.required(),
  user_id: Joi.required()
})
// --- End relativeProductSchema ---

// --- withdrawByUserSchema ---
const withdrawByUserSchema = Joi.object({
  user_id: Joi.required(),
  card_id: Joi.required(),
  amount: Joi.required()
})
// --- End withdrawByUserSchema ---

// --- addCommentByUserSchema ---
const addCommentByUserSchema = Joi.object({
  user_id: Joi.required(),
  product_id: Joi.required(),
  comment: Joi.required()
})
// --- End addCommentByUserSchema ---

// --- getCommentsByProductIdSchema ---
const getCommentsByProductIdSchema = Joi.object({
  product_id: Joi.required()
})
// --- End getCommentsByProductIdSchema ---

// --- userOtpVerifySchema ---
const userOtpVerifySchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  otp: Joi.required(),
  user_id: Joi.required()
})
// --- End userOtpVerifySchema ---

// --- userCheckMobileSchema ---
const userCheckMobileSchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required()
})
// --- End userCheckMobileSchema ---

// --- createConnectAccountSchema ---
const createConnectAccountSchema = Joi.object({
  country: Joi.required(),
  email: Joi.required()
})
// --- End createConnectAccountSchema --- 

// --- updateUsernameSchema ---
const updateUsernameSchema = Joi.object({
  user_id: Joi.required(),
  firstName: Joi.required()
})
// --- End updateUsernameSchema ---

// --- transferAccountSchema ---
const transferAccountSchema = Joi.object({
  user_id: Joi.string(),
  driver_id: Joi.string(),
  store_id: Joi.string(),
  name: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  zip_code: Joi.string(),
  email: Joi.string(),
  account_number: Joi.string(),
  routing: Joi.string(),
  account_type: Joi.string(),
  cash_app_tag: Joi.string(),
  cash_app_acc_name: Joi.string(),
  phone_number: Joi.string(),
  zelle_acc_name: Joi.string(),
  type: Joi.required()
})
// --- End transferAccountSchema ---

// --- listTransferDataSchema ---
const listTransferDataSchema = Joi.object({
  user_id: Joi.string(),
  driver_id: Joi.string(),
  store_id: Joi.string()
})
// --- End listTransferDataSchema ---

// --- setDefaultAccountSchema ---
const setDefaultAccountSchema = Joi.object({
  user_id: Joi.string(),
  driver_id: Joi.string(),
  store_id: Joi.string(),
  acc_id: Joi.required()
})
// --- setDefaultAccountSchema ---

// --- deleteTransferAccDataSchema --- 
const deleteTransferAccDataSchema = Joi.object({
  user_id: Joi.string(),
  driver_id: Joi.string(),
  store_id: Joi.string(),
  acc_id: Joi.required()
})
// --- End deleteTransferAccDataSchema ---

// --- addWithdrawRequestSchema ---
const addWithdrawRequestSchema = Joi.object({
  user_id: Joi.string(),
  store_id: Joi.string(),
  driver_id: Joi.string(),
  transfer_acc_id: Joi.required(),
  amount: Joi.required(),
  day_transfer: Joi.required(),
  withdraw_fee: Joi.required()
})
// --- End addWithdrawRequestSchema ---

// --- getTransferReqDataSchema ---
const getTransferReqDataSchema = Joi.object({
  withdraw_id: Joi.required()
})
// --- End getTransferReqDataSchema ---

// --- trasactionFCMTokenSchema ---
const trasactionFCMTokenSchema = Joi.object({
  fcm_token: Joi.required()
})
// --- End trasactionFCMTokenSchema ---

// getStoreCategoriesSchema
module.exports = {
  AuthSchema,
  LoginSchema,
  UserVerifySchema,
  userLoginSchema,
  userUserNemeSchema,
  userUpdatePasswordSchema,
  usersendUserOTPSchema,
  userAvatarUpdatechema,
  userPasswordResetSchema,
  userRegisterSchema,
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
};
