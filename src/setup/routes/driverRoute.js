import {
  driverRegister,
  driverMobileCheck,
  addDriverVehicleData,
  driverLogin,
  driverStatus,
  getAllStore,
  getUserProductStoreAcceptedData,
  getDataByDriverStatus,
  addDriverCardDetails,
  getCardDetailsByDriverId,
  deleteDriverCardDetails,
  defaultCardDriver,
  withdrawByDriver,
  driverRequested,
  driverOtpVerify,
  driverCheckMobile,
  requestQueueList,
  finalRequestByUser,
  demoMultiReq,
  userRequestDemo,
} from "../../modules/driver/controllers/DriverController";

console.log("SETUP-driverRoutesAPI");

async function routes(fastify, options) {
  fastify.post("/driverMobileCheck", { handler: driverMobileCheck });
  fastify.post("/driverRegister", { handler: driverRegister });
  fastify.post("/addDriverVehicleData", { handler: addDriverVehicleData });
  fastify.post("/driverLogin", { handler: driverLogin });
  fastify.post("/driverStatus", { handler: driverStatus });
  fastify.post("/getAllStore", { handler: getAllStore });
  fastify.post("/getUserProductStoreAcceptedData", { handler: getUserProductStoreAcceptedData });
  fastify.post("/getDataByDriverStatus", { handler: getDataByDriverStatus });
  fastify.post("/addDriverCardDetails", { handler: addDriverCardDetails });
  fastify.post("/getCardDetailsByDriverId", { handler: getCardDetailsByDriverId });
  fastify.post("/deleteDriverCardDetails", { handler: deleteDriverCardDetails });
  fastify.post("/defaultCardDriver", { handler: defaultCardDriver });
  fastify.post("/withdrawByDriver", { handler: withdrawByDriver });
  fastify.post("/driverRequested", { handler: driverRequested });
  fastify.post("/driverOtpVerify", { handler: driverOtpVerify });
  fastify.post("/driverCheckMobile", { handler: driverCheckMobile });
  fastify.post("/requestQueueList", { handler: requestQueueList });
  fastify.post("/finalRequestByUser", { handler: finalRequestByUser }); //demo
  fastify.post("/demoMultiReq", { handler: demoMultiReq }); //demo
  fastify.post("/userRequestDemo", { handler: userRequestDemo }); //demo

  //store service
}

module.exports = routes;

