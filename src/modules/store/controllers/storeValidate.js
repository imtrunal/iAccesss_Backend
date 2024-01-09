const Joi = require("joi");

// --- storeLoginSchema ---
const storeLoginSchema = Joi.object({
  // username: Joi.required(),
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
 // password: Joi.string().required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required(),
});
// --- End storeLoginSchema ---

// --- forStoreLogin ---
const forStoreLogin = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required()
})
// --- End forStoreLogin ---

// --- storeRegisterSchema ---
const storeRegisterSchema = Joi.object({
  store_id: Joi.required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required(),
  // username: Joi.required(),
  // password: Joi.string().required(),
  storename: Joi.required(),
  // store_category: Joi.required(),
  all_days_open: Joi.required(),
  open_hours: Joi.required(),
  store_opening_days: Joi.required(),
  securiy_pin: Joi.required(),
  store_address: Joi.required(),
  store_lat: Joi.required(),
  store_long: Joi.required(),
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  country_name: Joi.required(),
  state_name: Joi.required(),
  city_name: Joi.required(),
  cat_name: Joi.required(),
});
// --- storeRegisterSchema ---

// --- storeProductCategorySchema ---
const storeProductCategorySchema = Joi.object({
  store_id: Joi.required(),
  item_cat_name: Joi.required(),
});
// --- storeProductCategorySchema ---

// --- getstoreProductCategorySchema ---
const getstoreProductCategorySchema = Joi.object({
  store_id: Joi.required(),
});
// --- getstoreProductCategorySchema ---

// --- saveStoreProductSubCategorySchema ---
const saveStoreProductSubCategorySchema = Joi.object({
  store_id: Joi.required(),
  cat_id: Joi.required(),
  sub_cat_name: Joi.required(),
});
// --- saveStoreProductSubCategorySchema ---

// --- getStoreProductSubCategorySchema ---
const getStoreProductSubCategorySchema = Joi.object({
  store_id: Joi.required(),
  cat_id: Joi.required(),
});
// --- getStoreProductSubCategorySchema ---

// --- storecheckSchema ---
const storecheckSchema = Joi.object({
  country_code: Joi.required(),
  phone_number: Joi.string().required(),
});
// --- End storecheckSchema ---

// --- storeVerifyOTPSchema ---
const storeVerifyOTPSchema = Joi.object({
  store_id: Joi.required(),
  otp: Joi.required(),
});
// --- End storeVerifyOTPSchema ---

// --- storeresetStoreOTPSchema ---
const storeresetStoreOTPSchema = Joi.object({
  store_id: Joi.required(),
});
// --- End storeresetStoreOTPSchema ---

// --- storeForgetPasswordSchema ---
const storeForgetPasswordSchema = Joi.object({
  store_id: Joi.required(),
  new_password: Joi.required(),
  confirm_password: Joi.required(),
});
// --- storeForgetPasswordSchema ---

const storeForgetPasswordRequestSchema = Joi.object({
  username: Joi.required(),
});
//setColorToStoreSchme
const setColorToStoreSchme = Joi.object({
  store_id: Joi.required(),
  attr_color: Joi.required(),
});
//setColorToStoreSchme
const setSizeToStore = Joi.object({
  store_id: Joi.required(),
  attr_size: Joi.required(),
  attr_qty: Joi.required(),
});
const userRequestItemToStore = Joi.object({
  store_id: Joi.required()
});

// deleteProductByIdSchema
const deleteProductByIdSchema = Joi.object({
  product_id: Joi.required()  
});

// deleteCategoryByIdSchema
const deleteCategoryByIdSchema = Joi.object({
  store_id : Joi.required(),
  cat_id : Joi.required(),

})

//deleteSubCategoryByIdSchema
const deleteSubCategoryByIdSchema = Joi.object({
  store_id : Joi.required(),
  sub_cat_id : Joi.required(),

})
//deleteSubCategoryByIdSchema

/* UniqueStoreNameSchema */
const uniqueStoreNameSchema = Joi.object({
  storename : Joi.required()
})
/* --UniqueStoreNameSchema-- */

/* fmcTokenUpdate */
const fmcTokenUpdate = Joi.object({
  store_id : Joi.required(),
  user_id : Joi.required(),
  fcm_token : Joi.required()
})
/* --fmcTokenUpdate-- */

/* fcmTokenRemove */
const fcmTokemRemove = Joi.object({
  store_id : Joi.required(),
  user_id : Joi.required()
})
/* --fcmTokenRemove-- */

/* updateStoreDetails */
const updateStoreDetails = Joi.object({
  store_id: Joi.required(),
  deviceType: Joi.required(),
  fcm_token: Joi.required(),
  storename: Joi.required(),
  password: Joi.string().required(),
  securiy_pin: Joi.required(),
  store_address: Joi.required(),
  store_lat: Joi.required(),
  store_long: Joi.required(),
  // store_category: Joi.required(),
  store_opening_days: Joi.required(),
  all_days_open: Joi.required(),
  // open_hours: Joi.required(),
  all_day_open_timing: Joi.required()
})
/* --updateStoreDetails-- */

