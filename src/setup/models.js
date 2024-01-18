// Imports
import sequelize from "sequelize";
import Sequelize from "sequelize";
// App Imports
import databaseConnection from "./database";

const models = {
  // User: databaseConnection.import('../modules/user/model'),old
  User: require("../modules/user/models")(databaseConnection, Sequelize),
  Store: require("../modules/store/models")(databaseConnection, Sequelize),
  // StoreCategory: require("../modules/store/models/models_category")(databaseConnection, Sequelize),
  ItemCategoryMaster: require("../modules/store/models/models_item_category_master")(databaseConnection, Sequelize),
  ItemSubCategoryMaster: require("../modules/store/models/models_item_sub_category_master")(databaseConnection, Sequelize),
  StoreCategory: require("../modules/store/models/models_store_category")(databaseConnection, Sequelize),
  StoreTiming: require("../modules/store/models/models_store_timing")(databaseConnection, Sequelize),
  StoreAttributesMasters: require("../modules/store/models/models_store_attributes")(databaseConnection, Sequelize),
  StoreAttributesValuesMasters: require("../modules/store/models/models_store_attributes_values")(databaseConnection, Sequelize),
  StoreProductQTY: require("../modules/store/models/models_store_product_qty")(databaseConnection, Sequelize),

  StoreProduct: require("../modules/store/models/models_store_products")(databaseConnection, Sequelize),
  StoreProductColor: require("../modules/store/models/models_store_products_color")(databaseConnection, Sequelize),
  StoreProductSize: require("../modules/store/models/models_store_products_size")(databaseConnection, Sequelize),
  StoreProductCategory: require("../modules/store/models/models_store_products_cat")(databaseConnection, Sequelize),
  StoreProductSubCategory: require("../modules/store/models/models_store_products_subcat")(databaseConnection, Sequelize),
  StoreProductSubCategoryData: require("../modules/store/models/models_store_products_subcat_data")(databaseConnection, Sequelize),
  StoreW9Tax: require("../modules/store/models/models_store_W9tax")(databaseConnection, Sequelize),

  productGallery: require("../modules/store/models/models_ productGallery")(databaseConnection, Sequelize),
  UserAddTCart: require("../modules/store/models/models_user_add_to_cart")(databaseConnection, Sequelize),
  UserProductRequestToStore: require("../modules/store/models/models_user_store_product_request.js")(databaseConnection, Sequelize),
  Driver: require("../modules/driver/models/index")(databaseConnection, Sequelize),

  UserProductItemRequetAcceptedStore: require("../modules/store/models/models_user_store_product_request_accepted_store")(databaseConnection, Sequelize),
  finalRequestByUser: require("../modules/user/models/models_final_request_by_user")(databaseConnection, Sequelize),
  DriverRequestRejectData: require("../modules/driver/models/driver_request_reject-data")(databaseConnection, Sequelize),
  requestQueue: require("../modules/store/models/request_queue")(databaseConnection, Sequelize),
  DriverQueues: require("../modules/driver/models/driver_queue")(databaseConnection, Sequelize),
  userCardDetails: require("../modules/user/models/user_card_details")(databaseConnection, Sequelize),
  productSoldOut: require("../modules/store/models/models_product_sold_out")(databaseConnection, Sequelize),
  storeDeactive: require("../modules/store/models/store_deactive")(databaseConnection, Sequelize),
  manageProductSize: require("../modules/store/models/models_manage_product_size")(databaseConnection, Sequelize),
  Transaction: require("../modules/user/models/transactions")(databaseConnection, Sequelize),
  adminAmount: require("../modules/user/models/admin_amount")(databaseConnection, Sequelize),
  Comments: require("../modules/user/models/comments")(databaseConnection, Sequelize),
  transferAccount: require("../modules/user/models/transfer_account")(databaseConnection, sequelize),
  withdrawRequests: require("../modules/user/models/withdraw_request")(databaseConnection, sequelize),
  trasactionFCM: require("../modules/user/models/trasaction_fcmtoken")(databaseConnection, Sequelize)

  // UserOTP: require('../modules/user/models/otpmodel')(databaseConnection, Sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = databaseConnection;
models.Sequelize = Sequelize;
export default models;
