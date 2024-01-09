import {
  storeLogin,
  storeRegister,
  checkMobile,
  verifyOTP,
  resetStoreOTP,
  updateStoreForgetPassword,
  storeForgetPasswordRequest,
  getStoreCategoryMaster,
  getItemCategoryMaster,
  getItemSubCategoryMaster,
  editStoreDetails,
  uploadIMG,
  addProuctCategory,
  saveProductCategory,
  getProductCategory,
  saveProductSubCategory,
  getProductSubCategory,
  getAttributesList,
  getAttributesListWithValues,
  saveStoreProduct,
  getStoreProductList,
  setSizeToStore,
  userRequestItemToStore,
  deleteProductById,
  setColorToStore,
  deleteCategoryById,
  deletesubCategoryById,
  updateStoreProduct,
  uniqueStoreName,
  tokenUpdate,
  tokenRemove,
  updateStoreDetails,
  productDetails,
  openCloseStore,
  addStoreCardDetails,
  getStoreCardDetails,
  deleteStoreCardDetails,
  defaultCardStore,
  withdrawByStore,
  productSoldOut,
  productUnsold,
  storeDeactivate,
  storeActive,
  storeOtpVerify,
  insertStoreComment,
  getStoreComments,
  getStoreAddress,
  insertW9Tax,
  getW9Tax
  // deleteStore
} from "../../modules/store/controllers/StoreController";

console.log("SETUP - storeRoutesAPI");

async function routes(fastify, options) {
  fastify.post("/storeLogin", { handler: storeLogin });
  fastify.post("/storeRegister", { handler: storeRegister }); //check checkMobile after status 0 then call to storeRegister
  fastify.post("/checkMobile", { handler: checkMobile });
  fastify.post("/verifyOTP", { handler: verifyOTP });
  fastify.post("/resetStoreOTP", { handler: resetStoreOTP });
  fastify.post("/updateStoreForgetPassword", {
    handler: updateStoreForgetPassword
  });
  fastify.post("/storeForgetPasswordRequest", {
    handler: storeForgetPasswordRequest,
  });
  fastify.post("/editStoreDetails", { handler: editStoreDetails });
  fastify.post("/uploadIMG", { handler: uploadIMG }); //not in user

  fastify.post("/saveProductCategory", { handler: saveProductCategory }); //save product category store wise
  fastify.post("/getProductCategory", { handler: getProductCategory }); //save product category store wise
  fastify.post("/saveProductSubCategory", { handler: saveProductSubCategory }); //save product category store wise
  fastify.post("/getProductSubCategory", { handler: getProductSubCategory }); //save product category store wise
  fastify.post("/getAttributesList", { handler: getAttributesList }); //get master attributes of pre-defined
  fastify.post("/getAttributesListWithValues", {
    handler: getAttributesListWithValues,
  }); //get master of attributes of pre-defined values also
  fastify.post("/saveStoreProduct", { handler: saveStoreProduct }); //get master of attributes of pre-defined values also
  fastify.post("/updateStoreProduct", { handler: updateStoreProduct }); //get master of attributes of pre-defined values also
  fastify.get("/getStoreProductList", { handler: getStoreProductList }); //get master of attributes of pre-defined values also
  fastify.get("/getStoreCategoryMaster", { handler: getStoreCategoryMaster });
  fastify.get("/getItemCategoryMaster", { handler: getItemCategoryMaster });
  fastify.get("/getItemSubCategoryMaster", {
    handler: getItemSubCategoryMaster,
  });
  //store service
  fastify.post("/addProuctCategory", { handler: addProuctCategory });
  fastify.post("/setSizeToStore", { handler: setSizeToStore });
  fastify.post("/setColorToStore", { handler: setColorToStore });
  fastify.post("/userRequestItemToStore", { handler: userRequestItemToStore });
  fastify.post("/deleteProductById", { handler: deleteProductById });
  fastify.post("/deleteCategoryById", { handler: deleteCategoryById });
  fastify.post("/deletesubCategoryById", { handler: deletesubCategoryById });

  fastify.post("/uniqueStoreName", { handler: uniqueStoreName });
  fastify.post("/tokenUpdate", { handler: tokenUpdate });
  fastify.post("/tokenRemove", { handler: tokenRemove });
  fastify.post("/updateStoreDetails", { handler: updateStoreDetails });
  fastify.post("/productDetails", { handler: productDetails });
  fastify.post("/openCloseStore", { handler: openCloseStore });
  //store service

  fastify.post("/addStoreCardDetails", { handler: addStoreCardDetails });
  fastify.post("/getStoreCardDetails", { handler: getStoreCardDetails });
  fastify.post("/deleteStoreCardDetails", { handler: deleteStoreCardDetails });
  fastify.post("/defaultCardStore", { handler: defaultCardStore });
  fastify.post("/withdrawByStore", { handler: withdrawByStore });
  fastify.post("/productSoldOut", { handler: productSoldOut });
  fastify.post("/productUnsold", { handler: productUnsold });
  fastify.post("/storeDeactivate", { handler: storeDeactivate });
  fastify.post("/storeActive", { handler: storeActive });
  fastify.post("/storeOtpVerify", { handler: storeOtpVerify });
  fastify.post("/insertStoreComment", { handler: insertStoreComment });
  fastify.post("/getStoreComments", { handler: getStoreComments });
  fastify.post('/getStoreAddress', { handler: getStoreAddress })
  fastify.post("/insertW9Tax", { handler: insertW9Tax })
  fastify.post("/getW9Tax", { handler: getW9Tax })
  // fastify.post("/deleteStore", { handler : deleteStore })

}

module.exports = routes;