/* productDetailsByUserid,Storeid,Productid */
const productDetails = Joi.object({
  store_id : Joi.required(),
  user_id : Joi.required(),
  product_id : Joi.required()
});
/* --productDetailsByUserid,Storeid,Productid-- */



// --- openCloseStoreSchema ---
const openCloseStoreSchema = Joi.object({
  store_id: Joi.required(),
  status: Joi.required()
});
// --- openCloseStoreSchema ---

// --- addStoreCardDetailsSchema ---
const addStoreCardDetailsSchema = Joi.object({
  store_id: Joi.required(),
  holderName: Joi.required(),
  cardNumber: Joi.required(),
  cardExpiryDate: Joi.required(),
  cvvNumber: Joi.required(),
  cardType: Joi.required(),
  cardService: Joi.required(),
  zipcode: Joi.required(),
});
// --- End addStoreCardDetailsSchema ---

// --- getStoreCardDetailsSchema ---
const getStoreCardDetailsSchema = Joi.object({
  store_id: Joi.required()
})
// --- End getStoreCardDetailsSchema ---

// --- deleteStoreCardDetailsSchema ---
const deleteStoreCardDetailsSchema = Joi.object({
  store_id: Joi.required(),
  card_id: Joi.required()
})
// --- End deleteStoreCardDetailsSchema ---

// --- defaultCardStoreSchema ---
const defaultCardStoreSchema = Joi.object({
  store_id: Joi.required(),
  card_id: Joi.required(),
})
// --- End defaultCardStoreSchema ---

// --- withdrawByStoreSchema ---
const withdrawByStoreSchema = Joi.object({
  store_id: Joi.required(),
  card_id: Joi.required(),
  amount: Joi.required(),
  withdrawFee: Joi.required(),
})
// --- End withdrawByStoreSchema ---

// --- productSoldOutSchema ---
const productSoldOutSchema = Joi.object({
  store_id: Joi.required(),
  product_id: Joi.required()
})
// --- End productSoldOutSchema ---

// --- productUnsoldSchema ---
const productUnsoldSchema = Joi.object({
  store_id: Joi.required(),
  product_id: Joi.required()
})
// --- End productUnsoldSchema ---

// ---  storeDeactivateSchema ---
const storeDeactivateSchema = Joi.object({
  store_id: Joi.required(),
})
// --- End storeDeactivateSchema ---

// ---  storeActiveSchema ---
const storeActiveSchema = Joi.object({
  store_id: Joi.required(),
})
// --- End storeActiveSchema ---

// --- storeOtpVerifySchema ---
const storeOtpVerifySchema = Joi.object({
  phoneCode: Joi.required(),
  phoneNumber: Joi.required(),
  otp: Joi.required(),
  store_id: Joi.required()
})
// --- End storeOtpVerifySchema ---

// --- insertStoreCommentSchema ---
const insertStoreCommentSchema = Joi.object({
  store_id: Joi.required(),
  user_id: Joi.required(),
  comment: Joi.required()
})
// --- End insertStoreCommentSchema ---

// --- getStoreCommentsSchema ---
const getStoreCommentsSchema = Joi.object({
  store_id: Joi.required()
})
// --- End getStoreCommentsSchema ---

// --- getStoreAddress ---
const getStoreAddress = Joi.object({
  store_id: Joi.required()
})
// --- End getStoreAddress ---

// --- insertStoreW9TaxSchema ---
const insertStoreW9TaxSchema = Joi.object({
  store_id: Joi.required(),
  full_name: Joi.required(),
  business_name: Joi.required(),
  classification: Joi.required(),
  address: Joi.required(),
  city: Joi.required(),
  state: Joi.required(),
  zip: Joi.required(),
  SSN: Joi.required(),
  today_date: Joi.required(),
  e_signature: Joi.required(),
})
// --- End insertStoreW9TaxSchema ---

// --- deleteStoreByIdSchema ---
const deleteStoreByIdSchema = Joi.object({
  store_id: Joi.required()  
});
// --- End deleteStoreByIdSchema ---

// --- getW9Tax ---
const getW9Tax = Joi.object({
  store_id: Joi.required()
})
// --- End getW9Tax ---

module.exports = {
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
  setColorToStoreSchme,
  userRequestItemToStore,
  deleteProductByIdSchema,
  deleteCategoryByIdSchema,
  deleteSubCategoryByIdSchema,
  uniqueStoreNameSchema,
  fmcTokenUpdate,
  fcmTokemRemove,
  updateStoreDetails,
  productDetails,
  forStoreLogin,
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
  deleteStoreByIdSchema,
  getW9Tax
};
