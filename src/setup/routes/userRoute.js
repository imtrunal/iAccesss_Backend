import {
  userLogin,
  userRegister,
  getUserName,
  updateUserPassword,
  resetUserPassword,
  sendUserOTP,
  resendUserOTP,
  userProductList,
  userProductSuggestionList,
  userStoreProductSearch,
  userAddToCart,
  userGetAddToCart,
  userRequested,
  userSearch,
  userRequestItem,
  userRequestItemAccepted,
  getStoreCategories,
  getProductListStoreByCategories,
  getProductListStoreBySubCategories,
  userDeleteCartProduct,
  userRequestItemMultiple,
  getStoreDetailbyID,
  deleteRequestByUser,
  deleteRequestByStore,
  userList,
  addUserCardDetails,
  getCardDetailsByUserId,
  deleteUserCardDetails,
  defaultCardUser,
  addAmountInWallet,
  getUserBalance,
  getTransactionsDetails,
  getBalanceByIds,
  refundMoney,
  relativeProduct,
  withdrawByUser,
  addCommentByUser,
  getCommentsByProductId,
  userOtpVerify,
  userCheckMobile,
  createConnectAccount,
  updateUsername,
  transferAccReqAdd,
  listTransferData,
  allAccTransferData,
  setDefaultAccount,
  deleteTransferAccData,
  addWithdrawRequest,
  getAllWithdrawRequest,
  getTransferReqData,
  updateStatus,
  trasactionFCMToken,

} from "../../modules/user/controllers/UserController";

console.log("SETUP-userRoutesAPI");

async function routes(fastify, options) {

  fastify.post("/userLogin", { handler: userLogin });
  fastify.post("/userRegister", { handler: userRegister });
  fastify.post("/getUserName", { handler: getUserName });
  fastify.post("/updateUserPassword", { handler: updateUserPassword });
  fastify.post("/resetUserPassword", { handler: resetUserPassword });
  fastify.post("/sendUserOTP", { handler: sendUserOTP });
  fastify.post("/resendUserOTP", { handler: resendUserOTP });
  fastify.post("/userProductList", { handler: userProductList }); //rework
  fastify.post("/userProductSuggestionList", { handler: userProductSuggestionList }); //rework
  fastify.get("/userStoreProductSearch", { handler: userStoreProductSearch });//rework
  fastify.post("/userAddToCart", { handler: userAddToCart });//rework
  fastify.post("/userGetAddToCart", { handler: userGetAddToCart });//rework
  fastify.post("/userRequested", { handler: userRequested });//rework
  fastify.post("/userSearch", { handler: userSearch });//rework
  fastify.post("/userRequestItem", { handler: userRequestItem });//rework
  fastify.post("/userRequestItemAccepted", { handler: userRequestItemAccepted });//rework
  fastify.post("/getStoreCategories", { handler: getStoreCategories });//rework
  fastify.post("/getProductListStoreByCategories", { handler: getProductListStoreByCategories });//rework
  fastify.post("/getProductListStoreBySubCategories", { handler: getProductListStoreBySubCategories });//rework
  fastify.post("/userDeleteCartProduct", { handler: userDeleteCartProduct });//rework
  fastify.post("/getStoreDetailbyID", { handler: getStoreDetailbyID });//rework
  fastify.post("/deleteRequestByUser", { handler: deleteRequestByUser });//rework
  fastify.post("/deleteRequestByStore", { handler: deleteRequestByStore });//rework
  fastify.post("/userList", { handler: userList });
  fastify.post("/addUserCardDetails", { handler: addUserCardDetails });
  fastify.post("/getCardDetailsByUserId", { handler: getCardDetailsByUserId });
  fastify.post("/deleteUserCardDetails", { handler: deleteUserCardDetails });
  fastify.post("/defaultCardUser", { handler: defaultCardUser });
  fastify.post("/addAmountInWallet", { handler: addAmountInWallet });
  fastify.post("/getUserBalance", { handler: getUserBalance });
  fastify.post("/getTransactionsDetails", { handler: getTransactionsDetails });
  fastify.post("/getBalanceByIds", { handler: getBalanceByIds });
  fastify.post("/refundMoney", { handler: refundMoney });
  fastify.post("/relativeProduct", { handler: relativeProduct });
  fastify.post("/withdrawByUser", { handler: withdrawByUser });
  fastify.post("/addCommentByUser", { handler: addCommentByUser });
  fastify.post("/getCommentsByProductId", { handler: getCommentsByProductId });
  fastify.post("/userOtpVerify", { handler: userOtpVerify });
  fastify.post("/userCheckMobile", { handler: userCheckMobile });
  fastify.post("/createConnectAccount", { handler: createConnectAccount });
  fastify.post("/updateUsername", { handler: updateUsername });
  fastify.post("/transferAccReqAdd", { handler: transferAccReqAdd });
  fastify.post("/listTransferData", { handler: listTransferData });
  fastify.post("/setDefaultAccount", { handler: setDefaultAccount });
  fastify.get("/allAccTransferData", { handler: allAccTransferData });
  fastify.post("/deleteTransferAccData", { handler: deleteTransferAccData });
  fastify.post("/addWithdrawRequest", { handler: addWithdrawRequest });
  fastify.get("/getAllWithdrawRequest", { handler: getAllWithdrawRequest });
  fastify.post("/getTransferReqData", { handler: getTransferReqData });
  fastify.post("/updateStatus", { handler: updateStatus });
  fastify.post("/trasactionFCMToken", { handler: trasactionFCMToken });

  // fastify.post("/userRequestItemMultiple", { handler: userRequestItemMultiple });//rework

}

module.exports = routes;
