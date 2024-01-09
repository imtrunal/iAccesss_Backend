// Imports 6:40
const path = require("path");
const cron = require("node-cron");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fp = require("fastify-plugin");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Load express modules
const multer = require("fastify-multer");
import models from "../setup/models";
import * as Api from "../setup/ApiResponse";
import * as ayraFCM from "../setup/FirebaseHelper";
import { time } from "console";    
import { title } from "process";
import { argv } from "process";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const {
  userAvatarUpdatechema,
} = require("../modules/user/controllers/userValidate");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "iaccess",
    allowedFormats: ["jpg", "png"],
    // transformation: [ { width: 800, height: 800, crop: 'limit' } ],
    public_id: (req, file) => "iaccess" + new Date().getTime(),
  },
});
const parser = multer({ storage });
function getUniqueID() {

  //return Date.now() + ( (Math.random()*10).toFixed());
  var date = new Date();
  var components = [
    // date.getYear(),
    //date.getMonth(),
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    // date.getMilliseconds()
  ];

  return components.join("");
}

var generateRandomNDigitsV1 = (n) => {
  n = 1;
  return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n) + getUniqueID();
};
//  const registrationToken = 'epifzojmToi3DQEoSEoAdX:APA91bGiXuPS9hCMv6v2whaYQBsGJAVkNeId_XeKYAmfI-XxujKSRYx2gOBDRKtyUN4wUmTG1Ovvy-nKa4CTmCqKdmc9kLA7tKszOPXXH80OnQrvhlo48OEyOp7nHnfqI93tKrZ9-zs6';
// //const registrationToken = 'epyewsTZTy-F7LtGXNmG0l:APA91bEQvU5Yn5yYtdMzZSYH9MUT12J-mcOZgySuozDr_pBJzqjDCzXZRcofnA2nSA38apob04-PlpYyd5HHStGTb6CDPH7Bmf9fFsuAQjQ-L2L_LaaZUpwSG03JKvgeUR8cYbKMakqc';
// // const registrationToken = 'fYdQrpfFR_yh53bUc4HPwv:APA91bEl6THu1md-tswyHzM5KhFW8Ju2wAaM6WsREm_OourAmaX8708Ox3ask8amSLCZLrDVaikqdyqEIM5sWELho5AxI8UOQysIr8WVh1L4ID2EC_zAKSpTq1HcwVr9RqdcO-3lz8q_';
// const title=" \uD83D\uDE00 iaccesss Title";
// const body="iaccesss Body";

// ayraFCM.sendPushNotificationFCM(registrationToken,title,body,true);

export default function (server) {
  console.info("SETUP - Loading modules...");
  // Enable CORS
  server.register(require("fastify-cors"), {
    // put your options here
    origin: "*",
  });

  server.register(multer.contentParser);
  server.decorate("multer", { parser });

  server.register(require("fastify-rate-limit"), {
    global: false, // don't apply these settings to all the routes of the context
    max: 1, // default global max rate limit
    //  allowList: ['127.0.0.1'], // global allowlist access.
    allowList: function (req, key) {
      return req.headers["x-app-client-id"] === "internal-usage";
    },
  });

  //socket.io
  var http = require("http").Server(server);
  var io = require("socket.io")(http);
  console.log("======Socket Server==========55=========");
  // const io = require("socket.io")(http, {
  //   cors: { origin: "https://134.209.78.41:4007", methods: ["GET", "POST"] },
  // });

  // --- globalTimeOutVariable --- //
  var timeOut = [];
  console.log("mainTimeOut::", timeOut);
  var timeOutMain = [];


  io.on("connection", function (socket) {
    console.log("New User with:=> " + socket.id);

    // ----- joinUser ----- //
    socket.on("joinUser", function (data) {
      const userRoom = `User${data.user_id}`;
      socket.join(userRoom);
    });
    // ----- End joinUser ----- //


    // ----- joinDriver ----- //
    socket.on('joinDriver', function (data) {
      const driverRoom = `Driver${data.driver_id}`;
      socket.join(driverRoom);
    });
    // ----- End joinDriver ----- //


    // ----- joinStore ----- //
    socket.on("joinStore", function (data) {
      const storeRoom = `Store${data.store_id}`;
      socket.join(storeRoom);
    });
    // ----- End joinStore ----- //


    // ----- onProductRequestMultiple ----- //
    socket.on("onProductRequestMultiple", async (arg) => {
      models.UserProductItemRequetAcceptedStore.findOne({
        attributes: [[models.sequelize.fn('max', models.sequelize.col('id')), 'maxID']],
        raw: true,
      }).then(async (maxIds) => {
        const uId = Math.floor(Math.random() * 1000000000) + 1000000000;
        var arrProduct = arg.products;
        var colors = arg.colors;
        var sizes = arg.sizes;
        const productsArrDataMuliple = [];
        const getProductSizeData = [];

        arrProduct.forEach(async (product_id, index) => {
          var productArrDataValue = await models.StoreProduct.findOne({
            where: {
              store_id: arg.store_id,
              id: product_id,
            },
          });

          // const getProductQty = await models.StoreAttributesValuesMasters.findOne(
          //   {
          //     where: {
          //       attr_id: 2,
          //       store_id: arg.store_id,
          //       attr_name: sizes[index]
          //     }
          //   }
          // );

          // const getProductSize = await models.manageProductSize.findOne(
          //   {
          //     where: {
          //       store_id: arg.store_id,
          //       product_id: product_id,
          //       size: sizes[index],
          //     }
          //   }
          // );
          // getProductSizeData.push(getProductQty.attr_qty);


          // if (getProductSize == null) {
          //   const insertSize = await models.manageProductSize.create({
          //     store_id: arg.store_id,
          //     product_id: product_id,
          //     size: sizes[index],
          //     qty: getProductQty.attr_qty - 1
          //   });

          // } else {
          //   const updateQty = await models.manageProductSize.update(
          //     {
          //       qty: parseInt(getProductSize.qty) - 1
          //     },
          //     {
          //       where: {
          //         store_id: getProductSize.store_id
          //       }
          //     })
          // }
          // console.log("productArrDataValue", productArrDataValue);



          var [productColorArr] = await models.sequelize.query(
            `SELECT t2.attr_name as name,attr_code as code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${arg.store_id} and t1.product_id=${product_id} and t2.attr_id=1`
          );

          var [productSizeArr] = await models.sequelize.query(
            `SELECT t2.attr_name as size from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${arg.store_id} and t1.product_id=${product_id} and t2.attr_id=2`
          );

          var [productGalleryArr] = await models.sequelize.query(
            `SELECT product_img from productGalleries t1 where t1.store_id=${arg.store_id} and product_id=${product_id}`
          );

          const productAll = {
            products: productArrDataValue,
            productsAttrColor: colors[index],
            productsAttrSize: sizes[index],
            productsAttrGallry: productGalleryArr,
          };
          productsArrDataMuliple.push(productAll);

          var ReqData = models.UserProductItemRequetAcceptedStore.create({
            req_id: uId,
            user_id: arg.user_id,
            store_id: arg.store_id,
            product_id: product_id,
            color: colors[index],
            size: sizes[index]
          });

        })

        if (getProductSizeData[0] == undefined || getProductSizeData[0] > 0) {

          var [userDetail] = await models.sequelize.query(
            `SELECT * from users  where id=${arg.user_id}`
          );

          const data = {
            reqId: uId,
            productDetails: productsArrDataMuliple,
          };

          const forStoreData = {
            reqId: uId,
            store_id: arg.store_id,
            productDetails: productsArrDataMuliple,
            userDetail: userDetail,
          };

          await models.UserAddTCart.destroy({
            where: {
              user_id: arg.user_id,
              store_id: arg.store_id,
            },
          });

          //productconsole.log(forStoreData);
          const userRoom = `User${arg.user_id}`;
          const storeRoom = `Store${arg.store_id}`;
          io.to(userRoom).emit("onProductResponseMultiple", data);
          io.to(storeRoom).emit("onAcceptFirstTimeMultiple", forStoreData);


          var storeArr = await models.Store.findOne({
            where: {
              id: arg.store_id,
            },
          });

          var userArr = await models.User.findOne({
            where: {
              id: arg.user_id,
            },
          });

          console.log("ArgumentValue==>", arg);
          const registrationToken = storeArr.fcm_token;

          // const registrationToken = 'epifzojmToi3DQEoSEoAdX:APA91bGiXuPS9hCMv6v2whaYQBsGJAVkNeId_XeKYAmfI-XxujKSRYx2gOBDRKtyUN4wUmTG1Ovvy-nKa4CTmCqKdmc9kLA7tKszOPXXH80OnQrvhlo48OEyOp7nHnfqI93tKrZ9-zs6';

          // const registrationToken = 'fYdQrpfFR_yh53bUc4HPwv:APA91bEl6THu1md-tswyHzM5KhFW8Ju2wAaM6WsREm_OourAmaX8708Ox3ask8amSLCZLrDVaikqdyqEIM5sWELho5AxI8UOQysIr8WVh1L4ID2EC_zAKSpTq1HcwVr9RqdcO-3lz8q_';

          const title = " iaccesss Notification";
          const body = `${userArr.firstName} send request to `;

          const req_id = "1";
          const product_id = "1";
          const status = '1';

          console.log("registrationToken1:", registrationToken);

          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          );

        } else {

          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("qualityIsZero");

        }

        // for (const product_id of arrProduct) {


        // console.log(uId)



      }).then(maxPrices => {
        // console.log(maxPrices);
      });

    });
    // ----- End onProductRequestMultiple ----- //

    // ----- onProductRequest ----- //
    socket.on("onProductRequest", async (arg) => {

      models.UserProductItemRequetAcceptedStore.findOne({
        attributes: [[models.sequelize.fn('max', models.sequelize.col('id')), 'maxID']],
        raw: true,
      }).then(async (maxIds) => {
        const uId = Math.floor(Math.random() * 1000000000) + 1000000000;
        console.log("dataaa...", uId);
        const productColorArrData = arg.color;
        const productSizeArrData = arg.size;
        console.log(`Data: ${uId} & ${productColorArrData} & ${productSizeArrData}`);

        var productArrDataValue = await models.StoreProduct.findOne({
          where: {
            store_id: arg.store_id,
            id: arg.product_id,
          },
        });
        console.log("productArrDataValue::", productArrDataValue);

        const getProductQty = await models.StoreAttributesValuesMasters.findOne(
          {
            where: {
              attr_id: 2,
              store_id: arg.store_id,
              attr_name: productSizeArrData
            }
          }
        );
        console.log("getProductQty::", getProductQty);

        const getProductSize = await models.manageProductSize.findOne(
          {
            where: {
              store_id: arg.store_id,
              product_id: arg.product_id,
              size: productSizeArrData,
            }
          }
        );
        console.log("getProductSize::", getProductSize);

        if (getProductSize == null || getProductSize.qty > 0) {

          var [productDataArr] = await models.sequelize.query(
            `SELECT * from  products where id = ${arg.product_id} and store_id="${arg.store_id}"`
          );
          console.log("productDataArr::", productDataArr);

          // --- For get color ---
          // var [productColorArr] = await models.sequelize.query(
          //   `SELECT t1.id,t2.attr_name,t2.attr_code from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${arg.store_id} and t1.product_id=${arg.product_id} and t2.attr_id=1`
          // );

          // for (const productColor of productColorArr) {
          //   const colorData = {
          //     name: productColor.attr_name,
          //     code: productColor.attr_code,
          //   };

          //   productColorArrData.push(colorData);
          // }
          // ----- For get color -----

          // --- For get size ---
          // var [productSizeArr] = await models.sequelize.query(
          //   `SELECT t1.id,t2.attr_name from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${arg.store_id} and t1.product_id=${arg.product_id} and t2.attr_id=2`
          // );
          // for (const productSize of productSizeArr) {
          //   productSizeArrData.push(productSize.attr_name);
          // }
          // ----- For get size -----

          // --- For get gallery ---
          var [productGalleryArr] = await models.sequelize.query(
            `SELECT product_img from productGalleries t1 where t1.store_id=${arg.store_id} and product_id=${arg.product_id}`
          );
          console.log("productGalleryArr::", productGalleryArr);
          // ----- For get gallery -----

          // const getProductQty = await models.StoreAttributesValuesMasters.findOne(
          //   {
          //     where: {
          //       attr_id: 2,
          //       store_id: arg.store_id,
          //       attr_name: arg.size
          //     }
          //   }
          // );
          // console.log("getProductQty::", getProductQty);

          // const getProductSize = await models.manageProductSize.findOne(
          //   {
          //     where: {
          //       store_id: arg.store_id,
          //       product_id: arg.product_id,
          //       size: arg.size,
          //     }
          //   }
          // );
          // console.log("getProductSize::", getProductSize);



          const productAll = {
            products: productDataArr,
            productsAttrColor: productColorArrData,
            productsAttrSize: productSizeArrData,
            productsAttrGallry: productGalleryArr,
          };
          console.log("productAll==>", productAll);

          const ReqData = await models.UserProductItemRequetAcceptedStore.create({
            req_id: uId,
            user_id: arg.user_id,
            store_id: arg.store_id,
            product_id: arg.product_id,
            color: arg.color,
            size: arg.size
          });
          console.log("ReqData::", ReqData);

          var [userDetail] = await models.sequelize.query(
            `SELECT * from users  where id=${arg.user_id}`
          );
          console.log("userDetail::", userDetail);

          const data = {
            reqId: ReqData.req_id,
            productDetails: productAll,
          };

          const forStoreData = {
            reqId: ReqData.req_id,
            userDetail: userDetail,
          };

          var storeArr = await models.Store.findOne({
            where: {
              id: arg.store_id,
            },
          });
          console.log("storeArr::", storeArr);

          var userArr = await models.User.findOne({
            where: {
              id: arg.user_id,
            },
          });
          console.log("userArr::", userArr);

          const deleteToCart = await models.UserAddTCart.destroy({
            where: {
              user_id: arg.user_id,
              store_id: arg.store_id,
              product_id: arg.product_id
            },
          });
          console.log("deleteToCart>>>>>", deleteToCart);
          //  const registrationToken = 'epifzojmToi3DQEoSEoAdX:APA91bGiXuPS9hCMv6v2whaYQBsGJAVkNeId_XeKYAmfI-XxujKSRYx2gOBDRKtyUN4wUmTG1Ovvy-nKa4CTmCqKdmc9kLA7tKszOPXXH80OnQrvhlo48OEyOp7nHnfqI93tKrZ9-zs6';
          const registrationToken = storeArr.fcm_token;

          console.log("registrationToken::", registrationToken);
          console.log("stroreArra::", storeArr);

          //const registrationToken = 'epyewsTZTy-F7LtGXNmG0l:APA91bEQvU5Yn5yYtdMzZSYH9MUT12J-mcOZgySuozDr_pBJzqjDCzXZRcofnA2nSA38apob04-PlpYyd5HHStGTb6CDPH7Bmf9fFsuAQjQ-L2L_LaaZUpwSG03JKvgeUR8cYbKMakqc';
          // const registrationToken = 'fYdQrpfFR_yh53bUc4HPwv:APA91bEl6THu1md-tswyHzM5KhFW8Ju2wAaM6WsREm_OourAmaX8708Ox3ask8amSLCZLrDVaikqdyqEIM5sWELho5AxI8UOQysIr8WVh1L4ID2EC_zAKSpTq1HcwVr9RqdcO-3lz8q_';
          const title = "iAccess Store";
          const body = `${userArr.firstName} has requested ${productDataArr[0].product_title} from ${storeArr.store_name}`;
          const req_id = ReqData.req_id.toString();
          const product_id = productDataArr[0].id.toString();

          const userRoom = `User${arg.user_id}`;
          const storeRoom = `Store${arg.store_id}`;

          console.log("RoomsInOnProduct:", storeRoom, userRoom);

          io.to(userRoom).emit("onProductResponse", data);
          io.to(storeRoom).emit("onAcceptFirstTime", forStoreData);
          const status = '1';

          console.log("registrationToken2:", registrationToken);

          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          );

        } else {

          console.log("HelloRequest");
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("qualityIsZero");

        }

      }).then(maxPrices => {
        // console.log(maxPrices);
      });

      //now emit send product and user information to store
    });
    // ----- End onProductRequest ----- //

    // ----- updateDriverArea ----- //
    async function updateDriverArea(d_id, p_id, r_id, u_id, s_id, v_id, d_price) {

      console.log("updateDriverArea::::", d_id, p_id, r_id, u_id, s_id, v_id, d_price);

      const getDriverId = await models.Driver.findOne(
        {
          where: {
            id: d_id,
          }
        }
      )

      const getFinalRequest = await models.finalRequestByUser.findOne(
        {
          where: {
            req_id: r_id,
            driver_id: d_id,
            status: 3
          }
        }
      )
      console.log("getFinalRequest::", getFinalRequest);

      if (getFinalRequest) {
        // console.log("getDriverIdIsAvailable---------------", getDriverId.isAvailable);
        const findDataInDriverQueue = await models.DriverQueues.findOne(
          {
            where: {
              driver_id: d_id,
              product_id: p_id,
              req_id: r_id
            }
          }
        )
        // console.log("findDataInDriverQueue::", findDataInDriverQueue);

        if (findDataInDriverQueue == null) {

          const createDriverQueue = await models.DriverQueues.create(
            {
              req_id: r_id,
              user_id: u_id,
              product_id: p_id,
              driver_id: d_id,
              store_id: s_id
            }
          )
          // console.log("createDriverQueue:", createDriverQueue);

        } else {

          const getAfterDriverCount = await models.DriverQueues.findOne(
            {
              where: {
                req_id: r_id,
                product_id: p_id,
                driver_id: d_id
              }
            }
          )
          // console.log("getAfterDriverCount::", getAfterDriverCount);

          if (getAfterDriverCount.driver_count >= 2) {

            const addRejectTable = await models.DriverRequestRejectData.create(
              {
                req_id: r_id,
                product_id: p_id,
                driver_id: d_id
              }
            )
            // console.log("addRejectTable:", addRejectTable);

            const deleteDriverQueueData = await models.sequelize.query(
              `
              DELETE FROM driverQueues WHERE req_id = ${r_id} AND driver_id = ${d_id}
              `
            )
            // console.log("deleteDriverQueueData:", deleteDriverQueueData);

          } else {

            const getDriverCount = await models.DriverQueues.findOne(
              {
                where: {
                  req_id: r_id,
                  product_id: p_id,
                  driver_id: d_id
                }
              }
            )
            // console.log("getDriverCount:", getDriverCount);

            let count = getDriverCount.driver_count + 1;

            const updateDriverCount = await models.DriverQueues.update(
              {
                driver_count: count
              },
              {
                where: {
                  req_id: r_id,
                  product_id: p_id,
                  driver_id: d_id
                }
              }
            )

          }

        }

        const getCountData = await models.DriverQueues.findOne(
          {
            where: {
              req_id: r_id,
              product_id: p_id,
              driver_id: d_id
            }
          }
        );

        var alertResponse;
        if (getCountData) {
          console.log("getCountData::", getCountData.driver_count);

          alertResponse = {
            driver_id: d_id,
            req_id: r_id,
            count: getCountData.driver_count
          }

        }



        const driverRoom = `Driver${d_id}`
        io.to(driverRoom).emit("driverAlertTime", alertResponse);

        // --- rejectedRequest ---
        const [userData] = await models.sequelize.query(
          `
          SELECT fcm_token FROM users WHERE id = ${u_id}
          `
        )

        const [storeData] = await models.sequelize.query(
          `
          SELECT store_address, store_lat, store_long FROM stores WHERE id = '${s_id}'
          `
        )

        if (v_id == 1) {

          // console.log("insides.........v_id....");

          var [getStoreLatLongDistance] = await models.sequelize.query(
            `
            SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count, driver_request_reject_datas.req_id, 
            ( 
              3959 * 
              acos(cos(radians(${storeData[0].store_lat})) *
              cos(radians(driver_lat)) *
              cos(radians(driver_long) - 
              radians(${storeData[0].store_long})) + 
              sin(radians(${storeData[0].store_lat})) * 
              sin(radians(driver_lat))) 
            )
            AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${r_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 AND drivers.vehicle = ${v_id} And drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${r_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY distance;
            `

          );

          const updateDriverData = await models.Driver.update(
            {
              isAvailable: 0
            },
            {
              where: {
                id: d_id
              }
            }
          )

          if (getStoreLatLongDistance.length == 0) {
            // console.log("getStoreLatLongLength-----------", getStoreLatLong.length);

            var [getStoreLatLongDistance] = await models.sequelize.query(
              `
              SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count, driver_request_reject_datas.req_id, 
                  ( 
                    3959 * 
                    acos(cos(radians(${storeData[0].store_lat})) *
                    cos(radians(driver_lat)) *
                    cos(radians(driver_long) - 
                    radians(${storeData[0].store_long})) + 
                    sin(radians(${storeData[0].store_lat})) * 
                    sin(radians(driver_lat))) 
                  )
                  AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${r_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 AND drivers.vehicle = ${v_id} And drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${r_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY distance;
              `
            )

          }

          var getLatLongArr = [];
          for (const getDriverData of getStoreLatLongDistance) {
            // console.log("getDriverData::", getDriverData.driver_count);
            if (getLatLongArr.length == 0) {

              getLatLongArr = getDriverData;

            } else {

              if (getDriverData.driver_count < getLatLongArr.driver_count) {

                getLatLongArr = getDriverData;

              }

            }

          }
          var getStoreLatLong = [];
          if (getLatLongArr.length != 0) {
            getStoreLatLong.push(getLatLongArr);
          }
          // console.log("getStoreLatLong::", getStoreLatLong);

          if (getStoreLatLong.length != 0) {
            d_id = getStoreLatLong[0].id
          }


        } else {

          var [getStoreLatLongDistance] = await models.sequelize.query(
            `
            SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                ( 
                  3959 * 
                  acos(cos(radians(${storeData[0].store_lat})) *
                  cos(radians(driver_lat)) *
                  cos(radians(driver_long) - 
                  radians(${storeData[0].store_long})) + 
                  sin(radians(${storeData[0].store_lat})) * 
                  sin(radians(driver_lat))) 
                )
                AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${r_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 AND drivers.vehicle = ${v_id} And drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${r_id}) GROUP BY drivers.id HAVING distance < 90 ORDER BY distance;
            `
          )

          const updateDriverData = await models.Driver.update(
            {
              isAvailable: 0
            },
            {
              where: {
                id: d_id
              }
            }
          )
          // console.log("updateDriverData:", updateDriverData);

          if (getStoreLatLongDistance.length == 0) {
            // console.log("getStoreLatLongLengthElsePart-----------", getStoreLatLongDistance.length);

            var [getStoreLatLongDistance] = await models.sequelize.query(
              `
              SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                  ( 
                    3959 * 
                    acos(cos(radians(${storeData[0].store_lat})) *
                    cos(radians(driver_lat)) *
                    cos(radians(driver_long) - 
                    radians(${storeData[0].store_long})) + 
                    sin(radians(${storeData[0].store_lat})) * 
                    sin(radians(driver_lat))) 
                  )
                  AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${r_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 AND drivers.vehicle = ${v_id} And drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${r_id}) GROUP BY drivers.id HAVING distance < 90 ORDER BY distance;
              `
            )

          }
          // console.log("beforeFor===========");
          var getLatLongArr = [];
          for (const getDriverData of getStoreLatLongDistance) {
            // console.log("getDriverData::", getDriverData.driver_count);
            if (getLatLongArr.length == 0) {

              getLatLongArr = getDriverData;

            } else {

              if (getDriverData.driver_count < getLatLongArr.driver_count) {

                getLatLongArr = getDriverData;

              }

            }

          }
          var getStoreLatLong = [];
          if (getLatLongArr.length != 0) {
            getStoreLatLong.push(getLatLongArr);
          }
          // console.log("getStoreLatLong::", getStoreLatLong);

          if (getStoreLatLong.length != 0) {
            d_id = getStoreLatLong[0].id;
            // console.log("d_id::::", d_id, getStoreLatLong[0].id);
          }

        }

        if (getStoreLatLong[0] == undefined) {
          // console.log("getStoreLatLong------", getStoreLatLong[0]);

          const updateFinalRequestByUser = await models.finalRequestByUser.update(
            {
              driver_id: null,
              driver_assigned: 0
            },
            {
              where: {
                req_id: r_id
              }
            }
          )

          const [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
            {
              status: 4
            },
            {
              where: {
                req_id: r_id
              }
            }
          )

          // ---------- createRequestQueue ---------- //
          const getLatLong = await models.Store.findOne(
            {
              where: {
                id: s_id
              }
            }
          )


          const getVehicleIdFromFinal = await models.finalRequestByUser.findOne(
            {
              where: {
                req_id: r_id,
                store_id: s_id,
                product_id: p_id,
              }
            }
          )

          const addDataToRequestTable = await models.requestQueue.create(
            {
              req_id: r_id,
              store_id: s_id,
              user_id: u_id,
              product_id: p_id,
              vehicle_id: getVehicleIdFromFinal.vehicle_id,
              store_lat: getLatLong.store_lat,
              store_long: getLatLong.store_long,
              start_timestamp: new Date(),
              end_timestamp: new Date(Date.now() + 60 * 60 * 2 * 1000)
            }
          )
          // ---------- End createRequestQueue --------- //

          // ---------- refundUserMoney ---------- //
          const getTransactionData = await models.Transaction.findOne(
            {
              where: {
                req_id: r_id,
                user_id: u_id,
                store_id: s_id,
                product_id: p_id,
              }
            }
          )

          const getTrasactionPrice = await models.Transaction.findOne(
            {
              where: {
                req_id: r_id
              }
            }
          )

          const insertRefundMoney = await models.Transaction.create(
            {
              req_id: r_id,
              status: 12,
              transactions: getTrasactionPrice.transactions,
              message: `${u_id}'s Money is Refund`
            }
          )
          // ---------- End refundUserMoney ---------- //

          // ---------- userWalletAmountUpdate ---------- //
          const getUserAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
            {
              where: {
                req_id: r_id
              }
            }
          )

          var price = 0;

          for (const processData of getUserAcceptData) {

            const getFinalRequestByUSerData = await models.finalRequestByUser.findOne(
              {
                where: {
                  req_id: processData.req_id,
                  store_id: processData.store_id
                }
              }
            )

            const getProductData = await models.StoreProduct.findOne(
              {
                where: {
                  id: processData.product_id
                }
              }
            )

            let totalProductAmount = parseFloat(getProductData.total_price);
            price = totalProductAmount + price

          }

          const total_amount = price + parseFloat(d_price);
          // console.log("total_amount::",total_amount);

          const getUserData = await models.User.findOne(
            {
              where: {
                id: getUserAcceptData[0].id
              }
            }
          )

          const userTotalAmount = parseFloat(getUserData.walletAmount) + total_amount;
          // console.log("userTotalAmount:::::::::", userTotalAmount);

          const updateUserWallet = await models.User.update(
            {
              walletAmount: userTotalAmount
            },
            {
              where: {
                id: getUserAcceptData[0].id
              }
            }
          )
          // ---------- End userWalletAmountUpdate ---------- //

          // ---------- qualityCutFromManageProductData ---------- //
          const getProductSize = await models.manageProductSize.findOne(
            {
              where: {
                product_id: p_id
              }
            }
          )
          // console.log("getProductSizeUPdateDriver::",getProductSize);
          // console.log("getProductSizeUpdateDriverQty::",getProductSize.qty);


          const updateQtyData = await models.manageProductSize.update(
            {
              qty: parseInt(getProductSize.qty) + 1
            },
            {
              where: {
                product_id: p_id
              }
            }
          )
          // ---------- End qualityCutFromManageProductData ---------- //

          const userRoom = `User${u_id}`;
          const registrationToken = userData[0].fcm_token;
          const title = "iAccess";
          const body = "There's no driver's available at the moment";
          const req_id = r_id.toString();
          const product_id = p_id.toString();
          const status = '1';

          io.to(userRoom).emit("noDriverFound", "Right Now No Driver Available In This Location");

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

        } else {

          const [driverResponse] = await models.sequelize.query(
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
              id = ${d_id}
            `
          )
          // console.log("d_idElsePart", d_id, getStoreLatLong[0].id);
          const driverRoom = `Driver${d_id}`;

          const [storeDataResponse] = await models.sequelize.query(
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
                  stores.id = ${s_id};
                `
          )
          // console.log("storeDataResponse::", storeDataResponse);

          const [productResponse] = await models.sequelize.query(
            `
                SELECT
                  product_title,
                  product_photo
                FROM
                  products
                WHERE
                  id = ${p_id}
                `
          )
          // console.log("productResponse::", productResponse);

          const [getDeliveryPrice] = await models.sequelize.query(
            `
            SELECT
              delivery_price,
              status,
              store_code,
              store_verify,
              user_code,
              user_verify,
              note_number,
              drop_location_address,
              note_desc
            FROM
              final_request_by_users
            WHERE
              req_id = ${r_id}
            `
          )
          // console.log("getDeliveryPrice:::", getDeliveryPrice);

          d_id = getStoreLatLong[0].id;
          // console.log("this..ids....", d_id);

          // ----- forProductData -----
          var requestProductDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
            {
              where: {
                user_id: u_id,
                store_id: s_id,
                req_id: r_id
              }
            }
          )
          // console.log("requestProductDataArr--", requestProductDataArr.length);

          const productDataMultiValueArr = [];
          for (const productDataArr of requestProductDataArr) {

            const [productDataValueArr] = await models.sequelize.query(
              `
              SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
              `
            )

            const [productGalleryDataArr] = await models.sequelize.query(
              `
              SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
              `
            )

            const productColorDataArr = [
              {
                "name": productDataArr.color,
                "code": productDataArr.color
              }
            ]

            const productSizeDataArr = [
              {
                "size": productDataArr.size
              }
            ]

            const responseProductData = {
              productData: productDataValueArr[0],
              productColor: productColorDataArr,
              productSize: productSizeDataArr,
              productGallery: productGalleryDataArr
            }
            productDataMultiValueArr.push(responseProductData)

          }
          // ---------- End forProductData ---------- //

          const totalDeliveryPrice = parseFloat(getDeliveryPrice[0].delivery_price) * 75 / 100;


          const response = {
            req_id: r_id,
            store_id: s_id,
            product_id: p_id,
            user_id: u_id,
            driver_id: d_id,
            store_name: storeDataResponse[0].store_name,
            store_phone: storeDataResponse[0].phone,
            store_logo: storeDataResponse[0].store_logo,
            store_address: storeDataResponse[0].store_address,
            delivery_address: getDeliveryPrice[0].drop_location_address,
            store_lat: storeDataResponse[0].store_lat,
            store_long: storeDataResponse[0].store_long,
            cat_name: storeDataResponse[0].cat_name,
            product_title: productResponse[0].product_title,
            product_img: productResponse[0].product_photo,
            driver_img: driverResponse[0].driver_img,
            driver_lat: driverResponse[0].driver_lat,
            driver_long: driverResponse[0].driver_long,
            delivery_price: totalDeliveryPrice.toString(),
            status: getDeliveryPrice[0].status,
            isAvailable: driverResponse[0].isAvailable,
            note_number: getDeliveryPrice[0].note_number,
            note_desc: getDeliveryPrice[0].note_desc,
            store_verify: getDeliveryPrice[0].store_verify,
            store_code: getDeliveryPrice[0].store_code,
            user_verify: getDeliveryPrice[0].user_verify,
            user_code: getDeliveryPrice[0].user_code,
            time: 90,
            productDetails: productDataMultiValueArr
          }
          // console.log("response:::::::::::", response);

          const registrationToken = driverResponse[0].fcm_token;
          const title = "iAccess Driver";
          const body = "New request available to fulfill GO online";
          const req_id = r_id.toString();
          const product_id = p_id.toString();
          const status = getDeliveryPrice[0].status.toString();

          io.to(driverRoom).emit("driverAssigned", response);

          const isAvailableUpdate = await models.Driver.update(
            {
              isAvailable: 2
            },
            {
              where: {
                id: d_id
              }
            }
          )

          const finalRequestByUser = await models.finalRequestByUser.update(
            {
              driver_id: d_id
            },
            {
              where: {
                req_id: r_id
              }
            }
          )

          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )
          // setTimeout(updateDriverAreaSecond, 90000, d_id, p_id, r_id, u_id, s_id, v_id, d_price)
          var timerId = ('' + r_id + d_id).toString();
          timeOut.push(timerId);
          timeOutMain.push(timerId);
          console.log("timerId2::", timerId, timeOutMain.length);
          timeOutMain[timeOutMain.length - 1] = setTimeout(async function () {
            const [driverResponse] = await models.sequelize.query(
              `
              SELECT 
                isAvailable
              FROM 
                drivers
              WHERE
                id = ${d_id}
              `
            )

            if (driverResponse[0].isAvailable == 2) {
              updateDriverArea(d_id, p_id, r_id, u_id, s_id, v_id, d_price)
            }
          }, 90000);

        }

      } else {
        console.log("not Found", d_id);
      }


    }
    // ----- End updateDriverArea ----- //

    // ----- onFinalRequestByUser ----- //
    socket.on("onFinalRequestByUser", async (arg) => {

      const userRoom = `User${arg.user_id}`;
      // console.log("userFirstroom:=>", userRoom);

      // console.log("reqId::", arg.req_id);

      // ----- updateQtyInManageProductSizetable ----- //

      const [getUserProductStoreAcceptes] = await models.sequelize.query(
        `
        SELECT * FROM users_product_store_accepteds WHERE req_id = ${arg.req_id}
        `
      );
      // console.log("getUserProductStoreAcceptes::", getUserProductStoreAcceptes);


      for (const getData of getUserProductStoreAcceptes) {

        const getProductSize = await models.manageProductSize.findOne(
          {
            where: {
              store_id: getData.store_id,
              product_id: getData.product_id,
              size: getData.size
            }
          }
        )
        // console.log("getProductSize::", getProductSize);

        const getProductQty = await models.StoreAttributesValuesMasters.findOne(
          {
            where: {
              attr_id: 2,
              store_id: getData.store_id,
              attr_name: getData.size
            }
          }
        )
        console.log("getProductQtyAttr::", getProductQty.attr_qty);

        if (getProductSize == null) {

          const insertSize = await models.manageProductSize.create({
            store_id: getData.store_id,
            product_id: getData.product_id,
            size: getData.size,
            qty: getProductQty.attr_qty - 1
          });
          // console.log("insertSize::", insertSize);

        } else {

          const updateQty = await models.manageProductSize.update(
            {
              qty: parseInt(getProductSize.qty) - 1
            },
            {
              where: {
                store_id: getData.store_id,
                product_id: getData.product_id
              }
            });
          // console.log("updateQty::", updateQty);

        }

      }
      // ----- End updateQtyInManageProductSizetable ----- //


      // ----- cutMoneyToUserAccount ----- //
      const getUserAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
        {
          where: {
            req_id: arg.req_id
          }
        }
      )
      // console.log("getUserAcceptData::", getUserAcceptData);

      var price = 0;

      for (const processData of getUserAcceptData) {

        const getProduct = await models.StoreProduct.findOne(
          {
            where: {
              id: processData.product_id
            }
          }
        );
        // console.log("getProduct::", getProduct);

        let totalPrice = parseFloat(getProduct.total_price);

        price = totalPrice + price;

        // console.log("productPrice:", getProduct.total_price);
        // console.log("totalPrice::", totalPrice);

      }

      const Total_price = price + parseFloat(arg.delivery_price)
      // console.log("Total_price:", Total_price);

      // ----- insertTransaction -----
      const getUserData = await models.User.findOne(
        {
          where: {
            id: arg.user_id
          }
        }
      )
      // console.log("getUserData::", getUserData.walletAmount);

      const getProductData = await models.StoreProduct.findOne(
        {
          where: {
            id: arg.product_id
          }
        }
      )
      // console.log("getProductData::", getProductData);

      const getStoreData = await models.Store.findOne(
        {
          where: {
            id: arg.store_id
          }
        }
      );
      // console.log("getStoreData::", getStoreData);

      const userAmount = parseFloat(getUserData.walletAmount) - Total_price;
      // console.log("userAmount::", userAmount);

      // console.log("data=====>:::;", arg.user_id, arg.product_id, arg.req_id, getProductData.regular_price, getProductData.extra_price, getProductData.total_price, Total_price, `${getUserData.firstName} had ordered ${getProductData.product_title} from ${getStoreData.store_name} and paid ${Total_price}`);

      const insertDataToTrasaction = await models.Transaction.create(
        {
          user_id: arg.user_id,
          store_id: null,
          product_id: arg.product_id,
          req_id: arg.req_id,
          product_price: getProductData.regular_price,
          extra_price: getProductData.extra_price,
          total_price: getProductData.total_price,
          message: `${getUserData.firstName} had ordered ${getProductData.product_title} from ${getStoreData.store_name} and paid ${Total_price}`,
          transactions: Total_price,
          type: 1,
        }
      );
      // console.log("insertDataToTrasaction::", insertDataToTrasaction);
      // ----- End insertTransaction -----

      const updateUserAmount = await models.User.update(
        {
          walletAmount: userAmount
        },
        {
          where: {
            id: arg.user_id
          }
        }
      )
      // ----- End cutMoneyToUserAccount ----- //

      var [storeData] = await models.sequelize.query(
        `
            SELECT 
              store_address, store_lat, store_long
            FROM
              stores
            WHERE
              id = "${arg.store_id}"
        `
      );
      // console.log("StoreData==>", storeData[0]);
      // console.log("arg::=>", arg);
      // console.log("storeData[0].store_address::=>", storeData[0].store_address);

      // --- create data by argData and Insert into finalRequestByUser --- //

      const getFinalRequestTable = await models.finalRequestByUser.findOne(
        {
          where: {
            req_id: arg.req_id
          }
        }
      );
      console.log("getFinalRequestTable::", getFinalRequestTable);

      if (getFinalRequestTable == null) {
        var finalRequestByUserData = await models.finalRequestByUser.create({
          req_id: arg.req_id,
          store_id: arg.store_id,
          user_id: arg.user_id,
          product_id: arg.product_id,
          selected_user_id: arg.selected_user_id,
          vehicle_id: arg.vehicle_id,
          drop_location_address: arg.drop_location_address,
          drop_location_lat: arg.drop_location_lat,
          drop_location_long: arg.drop_location_long,
          pickup_location_address: storeData[0].store_address,
          pickup_location_lat: storeData[0].store_lat,
          pickup_location_long: storeData[0].store_long,
          note_number: arg.note_number,
          note_desc: arg.note_desc,
          delivery_price: arg.delivery_price,
          status: 3
        });
      }


      // console.log("Create finalRequestByUserData::=>", finalRequestByUserData);

      // -- Get above record
      // console.log("finalRequestByUserGet::==>", finalRequestByUserGet);

      var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
        {
          status: 3
        },
        {
          where: {
            req_id: arg.req_id
          }
        }
      );

      // --- Displays data within 30km and 90km and find Driver --- //
      if (arg.vehicle_id == 1) {

        var [getStoreLatLong] = await models.sequelize.query(
          `
              SELECT
                stores.store_lat, stores.store_long, drivers.id, 
                ( 
                  3959 * 
                  acos(cos(radians(${storeData[0].store_lat})) *
                  cos(radians(driver_lat)) *
                  cos(radians(driver_long) - 
                  radians(${storeData[0].store_long})) + 
                  sin(radians(${storeData[0].store_lat})) * 
                  sin(radians(driver_lat))) 
                ) 
              AS
                distance
              FROM
                drivers
              JOIN
                stores
              WHERE
                store_name is not null
              AND
                drivers.status = 1
              AND
                drivers.isAvailable = 0
              AND
                drivers.vehicle = ${arg.vehicle_id}
              GROUP BY
                drivers.id 
              HAVING 
                distance < 30
              ORDER BY
                distance
              `

        );

      } else {

        var [getStoreLatLong] = await models.sequelize.query(
          `
              SELECT
                stores.store_lat, stores.store_long, drivers.id, 
                ( 
                  3959 * 
                  acos(cos(radians(${storeData[0].store_lat})) *
                  cos(radians(driver_lat)) *
                  cos(radians(driver_long) - 
                  radians(${storeData[0].store_long})) + 
                  sin(radians(${storeData[0].store_lat})) * 
                  sin(radians(driver_lat))) 
                )
              AS
                distance
              FROM
                drivers
              JOIN
                stores
              WHERE
                store_name is not null
              AND
                drivers.status = 1
              AND
                drivers.isAvailable = 0
              AND
                drivers.vehicle = ${arg.vehicle_id}
              GROUP BY
                drivers.id 
              HAVING 
                distance < 90
              ORDER BY
                distance
              `
        );
      }

      // console.log("getStoreLatLong---::", getStoreLatLong.id);

      const title = "iAccess";
      const body = "There's no driver's available at the moment";
      const req_id = arg.req_id.toString();
      const product_id = arg.product_id.toString();

      var [userResponse] = await models.sequelize.query(
        `
        SELECT 
          fcm_token
        FROM
          users
        WHERE
          id = ${arg.user_id}
        `
      );
      // console.log("userResponse:=", userResponse);

      if (getStoreLatLong[0] == undefined) {

        // -- update status when driver not responde
        var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
          {
            status: 4

          },
          {
            where: {
              req_id: arg.req_id
            }
          }
        );
        // console.log("updateAcceptedTable::", updateAcceptedTable);

        // ----- createRequestQueue ----- //

        const getLatLong = await models.Store.findOne(
          {
            where: {
              id: arg.store_id
            }
          }
        );
        // console.log("getLatLong::", getLatLong);

        const getVehicleIdFromFinal = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: arg.req_id,
              store_id: arg.store_id,
              product_id: arg.product_id,
            }
          }
        );
        // console.log("getVehicleIdFromFinal::", getVehicleIdFromFinal);

        var addDataToRequestTable = await models.requestQueue.create(
          {
            req_id: arg.req_id,
            store_id: arg.store_id,
            user_id: arg.user_id,
            product_id: arg.product_id,
            vehicle_id: getVehicleIdFromFinal.vehicle_id,
            store_lat: getLatLong.store_lat,
            store_long: getLatLong.store_long,
            start_timestamp: new Date(),
            end_timestamp: new Date(Date.now() + 60 * 60 * 2 * 1000)
          }
        );
        // console.log("addDataToRequestTable::", addDataToRequestTable);

        // ----- End createRequestQueue ----- //


        // ----- refundUserMoney ----- //
        // const getTransactionData = await models.Transaction.findOne(
        //   {
        //     where: {
        //       req_id: arg.req_id,
        //       user_id: arg.user_id,
        //       store_id: arg.store_id,
        //       product_id: arg.product_id
        //     }
        //   }
        // );
        // console.log("getTransactionData::", getTransactionData);

        // const getStoredata = await models.Store.findOne(
        //   {
        //     where: {
        //       id: arg.store_id
        //     }
        //   }
        // );
        // console.log("getStoredata::", getStoredata);

        // const getDriverData = await models.Driver.findOne(
        //   {
        //     where: {
        //       id: getTransactionData.driver_id
        //     }
        //   }
        // )
        // console.log("getDriverData::", getDriverData);


        // ----- userWalletAmountUpdate ----- //
        const getUserAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
          {
            where: {
              req_id: arg.req_id
            }
          }
        )
        // console.log("getUserAcceptData::", getUserAcceptData);

        var price = 0;

        for (const processData of getUserAcceptData) {

          const getFinalRequestByUSerData = await models.finalRequestByUser.findOne(
            {
              where: {
                req_id: processData.req_id,
                store_id: processData.store_id,
              }
            }
          )
          // console.log("getFinalRequestByUSerData:", getFinalRequestByUSerData);

          const getProductData = await models.StoreProduct.findOne(
            {
              where: {
                id: processData.product_id
              }
            }
          )
          // console.log("getProductData::", getProductData);

          let totalProductAmount = parseFloat(getProductData.total_price);
          price = totalProductAmount + price;

          // console.log("totalProductAmount::", totalProductAmount);

        }

        // console.log("Delievry...", parseFloat(arg.delivery_price));
        // console.log("arg.delivery_price::", arg.delivery_price);

        // console.log("price..", price);

        const Total_Amount = price + parseFloat(arg.delivery_price);
        // console.log("Total_Amount::", Total_Amount);

        const getUserData = await models.User.findOne(
          {
            where: {
              id: getUserAcceptData[0].user_id
            }
          }
        )
        // console.log("getUserData::", getUserData);

        const userTotalAmount = parseFloat(getUserData.walletAmount) + Total_Amount;
        // console.log("userTotalAmount::", userTotalAmount);

        const updateUserWallet = await models.User.update(
          {
            walletAmount: userTotalAmount
          },
          {
            where: {
              id: getUserAcceptData[0].user_id
            }
          }
        )
        // console.log("updateUserWallet::", updateUserWallet);

        // ----- userWalletAmountUpdate ----- //



        // const storeTotalAmt = parseFloat(getStoredata.wallet) - parseFloat(getTransactionData.product_price);
        // console.log("storeTotalAmt::", storeTotalAmt);

        // const driverTotalAmt = parseFloat(getDriverData.wallet) - parseFloat(getTransactionData.delivery_price);
        // console.log("driverTotalAmt::", driverTotalAmt);

        // const updateStoreTable = await models.Store.update(
        //   {
        //     wallet: storeTotalAmt
        //   },
        //   {
        //     where: {
        //       id: arg.store_id
        //     }
        //   }
        // );
        // console.log("updateStoreTable::", updateStoreTable);

        // const updateDriverTable = await models.Driver.update(
        //   {
        //     wallet: driverTotalAmt
        //   },
        //   {
        //     where: {
        //       id: getTransactionData.driver_id
        //     }
        //   }
        // );
        // console.log("updateDriverTable::", updateDriverTable);

        const getTrasactionPrice = await models.Transaction.findOne(
          {
            where: {
              req_id: arg.req_id
            }
          }
        )
        // console.log("getTrasactionPrice::", getTrasactionPrice);


        const insertRefundMoneyData = await models.Transaction.create(
          {
            req_id: arg.req_id,
            status: 12,
            transactions: getTrasactionPrice.transactions,
            message: `${arg.user_id}'s Money is Refund`
          }
        )
        // console.log("insertRefundMoneyData::", insertRefundMoneyData);
        // ----- End refundUserMoney ----- //

        // ----- qualityCutFromManageProductData ----- //

        const getProductSize = await models.manageProductSize.findOne(
          {
            where: {
              product_id: arg.product_id
            }
          }
        )

        const updateQtyData = await models.manageProductSize.update(
          {
            qty: parseInt(getProductSize.qty) + 1
          },
          {
            where: {
              product_id: arg.product_id
            }
          }
        )
        // console.log("updateQtyData::", updateQtyData);
        // ----- End qualityCutFromManageProductData ----- //


        // console.log("room:=>", userRoom);
        io.to(userRoom).emit("noDriverFound", "Right Now No Driver Available In This Location");
        let registrationToken = userResponse[0].fcm_token;
        const status = '1';

        // console.log("registrationToken3:", registrationToken);

        ayraFCM.sendPushNotificationFCM(
          registrationToken,
          title,
          body,
          req_id,
          product_id,
          status,
          true
        )
        return;
      }


      const driverRoom = `Driver${getStoreLatLong[0].id}`;

      var [driverResponse] = await models.sequelize.query(
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
              id = ${getStoreLatLong[0].id}
            `
      );
      // console.log("driverResponse:=>", driverResponse);




      // -- UpdateDriverAvailability
      // var [updateDriverAvailability] = await models.Driver.update(
      //   {
      //     isAvailable: 1
      //   },
      //   {
      //     where: {
      //       id: getStoreLatLong[0].id
      //     }
      //   }
      // );
      // console.log("updateDriverAvailability==>", updateDriverAvailability);

      // -- Update driver details in finalRequestByUser table
      // var [updateFinalRequestByUserTable] = await models.finalRequestByUser.update(
      //   {
      //     driver_assigned: 1,
      //     driver_id: getStoreLatLong[0].id,
      //     status: 5
      //   },
      //   {
      //     where: {
      //       id: finalRequestByUserGet.id
      //     }
      //   }
      // );
      // console.log("updateFinalRequestByUserTable::", updateFinalRequestByUserTable);

      // -- Update UserProductItemRequetAcceptedStore table
      // var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
      //   {
      //     status: 5
      //   },
      //   {
      //     where: {
      //       req_id: arg.req_id
      //     }
      //   }
      // )


      var [storeDataResponse] = await models.sequelize.query(
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
              stores.id = ${arg.store_id};
            `
      );
      // console.log("storeDataResponse::=>", storeDataResponse);

      var [productResponse] = await models.sequelize.query(
        `
            SELECT
              product_title,
              product_photo
            FROM
              products
            WHERE
              id = ${arg.product_id}
            `
      );
      // console.log("productResponse:=>", productResponse);

      var [getStatusByReq] = await models.sequelize.query(
        `
        SELECT
          status,
          store_code,
          store_verify,
          user_code,
          user_verify,
          drop_location_address,
          note_number,
          note_desc
        FROM
          final_request_by_users
        WHERE
          req_id = ${arg.req_id}
        `
      );
      // console.log("getStatusByReq:", getStatusByReq);

      // console.log("store_verify:", getStatusByReq[0].store_verify);

      // ----- forProductData -----
      var requestProductDataArr = await models.UserProductItemRequetAcceptedStore.findAll({
        where: {
          user_id: arg.user_id,
          store_id: arg.store_id,
          req_id: arg.req_id,
        }
      }
      );
      // console.log("requestProductDataArr::", requestProductDataArr);

      const productDataMultiValueArr = [];
      for (const productDataArr of requestProductDataArr) {

        var [productDataValueArr] = await models.sequelize.query(
          `
          SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
          `
        );

        // var [productColorSizeDataArr] = await models.sequelize.query(
        //   `
        //   SELECT color, size FROM users_product_add_to_carts WHERE user_id = ${arg.user_id} AND product_id = ${productDataArr.product_id}
        //   `
        // );

        var [productGalleryDataArr] = await models.sequelize.query(
          `
          SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
          `
        );

        const responseProductColorData = [
          {
            "name": productDataArr.color,
            "code": productDataArr.color
          }
        ]

        const responseProductSizeData = [
          {
            "size": productDataArr.size
          }
        ]

        const responseProductData = {
          productData: productDataValueArr[0],
          productColor: responseProductColorData,
          productSize: responseProductSizeData,
          productGallery: productGalleryDataArr
        }
        productDataMultiValueArr.push(responseProductData)
      }
      // ----- End forProductData -----


      // ----- deliveryPriceCaculation ----- //
      const totalDeliveryPrice = parseFloat(arg.delivery_price) * 75 / 100;
      // console.log("totalDeliveryPrice::", totalDeliveryPrice);
      // ----- End deliveryPriceCaculation ----- //


      const responseData = {
        req_id: arg.req_id,
        store_id: arg.store_id,
        product_id: arg.product_id,
        user_id: arg.user_id,
        driver_id: getStoreLatLong[0].id,
        store_name: storeDataResponse[0].store_name,
        store_phone: storeDataResponse[0].phone,
        store_logo: storeDataResponse[0].store_logo,
        store_address: storeDataResponse[0].store_address,
        delivery_address: getStatusByReq[0].drop_location_address,
        store_lat: storeDataResponse[0].store_lat,
        store_long: storeDataResponse[0].store_long,
        cat_name: storeDataResponse[0].cat_name,
        product_title: productResponse[0].product_title,
        product_img: productResponse[0].product_photo,
        driver_img: driverResponse[0].driver_img,
        driver_lat: driverResponse[0].driver_lat,
        driver_long: driverResponse[0].driver_long,
        delivery_price: totalDeliveryPrice.toString(),
        status: getStatusByReq[0].status,
        isAvailable: driverResponse[0].isAvailable,
        note_number: getStatusByReq[0].note_number,
        note_desc: getStatusByReq[0].note_desc,
        store_verify: getStatusByReq[0].store_verify,
        store_code: getStatusByReq[0].store_code,
        user_verify: getStatusByReq[0].user_verify,
        user_code: getStatusByReq[0].user_code,
        time: 90,
        productDetails: productDataMultiValueArr
      }


      // console.log("User${arg.user_id}", `User${arg.user_id}`);
      // console.log("arg.user_id:", arg.user_id);

      // console.log("driverRoom", driverRoom);
      // console.log("responseData:=", driverResponse);



      if (driverResponse) {

        const title = "iAccess Driver";
        const body = "New request available to fulfill GO online";

        // console.log("driverAssign");
        let registrationToken = driverResponse[0].fcm_token;

        // console.log("sendNotificationFCM:=", registrationToken, title, body, req_id, product_id);

        io.to(driverRoom).emit("driverAssigned", responseData);

        const status = '1';

        // console.log("registrationToken4:", registrationToken);

        ayraFCM.sendPushNotificationFCM(
          registrationToken,
          title,
          body,
          req_id,
          product_id,
          status,
          true
        );

        const updateDriverStatus = await models.Driver.update(
          {
            isAvailable: 2
          },
          {
            where: {
              id: getStoreLatLong[0].id
            }
          }
        );
        // console.log("UpdateData::", updateDriverStatus);

        const finalRequestByUser = await models.finalRequestByUser.update(
          {
            driver_id: getStoreLatLong[0].id
          },
          {
            where: {
              req_id: arg.req_id
            }
          }
        );

        const getDriverTimeStamp = await models.finalRequestByUser.findOne(
          {
            where: {
              driver_id: getStoreLatLong[0].id
            }
          }
        );

        const getDriverId = await models.Driver.findOne(
          {
            where: {
              id: getStoreLatLong[0].id
            }
          }
        );
        // console.log("getDriverIdBeforeFunction::", getDriverId);

        var d_id = getStoreLatLong[0].id;


        // --- updateDriverAvailablity ---
        // console.log("BeforeFunction1");

        async function updateDriverOnFinal(d_id, p_id, r_id, u_id, s_id, v_id, d_price) {

          console.log("updateDriverOnFinal::::", d_id, p_id, r_id, u_id, s_id, v_id, d_price);
          updateDriverArea(d_id, p_id, r_id, u_id, s_id, v_id, d_price)

        }
        var timerId = ('' + arg.req_id + d_id).toString();
        timeOut.push(timerId);
        timeOutMain.push(timerId);
        console.log("timerId3::", timerId, timeOutMain.length, timeOut);
        timeOutMain[timeOutMain.length - 1] = setTimeout(updateDriverOnFinal, 90000, d_id, arg.product_id, arg.req_id, arg.user_id, arg.store_id, arg.vehicle_id, arg.delivery_price)

        // console.log("AfterFunction1");

        // let registrationToken = userResponse.fcm_token;
        // ayraFCM.sendPushNotificationFCM(
        //   registrationToken,
        //   title,
        //   body,
        //   req_id,
        //   product_id,
        //   true
        // )
      }
      // else {
      // console.log("room:=>",userRoom);
      // io.to(userRoom).emit("noDriverFound", "Right Now No Driver Available In This Location");
      // }

    });
    // ----- End onFinalRequestByUser ----- //


    // ----- finalRequestByUserMultiple ----- //
    socket.on("finalRequestByUserMultiple", async (arg) => {

      var requestProductDataArr = await models.UserAddTCart.findAll(
        {
          attributes: ["store_id", "color", "size"],
          where: {
            user_id: arg.user_id
          },
          order: [["id", "DESC"]],
          group: ["store_id"],
        }
      );

      for (const productDataArr of requestProductDataArr) {
        var requestProductArr = await models.UserAddTCart.findAll({
          where: {
            store_id: productDataArr.store_id,
            user_id: arg.user_id
          }
        });
        // console.log("requestProductArr::", requestProductArr);

        const productDataMultiValueArr = [];
        for (const productArr of requestProductArr) {

          var [productDataValueArr] = await models.sequelize.query(
            `
            SELECT t2.store_name,t2.store_photo , t1.* FROM  products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id="${productArr.store_id}" AND t1.id=${productArr.product_id}
            `
          );

          var [productColorDataArr] = await models.sequelize.query(
            `
            SELECT color, size FROM users_product_add_to_carts WHERE user_id = ${arg.user_id} AND product_id = ${productArr.product_id}
            `
          );

          var [productGalleryArr] = await models.sequelize.query(
            `
            SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productArr.store_id} AND product_id=${productArr.product_id} AND isActive = 1
            `
          );

          const responseProductColorData = [
            {
              "name": productColorArr[0].color,
              "code": productColorArr[0].color
            }
          ]

          const responseProductSizeData = [
            {
              "size": productColorArr[0].size
            }
          ]

          const responseProductData = {
            productData: productDataValueArr[0],
            productColor: responseProductColorData,
            productSize: responseProductSizeData,
            productGallery: productGalleryArr
          }
          productDataMultiValueArr.push(responseProductData);

          const userRoom = `User${arg.user_id}`
          io.to(userRoom).emit("productData", productDataMultiValueArr);

        }

      }

    });
    // ----- End finalRequestByUserMultiple ----- //


    // ----- driverAcceptReject ----- //
    socket.on("driverAcceptReject", async (arg) => {

      var clearTime = ('' + arg.req_id + arg.driver_id).toString();
      // console.log("clearTime::", clearTime);
      // console.log("timeOut.length:::::", timeOut.length);
      var ind = -1;
      for (var i = 0; i < timeOut.length; i++) {
        // console.log("timeOut[i]::", timeOut[i]);
        if (timeOut[i] == clearTime) {
          // console.log("timeOutMain[i]::", timeOutMain[i]);
          clearTimeout(timeOutMain[i]);
          ind = i
          // delete timeOutMain[i];
          // delete timeOut[i];
        }
      }
      if (ind != -1) {
        timeOutMain.splice(ind, 1);
        timeOut.splice(ind, 1);
      }

      // console.log("arg::", arg);
      if (arg.status == 1) {

        const getRequestQueueData = await models.requestQueue.findOne(
          {
            where: {
              req_id: arg.req_id
            }
          }
        );
        console.log("getRequestQueueData", getRequestQueueData);

        if (getRequestQueueData) {

          // ----------------------- +++++++ -----------------------------
          // console.log("getRequestQueueData", getRequestQueueData);

          const storeTimingData = await models.StoreTiming.findOne(
            {
              where: {
                store_id: getRequestQueueData.store_id
              }
            }
          );
          // console.log("storeTimingData", storeTimingData);

          function getCurrentTime() {
            const daysOfWeek = ["sun_open_timing", "mon_open_timing", "tue_open_timing", "wed_open_timing", "thurs_open_timing", "fri_open_timing", "sat_open_timing"];
            const currentDate = new Date();
            console.log("currentDate", currentDate);

            const dayOfWeek = currentDate.getDay();
            const dayName = daysOfWeek[dayOfWeek];

            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

            const currentTime = `${dayName} ${formattedHours}:${formattedMinutes}${ampm}`;

            return currentTime;
          }

          const currentTime = getCurrentTime();
          const splitTime = currentTime.split(" ");
          console.log("splitTime[1]:", splitTime[1]);
          console.log("Current Time:", currentTime);

          const property = splitTime[0];
          const dbTime = storeTimingData.dataValues[property]
          console.log("dbTime", dbTime);

          let isInRange;
          if(dbTime == "24 hours") {
            isInRange = true
          } else {
            const splitDbTime = dbTime.split(" ")
            console.log("splitDbTime", splitDbTime);
  
            function isTimeInRange(time) {
              console.log("time=========", time);
              const startTime = splitDbTime[0];
              const endTime = splitDbTime[2];
  
              // Convert time strings to 24-hour format
              const startTime24 = convertTo24HourFormat(startTime);
              const endTime24 = convertTo24HourFormat(endTime);
              const timeToCheck24 = convertTo24HourFormat(time);
  
              // Perform the comparison
              return timeToCheck24 >= startTime24 && timeToCheck24 <= endTime24;
            }
  
            function convertTo24HourFormat(time) {
              // const [hour, minute] = time.slice(0, -2).split(":");
              // const meridiem = time.slice(-2);
  
              const [hour, minute, meridiem] = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/).slice(1);
  
              let hour24 = parseInt(hour);
  
              if (meridiem === "PM" && hour !== "12") {
                hour24 += 12;
              } else if (meridiem === "AM" && hour === "12") {
                hour24 = 0;
              }
  
              return `${hour24.toString().padStart(2, "0")}:${minute}`;
            }
  
            // Usage example 
            const timeToCheck = splitTime[1];
            isInRange = isTimeInRange(timeToCheck);
          }
          
          console.log(isInRange); // true or false

          const splitTimeForStatus = currentTime.split("_");
          const status_data = `${splitTimeForStatus[0]}_${splitTimeForStatus[1]}`
          console.log("status_data", status_data);
          const dbStatus = storeTimingData.dataValues[status_data]
          console.log("dbStatus", dbStatus);
          if (dbStatus == 0) {

            console.log("Store Closed - status : 0");
            const driverRoom = `Driver${arg.driver_id}`;
            console.log("emit::storeCloseRequest-------------->> 1");
            io.to(driverRoom).emit("storeCloseRequest", "Store Closed");

          } else {

            if (isInRange == false) {

              console.log("Store Closed");
              const driverRoom = `Driver${arg.driver_id}`;
              console.log("emit::storeCloseRequest-------------->> 2");
              io.to(driverRoom).emit("storeCloseRequest", "Store Closed");

            } else {

              const deleteRequest = await models.sequelize.query(
                `
              DELETE FROM requestQueues WHERE req_id = ${arg.req_id};
              `
              )

              // ----------------------- +++++++ -----------------------------

              const getDeliveryPriceData = await models.finalRequestByUser.findOne(
                {
                  where: {
                    req_id: arg.req_id,
                    store_id: arg.store_id,
                    product_id: arg.product_id
                  }
                }
              );
              console.log("getDeliveryPriceData:;", getDeliveryPriceData);

              const getDriverData = await models.Driver.findOne(
                {
                  where: {
                    id: arg.driver_id
                  }
                }
              );
              console.log("getDriverData::", getDriverData);

              if (getDriverData == null) {
              } else {

                var totalDriverAmt = parseFloat(getDriverData.wallet) + parseFloat(getDeliveryPriceData.delivery_price);
                console.log("totalDriverAmt:", totalDriverAmt);

                var deliveryPrice = parseFloat(getDeliveryPriceData.delivery_price);
                console.log('deliveryPrice:::------>', deliveryPrice);
                // const adminAmount = deliveryPrice * 25 / 100;
                var driverAmount = deliveryPrice * 75 / 100;

              }

              const getProductData = await models.StoreProduct.findOne(
                {
                  where: {
                    id: arg.product_id,
                  }
                }
              )
              console.log("getProductData::", getProductData);

              console.log("come---here-------------");

              const updateTransaction = await models.Transaction.update(
                {
                  admin_amount: getProductData.extra_price,
                },
                {
                  where: {
                    req_id: arg.req_id
                  }
                }
              );
              console.log('updateTransaction::---------------', updateTransaction);

              const insertAdminAmount = await models.adminAmount.create(
                {
                  req_id: arg.req_id,
                  type: 1,
                  product_id: arg.product_id,
                  admin_amount: getProductData.extra_price,
                  comment: "Product Revenue",
                }
              )
              console.log("insertAdminAmount::-------------", insertAdminAmount);
              // ----- addMoneyInDriverTable -----

              // ----- insertTransactionDataByreq_id -----
              console.log("driverAmount:::;;;;;;;;;", driverAmount);
              const insertTrasactionData = await models.Transaction.update(
                {
                  driver_id: arg.driver_id,
                  delivery_price: driverAmount
                },
                {
                  where: {
                    req_id: arg.req_id
                  }
                }
              );
              console.log("insertTrasactionData::---------------->", insertTrasactionData);

              const userRoom = `User${arg.user_id}`;

              var [userResponse] = await models.sequelize.query(
                `
                  SELECT 
                    fcm_token
                  FROM
                    users
                  WHERE
                    id = ${arg.user_id}
                  `
              )

              console.log("--------------------------", userResponse);
              // -- UpdateDriverAvailability
              var [updateDriverAvailability] = await models.Driver.update(
                {
                  isAvailable: 1
                },
                {
                  where: {
                    id: arg.driver_id
                  }
                }
              );
              // console.log("updateDriverAvailability==>", updateDriverAvailability);

              // -- Update driver details in finalRequestByUser table
              var [updateFinalRequestByUserTable] = await models.finalRequestByUser.update(
                {
                  driver_assigned: 1,
                  driver_id: arg.driver_id,
                  status: 5
                },
                {
                  where: {
                    req_id: arg.req_id
                  }
                }
              );
              // console.log("updateFinalRequestByUserTable::", updateFinalRequestByUserTable);

              // -- Update UserProductItemRequetAcceptedStore table
              var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
                {
                  status: 5
                },
                {
                  where: {
                    req_id: arg.req_id
                  }
                }
              );

              // const [getStoreLatLong] = await models.sequelize.query(
              //   `
              //   SELECT stores.store_lat, stores.store_long, drivers.id,driver_request_reject_datas.req_id, 
              //   ( 
              //     3959 * 
              //     acos(cos(radians(${storeData[0].store_lat})) *
              //     cos(radians(driver_lat)) *
              //     cos(radians(driver_long) - Store${arg.store_id}vers.id = driver_request_reject_datas.driver_id WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30;
              //   `
              // );

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
                    id = ${arg.driver_id}
              `
              );
              // console.log("driverResponse:=>", driverResponse);

              const [storeDataResponse] = await models.sequelize.query(
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
                    stores.id = ${arg.store_id};
                  `
              );
              // console.log("storeDataResponse::=>", storeDataResponse);

              const [productResponse] = await models.sequelize.query(
                `
                  SELECT
                    product_title,
                    product_photo
                  FROM
                    products
                  WHERE
                    id = ${arg.product_id}
                  `
              );
              // console.log("productResponse:=>", productResponse);

              const [getDeliveryPrice] = await models.sequelize.query(
                `
              SELECT
                delivery_price,
                selected_user_id,
                drop_location_address,
                drop_location_lat,
                drop_location_long
              FROM
                final_request_by_users
              WHERE
                req_id = ${arg.req_id}
              `
              );
              // console.log("addDataToRequestTable::=", getDeliveryPrice);
              // console.log("addDataToRequestTable::=", getDeliveryPrice[0].selected_user_id);

              const [getUserData] = await models.sequelize.query(
                `
              SELECT
                avatar
              FROM
                users
              WHERE
                id = ${getDeliveryPrice[0].selected_user_id}
              `
              )
              // console.log("getUserData::=", getUserData);
              // console.log("getUserData::=", getUserData[0].avatar);

              const [getColorAndSizeStatus] = await models.sequelize.query(
                `
              SELECT
                color,
                size,
                status
              FROM
                users_product_store_accepteds
              WHERE
                product_id = ${arg.product_id}
              `
              )
              // console.log("getColorAndSizeStatus:", getColorAndSizeStatus);

              // ----- forProductData -----
              var requestDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
                {
                  where: {
                    user_id: arg.user_id,
                    store_id: arg.store_id,
                    req_id: arg.req_id
                  }
                }
              );
              // console.log("requestDataArr::", requestDataArr);

              const productMultipleDataArr = [];
              for (const productDataArr of requestDataArr) {

                // console.log("productDataArr:!:", productDataArr);

                var [productDataValueArr] = await models.sequelize.query(
                  `
                SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
                `
                );

                // var [productColorSizeDataArr] = await models.sequelize.query(
                //   `
                //   SELECT color, size FROM users_product_add_to_carts WHERE user_id = ${arg.user_id} AND product_id = ${productDataArr.product_id}
                //   `
                // );

                var [productGalleryDataArr] = await models.sequelize.query(
                  `
                SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
                `
                );

                // console.log("productDataArr.color::", productDataArr.color);

                const respProductColorData = [
                  {
                    "name": productDataArr.color,
                    "code": productDataArr.color
                  }
                ]

                const responseProductSizeData = [
                  {
                    "size": productDataArr.size
                  }
                ]

                const responseProductData = {
                  productData: productDataValueArr[0],
                  productColor: respProductColorData,
                  productSize: responseProductSizeData,
                  productGallery: productGalleryDataArr
                }
                productMultipleDataArr.push(responseProductData)
              }

              // ----- End forProductData -----

              const responseData = {
                req_id: arg.req_id,
                store_id: arg.store_id,
                product_id: arg.product_id,
                user_id: arg.user_id,
                driver_id: arg.driver_id,
                store_phone: storeDataResponse[0].phone,
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
                status: getColorAndSizeStatus[0].status,
                productDetails: productMultipleDataArr

                // store_name: storeDataResponse[0].store_name,
                // store_address: storeDataResponse[0].store_address,
                // cat_name: storeDataResponse[0].cat_name,
                // product_title: productResponse[0].product_title,
                // product_img: productResponse[0].product_photo,
                // delivery_price: getDeliveryPrice[0].delivery_price
              };
              // console.log("responseData:-latest", responseData);
              console.log("storeDataResponse[0].store_name::---", storeDataResponse[0].store_name);

              var registrationToken = userResponse[0].fcm_token;
              var title = "iAccess";
              var body = `${driverResponse[0].firstName} is in route to ${storeDataResponse[0].store_name}`;
              var req_id = arg.req_id.toString();
              var product_id = arg.product_id.toString();
              var status = `${getColorAndSizeStatus[0].status}`;
              console.log("emit::getDriverAssignToUser-------------->> 3");
              io.to(userRoom).emit("getDriverAssignToUser", responseData);

              const storeRoom = `Store${arg.store_id}`;
              console.log("emit::driverAcceptRequestStore-------------->> 4");
              io.to(storeRoom).emit("driverAcceptRequestStore", responseData);
              // console.log("acceptedOnDriverAccept-----", arg.req_id, arg.product_id, arg.driver_id);
              // console.log("registrationToken7:", registrationToken);
              ayraFCM.sendPushNotificationFCM(
                registrationToken,
                title,
                body,
                req_id,
                product_id,
                status,
                true
              )


              // ----- forNotificationToStore ----- //

              const getStoreData = await models.Store.findOne(
                {
                  where: {
                    id: arg.store_id
                  }
                }
              )

              if (getStoreData) {
                const registrationToken = getStoreData.fcm_token;
                var title = "iAccess Store";
                var body = `${driverResponse[0].firstName} is in route to ${storeDataResponse[0].store_name}`;
                const req_id = arg.req_id.toString();
                const product_id = arg.product_id.toString();
                const status = `${getColorAndSizeStatus[0].status}`;
                console.log("emit::getDriverAssignToUser-------------->> 5");
                io.to(userRoom).emit("getDriverAssignToUser", responseData);

                const storeRoom = `Store${arg.store_id}`;
                console.log("emit::driverAcceptRequestStore-------------->> 6");
                io.to(storeRoom).emit("driverAcceptRequestStore", responseData);

                // console.log("registrationToken8:", registrationToken);
                ayraFCM.sendPushNotificationFCM(
                  registrationToken,
                  title,
                  body,
                  req_id,
                  product_id,
                  status,
                  true
                )
              }

              // ----- End forNotificationToStore ----- //
            }

          }

          // ----------------------------------------------------

          // const deleteRequest = await models.sequelize.query(
          //   `
          //   DELETE FROM requestQueues WHERE req_id = ${arg.req_id};
          //   `
          // )

        } else {

          const getDeliveryPriceData = await models.finalRequestByUser.findOne(
            {
              where: {
                req_id: arg.req_id,
                store_id: arg.store_id,
                product_id: arg.product_id
              }
            }
          );
          console.log("getDeliveryPriceData:;", getDeliveryPriceData);

          const getDriverData = await models.Driver.findOne(
            {
              where: {
                id: arg.driver_id
              }
            }
          );
          console.log("getDriverData::", getDriverData);

          const totalDriverAmt = parseFloat(getDriverData.wallet) + parseFloat(getDeliveryPriceData.delivery_price);
          console.log("totalDriverAmt:", totalDriverAmt);

          const deliveryPrice = parseFloat(getDeliveryPriceData.delivery_price);
          // const adminAmount = deliveryPrice * 25 / 100;
          const driverAmount = deliveryPrice * 75 / 100;

          const getProductData = await models.StoreProduct.findOne(
            {
              where: {
                id: arg.product_id,
              }
            }
          )
          console.log("getProductData::", getProductData);

          console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-');

          const updateTransaction = await models.Transaction.update(
            {
              admin_amount: getProductData.extra_price,
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          );
          console.log("updateTransaction::", updateTransaction);

          const insertAdminAmount = await models.adminAmount.create(
            {
              req_id: arg.req_id,
              type: 1,
              product_id: arg.product_id,
              admin_amount: getProductData.extra_price,
              comment: "Product Revenue",
            }
          );
          console.log("insertAdminAmount::", insertAdminAmount);
          // console.log("insertAdminAmount::", insertAdminAmount);
          // ----- addMoneyInDriverTable -----

          // ----- insertTransactionDataByreq_id -----
          const insertTrasactionData = await models.Transaction.update(
            {
              driver_id: arg.driver_id,
              delivery_price: driverAmount
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          );
          // console.log("insertTrasactionData::", insertTrasactionData);

          const userRoom = `User${arg.user_id}`;

          var [userResponse] = await models.sequelize.query(
            `
              SELECT 
                fcm_token
              FROM
                users
              WHERE
                id = ${arg.user_id}
              `
          )

          // -- UpdateDriverAvailability
          var [updateDriverAvailability] = await models.Driver.update(
            {
              isAvailable: 1
            },
            {
              where: {
                id: arg.driver_id
              }
            }
          );
          // console.log("updateDriverAvailability==>", updateDriverAvailability);

          // -- Update driver details in finalRequestByUser table
          var [updateFinalRequestByUserTable] = await models.finalRequestByUser.update(
            {
              driver_assigned: 1,
              driver_id: arg.driver_id,
              status: 5
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          );
          // console.log("updateFinalRequestByUserTable::", updateFinalRequestByUserTable);

          // -- Update UserProductItemRequetAcceptedStore table
          var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
            {
              status: 5
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          );

          // const [getStoreLatLong] = await models.sequelize.query(
          //   `
          //   SELECT stores.store_lat, stores.store_long, drivers.id,driver_request_reject_datas.req_id, 
          //   ( 
          //     3959 * 
          //     acos(cos(radians(${storeData[0].store_lat})) *
          //     cos(radians(driver_lat)) *
          //     cos(radians(driver_long) - Store${arg.store_id}vers.id = driver_request_reject_datas.driver_id WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30;
          //   `
          // );

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
                id = ${arg.driver_id}
          `
          );
          // console.log("driverResponse:=>", driverResponse);

          const [storeDataResponse] = await models.sequelize.query(
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
                stores.id = ${arg.store_id};
              `
          );
          // console.log("storeDataResponse::=>", storeDataResponse);

          const [productResponse] = await models.sequelize.query(
            `
              SELECT
                product_title,
                product_photo
              FROM
                products
              WHERE
                id = ${arg.product_id}
              `
          );
          // console.log("productResponse:=>", productResponse);

          const [getDeliveryPrice] = await models.sequelize.query(
            `
          SELECT
            delivery_price,
            selected_user_id,
            drop_location_address,
            drop_location_lat,
            drop_location_long
          FROM
            final_request_by_users
          WHERE
            req_id = ${arg.req_id}
          `
          );
          // console.log("addDataToRequestTable::=", getDeliveryPrice);
          // console.log("addDataToRequestTable::=", getDeliveryPrice[0].selected_user_id);

          const [getUserData] = await models.sequelize.query(
            `
          SELECT
            avatar
          FROM
            users
          WHERE
            id = ${getDeliveryPrice[0].selected_user_id}
          `
          )
          // console.log("getUserData::=", getUserData);
          // console.log("getUserData::=", getUserData[0].avatar);

          const [getColorAndSizeStatus] = await models.sequelize.query(
            `
          SELECT
            color,
            size,
            status
          FROM
            users_product_store_accepteds
          WHERE
            product_id = ${arg.product_id}
          `
          )
          // console.log("getColorAndSizeStatus:", getColorAndSizeStatus);

          // ----- forProductData -----
          var requestDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
            {
              where: {
                user_id: arg.user_id,
                store_id: arg.store_id,
                req_id: arg.req_id
              }
            }
          );
          // console.log("requestDataArr::", requestDataArr);

          const productMultipleDataArr = [];
          for (const productDataArr of requestDataArr) {

            // console.log("productDataArr:!:", productDataArr);

            var [productDataValueArr] = await models.sequelize.query(
              `
            SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
            `
            );

            // var [productColorSizeDataArr] = await models.sequelize.query(
            //   `
            //   SELECT color, size FROM users_product_add_to_carts WHERE user_id = ${arg.user_id} AND product_id = ${productDataArr.product_id}
            //   `
            // );

            var [productGalleryDataArr] = await models.sequelize.query(
              `
            SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
            `
            );

            // console.log("productDataArr.color::", productDataArr.color);

            const respProductColorData = [
              {
                "name": productDataArr.color,
                "code": productDataArr.color
              }
            ]

            const responseProductSizeData = [
              {
                "size": productDataArr.size
              }
            ]

            const responseProductData = {
              productData: productDataValueArr[0],
              productColor: respProductColorData,
              productSize: responseProductSizeData,
              productGallery: productGalleryDataArr
            }
            productMultipleDataArr.push(responseProductData)
          }

          // ----- End forProductData -----

          const responseData = {
            req_id: arg.req_id,
            store_id: arg.store_id,
            product_id: arg.product_id,
            user_id: arg.user_id,
            driver_id: arg.driver_id,
            store_phone: storeDataResponse[0].phone,
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
            status: getColorAndSizeStatus[0].status,
            productDetails: productMultipleDataArr

            // store_name: storeDataResponse[0].store_name,
            // store_address: storeDataResponse[0].store_address,
            // cat_name: storeDataResponse[0].cat_name,
            // product_title: productResponse[0].product_title,
            // product_img: productResponse[0].product_photo,
            // delivery_price: getDeliveryPrice[0].delivery_price
          };
          // console.log("responseData:-latest", responseData);
          // console.log("storeDataResponse[0].store_name::", storeDataResponse[0].store_name);

          var registrationToken = userResponse[0].fcm_token;
          var title = "iAccess";
          var body = `${driverResponse[0].firstName} is in route to ${storeDataResponse[0].store_name}`;
          var req_id = arg.req_id.toString();
          var product_id = arg.product_id.toString();
          var status = `${getColorAndSizeStatus[0].status}`;
          console.log("emit::getDriverAssignToUser-------------->> 7");
          io.to(userRoom).emit("getDriverAssignToUser", responseData);

          const storeRoom = `Store${arg.store_id}`;
          console.log("emit::driverAcceptRequestStore-------------->> 8");
          io.to(storeRoom).emit("driverAcceptRequestStore", responseData);
          // console.log("acceptedOnDriverAccept-----", arg.req_id, arg.product_id, arg.driver_id);
          // console.log("registrationToken7:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )


          // ----- forNotificationToStore ----- //

          const getStoreData = await models.Store.findOne(
            {
              where: {
                id: arg.store_id
              }
            }
          )

          if (getStoreData) {
            const registrationToken = getStoreData.fcm_token;
            var title = "iAccess Store";
            var body = `${driverResponse[0].firstName} is in route to ${storeDataResponse[0].store_name}`;
            const req_id = arg.req_id.toString();
            const product_id = arg.product_id.toString();
            const status = `${getColorAndSizeStatus[0].status}`;
            console.log("emit::getDriverAssignToUser-------------->> 9");
            io.to(userRoom).emit("getDriverAssignToUser", responseData);

            const storeRoom = `Store${arg.store_id}`;
            console.log("emit::driverAcceptRequestStore-------------->> 10");
            io.to(storeRoom).emit("driverAcceptRequestStore", responseData);

            // console.log("registrationToken8:", registrationToken);
            ayraFCM.sendPushNotificationFCM(
              registrationToken,
              title,
              body,
              req_id,
              product_id,
              status,
              true
            )
          }

          // ----- End forNotificationToStore ----- //
        }
      } else {

        // ----- requestRepetationOperation ----- //
        const getAfterDriverCount = await models.DriverQueues.findOne(
          {
            where: {
              req_id: arg.req_id,
              product_id: arg.product_id,
              driver_id: arg.driver_id
            }
          }
        );
        // console.log("After updatation::", getAfterDriverCount);

        if (getAfterDriverCount == null) {

          const createDriverQueue = await models.DriverQueues.create(
            {
              req_id: arg.req_id,
              user_id: arg.user_id,
              product_id: arg.product_id,
              driver_id: arg.driver_id,
              store_id: arg.store_id,
            }
          )
          // console.log("createReject::::", arg.req_id, arg.product_id, arg.driver_id);
          // console.log("createDriverQueue:", createDriverQueue);

        } else {

          if (getAfterDriverCount.driver_count >= 2) {

            // console.log("DriverCount");

            const addRejectTable = await models.DriverRequestRejectData.create(
              {
                req_id: arg.req_id,
                product_id: arg.product_id,
                driver_id: arg.driver_id
              }
            );
            // console.log("addRejectTable::", addRejectTable);

            const deleteDriverQueueData = await models.sequelize.query(
              `
            DELETE FROM driverQueues WHERE req_id = ${arg.req_id} AND  driver_id = ${arg.driver_id}
            `
            );
            // console.log("deleteDriverQueueData::", deleteDriverQueueData);

          } else {

            // console.log("Ids----latest:::", arg.req_id, arg.product_id, arg.driver_id);

            const getDriverCount = await models.DriverQueues.findOne(
              {
                where: {
                  req_id: arg.req_id,
                  product_id: arg.product_id,
                  driver_id: arg.driver_id
                }
              }
            );


            let count = getDriverCount.driver_count + 1;
            // console.log("count::", count);

            const updateDriverCount = await models.DriverQueues.update(
              {
                driver_count: count
              },
              {
                where: {
                  req_id: arg.req_id,
                  product_id: arg.product_id,
                  driver_id: arg.driver_id
                }
              }
            );
            // console.log("updateDriverCount::", updateDriverCount);

          }

        }


        // ----- End requestRepetationOperation ----- //

        const [userResponse] = await models.sequelize.query(
          `
              SELECT 
                fcm_token
              FROM
                users
              WHERE
                id = ${arg.user_id}
              `
        )

        // var rejectRequestByDriver = await models.DriverRequestRejectData.create(
        //   {
        //     req_id: arg.req_id,
        //     product_id: arg.product_id,
        //     driver_id: arg.driver_id,
        //     status: arg.status
        //   }
        // )

        var [storeData] = await models.sequelize.query(
          `
              SELECT 
                store_address, store_lat, store_long
              FROM
                stores
              WHERE
                id = "${arg.store_id}"
              `
        );

        const [getVehicleId] = await models.sequelize.query(
          `
          SELECT
            vehicle_id
          FROM
            final_request_by_users
          WHERE
            req_id = ${arg.req_id}
          `
        );

        if (getVehicleId[0].vehicle_id == 1) {

          var [getStoreLatLongDistance] = await models.sequelize.query(
            `
            SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                    ( 
                      3959 * 
                      acos(cos(radians(${storeData[0].store_lat})) *
                      cos(radians(driver_lat)) *
                      cos(radians(driver_long) - 
                      radians(${storeData[0].store_long})) + 
                      sin(radians(${storeData[0].store_lat})) * 
                      sin(radians(driver_lat))) 
                    )
            AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY  distance;
            `
          );

          const [updateIsavailable] = await models.sequelize.query(
            `
            UPDATE
              drivers 
            SET
              isAvailable = 0
            WHERE 
              id = ${arg.driver_id}
            `
          )

          if (getStoreLatLongDistance.length == 0) {
            var [getStoreLatLongDistance] = await models.sequelize.query(
              `
              SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                    ( 
                      3959 * 
                      acos(cos(radians(${storeData[0].store_lat})) *
                      cos(radians(driver_lat)) *
                      cos(radians(driver_long) - 
                      radians(${storeData[0].store_long})) + 
                      sin(radians(${storeData[0].store_lat})) * 
                      sin(radians(driver_lat))) 
                    )
            AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY distance;
              `
            );
          }

          var getLatLongArr = [];
          for (const getDriverData of getStoreLatLongDistance) {
            // console.log("getDriverData::", getDriverData.id);
            if (getLatLongArr.length == 0) {

              getLatLongArr = getDriverData;

            } else {

              if (getDriverData.driver_count < getLatLongArr.driver_count) {

                getLatLongArr = getDriverData;

              }

            }

          }
          var getStoreLatLong = [];
          if (getLatLongArr.length != 0) {
            getStoreLatLong.push(getLatLongArr);
          }
          // console.log("getStoreLatLong::", getStoreLatLong);

        } else {

          // console.log("driverRejectElsePart.......");

          var [getStoreLatLongDistance] = await models.sequelize.query(
            `
            SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                    ( 
                      3959 * 
                      acos(cos(radians(${storeData[0].store_lat})) *
                      cos(radians(driver_lat)) *
                      cos(radians(driver_long) - 
                      radians(${storeData[0].store_long})) + 
                      sin(radians(${storeData[0].store_lat})) * 
                      sin(radians(driver_lat))) 
                    )
            AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 90 ORDER BY distance;
            `


          );

          // console.log("getStoreLatLongDistance::", getStoreLatLongDistance.length);

          const [updateIsavailable] = await models.sequelize.query(
            `
            UPDATE
              drivers 
            SET
              isAvailable = 0
            WHERE 
              id = ${arg.driver_id}
            `
          )

          // console.log("updateIsavailable---->", updateIsavailable);

          if (getStoreLatLongDistance.length == 0) {

            var [getStoreLatLongDistance] = await models.sequelize.query(
              `
              SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                    ( 
                      3959 * 
                      acos(cos(radians(${storeData[0].store_lat})) *
                      cos(radians(driver_lat)) *
                      cos(radians(driver_long) - 
                      radians(${storeData[0].store_long})) + 
                      sin(radians(${storeData[0].store_lat})) * 
                      sin(radians(driver_lat))) 
                    )
            AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 90 ORDER BY distance;
              `
            );
          }

          var getLatLongArr = [];
          for (const getDriverData of getStoreLatLongDistance) {
            // console.log("getDriverData::", getDriverData.id);
            if (getLatLongArr.length == 0) {

              getLatLongArr = getDriverData;

            } else {

              if (getDriverData.driver_count < getLatLongArr.driver_count) {

                getLatLongArr = getDriverData;

              }

            }

          }
          var getStoreLatLong = [];
          if (getLatLongArr.length != 0) {
            getStoreLatLong.push(getLatLongArr);
          }
          // console.log("getStoreLatLong::", getStoreLatLong);

        }

        if (getStoreLatLong[0] == undefined) {

          // console.log("driverRejectNoDriver");

          const updateFinalRequestByUser = await models.finalRequestByUser.update(
            {
              driver_id: null,
              driver_assigned: 0
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          )

          var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
            {
              status: 4
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          );


          // ----- createRequestQueue ----- //

          const getLatLong = await models.Store.findOne(
            {
              where: {
                id: arg.store_id
              }
            }
          );
          // console.log("drAcceptGetLatLong::", getLatLong);

          const getVehicleIdFromFinal = await models.finalRequestByUser.findOne(
            {
              where: {
                req_id: arg.req_id,
                store_id: arg.store_id,
                product_id: arg.product_id,
              }
            }
          );
          // console.log("drAcceptGetVehicleIdFromFinal::", getVehicleIdFromFinal);

          var addDataToRequestTable = await models.requestQueue.create(
            {
              req_id: arg.req_id,
              store_id: arg.store_id,
              user_id: arg.user_id,
              product_id: arg.product_id,
              vehicle_id: getVehicleIdFromFinal.vehicle_id,
              store_lat: getLatLong.store_lat,
              store_long: getLatLong.store_long,
              start_timestamp: new Date(),
              end_timestamp: new Date(Date.now() + 60 * 60 * 2 * 1000)
            }
          );
          // console.log("drAcceptAddDataToRequestTable::", addDataToRequestTable);

          // ----- End createRequestQueue ----- //


          // ----- refundUserMoney ----- //

          const getTrasactionData = await models.Transaction.findOne(
            {
              where: {
                req_id: arg.req_id,
                user_id: arg.user_id,
                store_id: arg.store_id,
                product_id: arg.product_id
              }
            }
          );
          // console.log("getTrasactionDataDriver::", getTrasactionData);

          // const getStoreData = await models.Store.findOne(
          //   {
          //     where: {
          //       id: arg.store_id
          //     }
          //   }
          // )
          // console.log("getStoreDataDriver::", getStoreData);

          // const getDriverData = await models.Driver.findOne(
          //   {
          //     where: {
          //       id: getTrasactionData.driver_id
          //     }
          //   }
          // )
          // console.log("getDriverDataDriver::", getDriverData);

          // const totalStoreAmount = parseFloat(getStoreData.wallet) - parseFloat(getTrasactionData.product_price);

          // const totalDriverAmount = parseFloat(getDriverData.wallet) - parseFloat(getTrasactionData.delivery_price);

          // const updateStoreTable = await models.Store.update(
          //   {
          //     wallet: totalStoreAmount
          //   },
          //   {
          //     where: {
          //       id: arg.store_id
          //     }
          //   }
          // );

          // const updateDriverTable = await models.Driver.update(
          //   {
          //     wallet: totalDriverAmount
          //   },
          //   {
          //     where: {
          //       id: getTrasactionData.driver_id
          //     }
          //   }
          // );

          const getTrasactionPrice = await models.Transaction.findOne(
            {
              where: {
                req_id: arg.req_id
              }
            }
          )
          // console.log("getTrasactionPrice::", getTrasactionPrice);

          const insertRefundMoneyData = await models.Transaction.create(
            {
              req_id: arg.req_id,
              status: 12,
              transactions: getTrasactionPrice.transactions,
              message: `${arg.user_id}'s Money is Refund`
            }
          )
          // console.log("insertRefundMoneyData::", insertRefundMoneyData);

          // ----- End refundUserMoney ----- //

          // ----- qualityCutFromManageProductData ----- //

          const getProductSize = await models.manageProductSize.findOne(
            {
              where: {
                product_id: arg.product_id
              }
            }
          )
          // console.log("getProductSize::", getProductSize);
          // console.log("getProductSize::", getProductSize.qty);

          const updateQtyData = await models.manageProductSize.update(
            {
              qty: parseInt(getProductSize.qty) + 1
            },
            {
              where: {
                product_id: arg.product_id
              }
            }
          )
          // console.log("updateQtyData::", updateQtyData);
          // ----- qualityCutFromManageProductData ----- //


          // ----- userWalletAmountUpdate ----- //
          const getUserAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
            {
              where: {
                req_id: arg.req_id
              }
            }
          )
          // console.log("getUserAcceptData::", getUserAcceptData);

          var price = 0;

          for (const processData of getUserAcceptData) {

            console.log("processDataIds....", processData.product_id);

            const getFinalRequestByUSerData = await models.finalRequestByUser.findOne(
              {
                where: {
                  req_id: processData.req_id,
                  store_id: processData.store_id,
                }
              }
            )
            // console.log("getFinalRequestByUSerData:", getFinalRequestByUSerData);

            const getProductData = await models.StoreProduct.findOne(
              {
                where: {
                  id: processData.product_id
                }
              }
            )
            // console.log("getProductData::", getProductData);

            let totalProductAmount = parseFloat(getProductData.total_price);
            price = totalProductAmount + price;

            // console.log("totalProductAmount::", totalProductAmount);

          }

          const getFinalRequestByUSerData = await models.finalRequestByUser.findOne(
            {
              where: {
                req_id: arg.req_id,
                store_id: arg.store_id,
              }
            }
          )
          // console.log("getFinalRequestByUSerData:", getFinalRequestByUSerData);

          // console.log("price...", price);
          // console.log("parseFloat(arg.delivery_price)...", parseFloat(getFinalRequestByUSerData.delivery_price));

          const Total_Amount = price + parseFloat(getFinalRequestByUSerData.delivery_price);
          // console.log("Total_Amount::", Total_Amount);

          // console.log("getUserAcceptData[0].user_id...", getUserAcceptData[0].user_id);
          // console.log("getUserAcceptData.user_id.....", getUserAcceptData.user_id);


          const getUserData = await models.User.findOne(
            {
              where: {
                id: getUserAcceptData[0].user_id
              }
            }
          )
          // console.log("getUserData::", getUserData);

          const userTotalAmount = parseFloat(getUserData.walletAmount) + Total_Amount;
          // console.log("userTotalAmount::", userTotalAmount);

          const updateUserWallet = await models.User.update(
            {
              walletAmount: userTotalAmount
            },
            {
              where: {
                id: getUserAcceptData[0].user_id
              }
            }
          )
          // console.log("updateUserWallet::", updateUserWallet);
          // ----- userWalletAmountUpdate ----- //


          const userRoom = `User${arg.user_id}`;
          const registrationToken = userResponse[0].fcm_token;
          const title = "iAccess";
          const body = "There's no driver's available at the moment";
          const req_id = arg.req_id.toString();
          const product_id = arg.product_id.toString();
          const status = '1';

          // console.log("room:=>", userRoom);
          // console.log("userResponse:-", userResponse);

          console.log("emit::noDriverFound-------------->> 11");
          io.to(userRoom).emit("noDriverFound", "Right Now No Driver Available In This Location");

          // console.log("registrationToken9:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )
          return;
        } else {
          // console.log("driverFount=============");

          const [driverResponse] = await models.sequelize.query(
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
                  id = ${getStoreLatLong[0].id}
            `
          );
          console.log("driverResponse:=>", driverResponse[0].fcm_token);

          var driverRoom = `Driver${getStoreLatLong[0].id}`;

          const [storeDataResponse] = await models.sequelize.query(
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
                  stores.id = ${arg.store_id};
                `
          );
          // console.log("storeDataResponse::=>", storeDataResponse);

          const [productResponse] = await models.sequelize.query(
            `
                SELECT
                  product_title,
                  product_photo
                FROM
                  products
                WHERE
                  id = ${arg.product_id}
                `
          );
          // console.log("productResponse:=>", productResponse);

          const [getDeliveryPrice] = await models.sequelize.query(
            `
            SELECT
              delivery_price,
              status,
              store_code,
              store_verify,
              user_code,
              user_verify,
              drop_location_address,
              note_number,
              note_desc
            FROM
              final_request_by_users
            WHERE
              req_id = ${arg.req_id}
            `
          );

          // -----forProductData -----
          var requestProductDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
            {
              where: {
                user_id: arg.user_id,
                store_id: arg.store_id,
                req_id: arg.req_id
              }
            }
          );
          // console.log("driverAcceptRequestData::", requestProductDataArr);

          const productDataMultiValueArr = [];
          for (const productDataArr of requestProductDataArr) {

            var [productDataValueArr] = await models.sequelize.query(
              `
              SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
              `
            );

            var [productGalleryDataArr] = await models.sequelize.query(
              `
              SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
              `
            );

            const responseProductColorData = [
              {
                "name": productDataArr.color,
                "code": productDataArr.color
              }
            ]

            const responseProductSizeData = [
              {
                "size": productDataArr.size
              }
            ]

            const responseProductData = {
              productData: productDataValueArr[0],
              productColor: responseProductColorData,
              productSize: responseProductSizeData,
              productGallery: productGalleryDataArr
            }
            productDataMultiValueArr.push(responseProductData)
          }
          // ----- End forProductData -----

          // ----- deliveryPriceCaculation ----- //
          const totalDeliveryPrice = parseFloat(getDeliveryPrice[0].delivery_price) * 75 / 100;
          // ----- End deliveryPriceCaculation ----- //


          const responseData = {
            req_id: arg.req_id,
            store_id: arg.store_id,
            product_id: arg.product_id,
            user_id: arg.user_id,
            driver_id: getStoreLatLong[0].id,
            store_name: storeDataResponse[0].store_name,
            store_phone: storeDataResponse[0].phone,
            store_logo: storeDataResponse[0].store_logo,
            store_address: storeDataResponse[0].store_address,
            delivery_address: getDeliveryPrice[0].drop_location_address,
            store_lat: storeDataResponse[0].store_lat,
            store_long: storeDataResponse[0].store_long,
            cat_name: storeDataResponse[0].cat_name,
            product_title: productResponse[0].product_title,
            product_img: productResponse[0].product_photo,
            driver_img: driverResponse[0].driver_img,
            driver_lat: driverResponse[0].driver_lat,
            driver_long: driverResponse[0].driver_long,
            delivery_price: totalDeliveryPrice.toString(),
            status: getDeliveryPrice[0].status,
            isAvailable: driverResponse[0].isAvailable,
            note_number: getDeliveryPrice[0].note_number,
            note_desc: getDeliveryPrice[0].note_desc,
            store_verify: getDeliveryPrice[0].store_verify,
            store_code: getDeliveryPrice[0].store_code,
            user_verify: getDeliveryPrice[0].user_verify,
            user_code: getDeliveryPrice[0].user_code,
            time: 90,
            productDetails: productDataMultiValueArr
          };

          // console.log("driverResponse[0].fcm_token:::", driverResponse[0].fcm_token);
          // console.log("driverRoom::", driverRoom);

          let registrationToken = driverResponse[0].fcm_token;
          const title = "iAccess Driver";
          const body = "New request available to fulfill GO online";
          const req_id = arg.req_id.toString();
          const product_id = arg.product_id.toString();
          const status = getDeliveryPrice[0].status.toString();



          // console.log("sendNotificationFCM:=", registrationToken, title, body, req_id, product_id);

          // const [updateIsavailable] = await models.sequelize.query(
          //   `
          //   UPDATE
          //     drivers 
          //   SET
          //     isAvailable = 2 
          //   WHERE 
          //     id = ${getStoreLatLong[0].id}
          //   `
          // )

          console.log("emit::driverAssigned-------------->> 12");
          io.to(driverRoom).emit("driverAssigned", responseData);

          // console.log("registrationToken10:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )

          const updateDriverStatus = await models.Driver.update(
            {
              isAvailable: 2
            },
            {
              where: {
                id: getStoreLatLong[0].id
              }
            }
          );
          // console.log("acceptRejectDriverStatus::", updateDriverStatus);

          const finalRequestByUser = await models.finalRequestByUser.update(
            {
              driver_id: getStoreLatLong[0].id
            },
            {
              where: {
                req_id: arg.req_id
              }
            }
          );

          const getDriverTimeStamp = await models.finalRequestByUser.findOne(
            {
              where: {
                driver_id: getStoreLatLong[0].id
              }
            }
          );

          var dr_id = getStoreLatLong[0].id;

          // --- updateDriverFunction ---
          // console.log("BeforeFunction2");
          async function updateDriver() {

            console.log("==========================================");
            console.log("updateDriverIdsReject---::", arg.req_id, dr_id);
            console.log("==========================================");

            const [driverResponse] = await models.sequelize.query(
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
                      id = ${dr_id}
                `
            );
            // console.log("driverResponse:=>", driverResponse);

            const getFinalRequest = await models.finalRequestByUser.findOne(
              {
                where: {
                  req_id: arg.req_id,
                  driver_id: dr_id,
                  status: 3
                }
              }
            )
            console.log("getFinalRequest::", getFinalRequest);

            if (getFinalRequest) {

              // console.log("dr_id:::::", dr_id);
              // console.log("updateDriverFunc:::",getStoreLatLong[0].id);

              const findDataInDriverQueue = await models.DriverQueues.findOne(
                {
                  where: {
                    driver_id: dr_id,
                    product_id: arg.product_id,
                    req_id: arg.req_id
                  }
                }
              );
              // console.log("cronJobFindDataInDriverQueue", findDataInDriverQueue);

              if (findDataInDriverQueue == null) {
                const createDriverQueue = await models.DriverQueues.create(
                  {
                    req_id: arg.req_id,
                    user_id: arg.user_id,
                    product_id: arg.product_id,
                    driver_id: dr_id,
                    store_id: arg.store_id,
                  }
                )
                // console.log("updateCreateDriver:::", arg.req_id, arg.product_id, dr_id);
                // console.log("createDriverQueue:", createDriverQueue);
              } else {

                // console.log("IdsssUpdateDriver:::", arg.req_id, arg.product_id, dr_id);

                const getAfterDriverCount = await models.DriverQueues.findOne(
                  {
                    where: {
                      req_id: arg.req_id,
                      product_id: arg.product_id,
                      driver_id: dr_id
                    }
                  }
                );
                // console.log("2AfterUpdatation::", getAfterDriverCount);
                // console.log("2DriverCount::", getAfterDriverCount.driver_count);

                if (getAfterDriverCount.driver_count >= 2) {

                  const addRejectTable = await models.DriverRequestRejectData.create(
                    {
                      req_id: arg.req_id,
                      product_id: arg.product_id,
                      driver_id: dr_id
                    }
                  );
                  // console.log("3addRejectTable::", addRejectTable);

                  const deleteDriverQueueData = await models.sequelize.query(
                    `
                  DELETE FROM driverQueues WHERE req_id = ${arg.req_id} AND driver_id = ${dr_id}
                  `
                  );
                  // console.log("deleteDriverQueueData::", deleteDriverQueueData);

                } else {

                  const getDriverCount = await models.DriverQueues.findOne(
                    {
                      where: {
                        req_id: arg.req_id,
                        product_id: arg.product_id,
                        driver_id: dr_id
                      }
                    }

                  );
                  let count = getDriverCount.driver_count + 1;
                  // console.log("count::", count);

                  const updateDriverCount = await models.DriverQueues.update(
                    {
                      driver_count: count
                    },
                    {
                      where: {
                        req_id: arg.req_id,
                        product_id: arg.product_id,
                        driver_id: dr_id
                      }
                    }
                  );
                  // console.log("updateDriverCount::", updateDriverCount);

                }

              }

              const getCountData = await models.DriverQueues.findOne(
                {
                  where: {
                    req_id: arg.req_id,
                    product_id: arg.product_id,
                    driver_id: dr_id
                  }
                }
              );

              var alertResponse;
              if (getCountData) {
                console.log("getCountData::", getCountData.driver_count);

                alertResponse = {
                  driver_id: dr_id,
                  req_id: arg.req_id,
                  count: getCountData.driver_count
                }

              }

              const driverRoom = `Driver${dr_id}`;
              console.log("emit::driverAlertTime-------------->> 13");
              io.to(driverRoom).emit("driverAlertTime", alertResponse);

              // --- rejectedRequest ---
              const [userResponse] = await models.sequelize.query(
                `
                    SELECT 
                      fcm_token
                    FROM
                      users
                    WHERE
                      id = ${arg.user_id}
                    `
              );
              // console.log("userResponse::", userResponse);

              const [storeData] = await models.sequelize.query(
                `
                    SELECT 
                      store_address, store_lat, store_long
                    FROM
                      stores
                    WHERE
                      id = "${arg.store_id}"
                    `
              );
              // console.log("storeData:::", storeData);

              if (getVehicleId[0].vehicle_id == 1) {

                var [getStoreLatLongDistance] = await models.sequelize.query(
                  `
                  SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                    ( 
                      3959 * 
                      acos(cos(radians(${storeData[0].store_lat})) *
                      cos(radians(driver_lat)) *
                      cos(radians(driver_long) - 
                      radians(${storeData[0].store_long})) + 
                      sin(radians(${storeData[0].store_lat})) * 
                      sin(radians(driver_lat))) 
                    )
                    AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY distance;
                  `
                );

                const updateDriverData = await models.Driver.update(
                  {
                    isAvailable: 0
                  },
                  {
                    where: {
                      id: dr_id
                    }
                  }
                );


                if (getStoreLatLongDistance.length == 0) {
                  var [getStoreLatLongDistance] = await models.sequelize.query(
                    `
                    SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                      ( 
                        3959 * 
                        acos(cos(radians(${storeData[0].store_lat})) *
                        cos(radians(driver_lat)) *
                        cos(radians(driver_long) - 
                        radians(${storeData[0].store_long})) + 
                        sin(radians(${storeData[0].store_lat})) * 
                        sin(radians(driver_lat))) 
                      )
                      AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY distance;
                    `
                  );
                }

                var getLatLongArr = [];
                for (const getDriverData of getStoreLatLongDistance) {
                  // console.log("getDriverData::", getDriverData.driver_count);
                  if (getLatLongArr.length == 0) {

                    getLatLongArr = getDriverData;

                  } else {

                    if (getDriverData.driver_count < getLatLongArr.driver_count) {

                      getLatLongArr = getDriverData;

                    }

                  }

                }
                var getStoreLatLong = [];
                if (getLatLongArr.length != 0) {
                  getStoreLatLong.push(getLatLongArr);
                }
                // console.log("getStoreLatLong::", getStoreLatLong);

                if (getStoreLatLong.length != 0) {
                  dr_id = getStoreLatLong[0].id;
                }

              } else {

                var [getStoreLatLongDistance] = await models.sequelize.query(
                  `
                  SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                    ( 
                      3959 * 
                      acos(cos(radians(${storeData[0].store_lat})) *
                      cos(radians(driver_lat)) *
                      cos(radians(driver_long) - 
                      radians(${storeData[0].store_long})) + 
                      sin(radians(${storeData[0].store_lat})) * 
                      sin(radians(driver_lat))) 
                    )
                    AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 90 ORDER BY distance;
                  `
                );

                const updateDriverData = await models.Driver.update(
                  {
                    isAvailable: 0
                  },
                  {
                    where: {
                      id: dr_id
                    }
                  }
                );


                if (getStoreLatLongDistance.length == 0) {
                  var [getStoreLatLongDistance] = await models.sequelize.query(
                    `
                    SELECT stores.store_lat, stores.store_long, drivers.id,driverQueues.driver_count,driver_request_reject_datas.req_id, 
                      ( 
                        3959 * 
                        acos(cos(radians(${storeData[0].store_lat})) *
                        cos(radians(driver_lat)) *
                        cos(radians(driver_long) - 
                        radians(${storeData[0].store_long})) + 
                        sin(radians(${storeData[0].store_lat})) * 
                        sin(radians(driver_lat))) 
                      )
                      AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id AND driverQueues.req_id = ${arg.req_id} WHERE store_name is not null AND drivers.status = 1 AND drivers.vehicle = ${getVehicleId[0].vehicle_id} AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 90 ORDER BY distance;
                    `
                  );
                }

                var getLatLongArr = [];
                for (const getDriverData of getStoreLatLongDistance) {
                  // console.log("getDriverData::", getDriverData.driver_count);
                  if (getLatLongArr.length == 0) {

                    getLatLongArr = getDriverData;

                  } else {

                    if (getDriverData.driver_count < getLatLongArr.driver_count) {

                      getLatLongArr = getDriverData;

                    }

                  }

                }
                var getStoreLatLong = [];
                if (getLatLongArr.length != 0) {
                  getStoreLatLong.push(getLatLongArr);
                }
                // console.log("getStoreLatLong::", getStoreLatLong);

                if (getStoreLatLong.length != 0) {
                  dr_id = getStoreLatLong[0].id;
                }

              }

              if (getStoreLatLong[0] == undefined) {

                // console.log("noFound--latest:::");

                const finalRequestByUser = await models.finalRequestByUser.update(
                  {
                    driver_id: null,
                    driver_assigned: 0
                  },
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                );

                var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
                  {
                    status: 4
                  },
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                );

                // ----- createRequestQueue ----- //

                const getLatLong = await models.Store.findOne(
                  {
                    where: {
                      id: arg.store_id
                    }
                  }
                );
                // console.log("drAcUpdateGetLatLong::", getLatLong);

                const getVehicleIdFromFinal = await models.finalRequestByUser.findOne(
                  {
                    where: {
                      req_id: arg.req_id,
                      store_id: arg.store_id,
                      product_id: arg.product_id,
                    }
                  }
                );
                // console.log("drAcUpdateGetVehicleIdFromFinal::", getVehicleIdFromFinal);

                var addDataToRequestTable = await models.requestQueue.create(
                  {
                    req_id: arg.req_id,
                    store_id: arg.store_id,
                    user_id: arg.user_id,
                    product_id: arg.product_id,
                    vehicle_id: getVehicleIdFromFinal.vehicle_id,
                    store_lat: getLatLong.store_lat,
                    store_long: getLatLong.store_long,
                    start_timestamp: new Date(),
                    end_timestamp: new Date(Date.now() + 60 * 60 * 2 * 1000)
                  }
                );
                // console.log("drAcUpdateAddDataToRequestTable::", addDataToRequestTable);

                // ----- End createRequestQueue ----- //


                // ----- refundUserMoney ----- //

                const getTrasactionData = await models.Transaction.findOne(
                  {
                    where: {
                      req_id: arg.req_id,
                      user_id: arg.user_id,
                      store_id: arg.store_id,
                      product_id: arg.product_id
                    }
                  }
                );
                // console.log("getTrasactionDataUpdate::", getTrasactionData);

                // const getStoreData = await models.Store.findOne(
                //   {
                //     where: {
                //       id: arg.store_id
                //     }
                //   }
                // );
                // console.log("getStoreDataUpdate::", getStoreData);

                // const getDriverData = await models.Driver.findOne(
                //   {
                //     where: {
                //       id: getTrasactionData.driver_id
                //     }
                //   }
                // );
                // console.log("getDriverDataUpdate::", getDriverData);

                // const totalStoreAmount = parseFloat(getStoreData.wallet) - parseFloat(getTrasactionData.product_id);

                // const totalDriverAmount = parseFloat(getDriverData.wallet) - parseFloat(getTrasactionData.delivery_price);

                // const updateStoretable = await models.Store.update(
                //   {
                //     wallet: totalStoreAmount
                //   },
                //   {
                //     where: {
                //       id: arg.store_id
                //     }
                //   }
                // );

                // const updateDriverTable = await models.Driver.update(
                //   {
                //     wallet: totalDriverAmount
                //   },
                //   {
                //     where: {
                //       id: getTrasactionData.driver_id
                //     }
                //   }
                // );

                const getTrasactionPrice = await models.Transaction.findOne(
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                )
                // console.log("getTrasactionPrice::", getTrasactionPrice);

                const insertRefundMoneyData = await models.Transaction.create(
                  {
                    req_id: arg.req_id,
                    status: 12,
                    transactions: getTrasactionPrice.transactions,
                    message: `${arg.user_id}'s Money is Refund`
                  }
                )
                // console.log("insertRefundMoneyData::", insertRefundMoneyData);

                // ----- End refundUserMoney ----- //

                // ----- qualityCutFromManageProductData ----- //

                const getProductSize = await models.manageProductSize.findOne(
                  {
                    where: {
                      product_id: arg.product_id
                    }
                  }
                )

                const updateQtyData = await models.manageProductSize.update(
                  {
                    qty: parseInt(getProductSize.qty) + 1
                  },
                  {
                    where: {
                      product_id: arg.product_id
                    }
                  }
                )
                // console.log("updateQtyData:", updateQtyData);
                // ----- qualityCutFromManageProductData ----- //


                // ----- userWalletAmountUpdate ----- //
                const getUserAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                )
                // console.log("getUserAcceptData::", getUserAcceptData);

                var price = 0;

                for (const processData of getUserAcceptData) {

                  const getFinalRequestByUSerData = await models.finalRequestByUser.findOne(
                    {
                      where: {
                        req_id: processData.req_id,
                        store_id: processData.store_id,
                      }
                    }
                  )
                  // console.log("getFinalRequestByUSerData:", getFinalRequestByUSerData);

                  const getProductData = await models.StoreProduct.findOne(
                    {
                      where: {
                        id: processData.product_id
                      }
                    }
                  )
                  // console.log("getProductData::", ::getProductData);

                  let totalProductAmount = parseFloat(getProductData.total_price);
                  price = totalProductAmount + price;

                  // console.log("totalProductAmount::", totalProductAmount);

                }

                const getFinalRequestByUSerData = await models.finalRequestByUser.findOne(
                  {
                    where: {
                      req_id: arg.req_id,
                      store_id: arg.store_id,
                    }
                  }
                )
                // console.log("getFinalRequestByUSerData:", getFinalRequestByUSerData);

                const Total_Amount = price + parseFloat(getFinalRequestByUSerData.delivery_price);
                // console.log("Total_Amount::", Total_Amount);

                const getUserData = await models.User.findOne(
                  {
                    where: {
                      id: getUserAcceptData[0].user_id
                    }
                  }
                )
                // console.log("getUserData::", getUserData);

                const userTotalAmount = parseFloat(getUserData.walletAmount) + Total_Amount;
                // console.log("userTotalAmount::", userTotalAmount);

                const updateUserWallet = await models.User.update(
                  {
                    walletAmount: userTotalAmount
                  },
                  {
                    where: {
                      id: getUserAcceptData[0].user_id
                    }
                  }
                )
                // console.log("updateUserWallet::", updateUserWallet);
                // ----- userWalletAmountUpdate ----- //

                const userRoom = `User${arg.user_id}`;
                const registrationToken = userResponse[0].fcm_token;
                const title = "iAccess";
                const body = "There's no driver's available at the moment";
                const req_id = arg.req_id.toString();
                const product_id = arg.product_id.toString();
                const status = '1';
                // console.log("room:=>", userRoom);
                // console.log("userResponse:-", userResponse);

                console.log("emit::noDriverFound-------------->> 14");
                io.to(userRoom).emit("noDriverFound", "Right Now No Driver Available In This Location");

                // console.log("registrationToken11:", registrationToken);
                ayraFCM.sendPushNotificationFCM(
                  registrationToken,
                  title,
                  body,
                  req_id,
                  product_id,
                  status,
                  true
                )
                return;
              } else {

                const [driverResponse] = await models.sequelize.query(
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
                        id = ${dr_id}
                  `
                );
                // console.log("driverResponse:=>", driverResponse);

                const driverRoom = `Driver${dr_id}`;
                // console.log("driverRoom::", driverRoom);

                const [storeDataResponse] = await models.sequelize.query(
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
                        stores.id = ${arg.store_id};
                      `
                );
                // console.log("storeDataResponse::=>", storeDataResponse);

                const [productResponse] = await models.sequelize.query(
                  `
                      SELECT
                        product_title,
                        product_photo
                      FROM
                        products
                      WHERE
                        id = ${arg.product_id}
                      `
                );
                // console.log("productResponse:=>", productResponse);

                const [getDeliveryPrice] = await models.sequelize.query(
                  `
                  SELECT
                    delivery_price,
                    status,
                    store_code,
                    store_verify,
                    user_code,
                    user_verify,
                    drop_location_address,
                    note_number,
                    note_desc
                  FROM
                    final_request_by_users
                  WHERE
                    req_id = ${arg.req_id}
                  `
                );

                // ----- forProductData -----
                var requestProductDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
                  {
                    where: {
                      user_id: arg.user_id,
                      store_id: arg.store_id,
                      req_id: arg.req_id
                    }
                  }
                )

                const productDataMultiValueArr = [];
                for (const productDataArr of requestProductDataArr) {

                  var [productDataValueArr] = await models.sequelize.query(
                    `
                    SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
                    `
                  );

                  var [productGalleryDataArr] = await models.sequelize.query(
                    `
                    SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
                    `
                  );

                  const responseProductColorData = [
                    {
                      "name": productDataArr.color,
                      "code": productDataArr.color
                    }
                  ]

                  const responseProductSizeData = [
                    {
                      "size": productDataArr.size
                    }
                  ]

                  const responseProductData = {
                    productData: productDataValueArr[0],
                    productColor: responseProductColorData,
                    productSize: responseProductSizeData,
                    productGallery: productGalleryDataArr
                  }
                  productDataMultiValueArr.push(responseProductData)
                }
                // ----- End forProductData -----


                // ----- deliveryPriceCaculation ----- //
                const totalDeliveryPrice = parseFloat(getDeliveryPrice[0].delivery_price) * 75 / 100;
                // console.log("totalDeliveryPrice::", totalDeliveryPrice);
                // ----- End deliveryPriceCaculation ----- //


                const responseData = {
                  req_id: arg.req_id,
                  store_id: arg.store_id,
                  product_id: arg.product_id,
                  user_id: arg.user_id,
                  driver_id: dr_id,
                  store_name: storeDataResponse[0].store_name,
                  store_phone: storeDataResponse[0].phone,
                  store_logo: storeDataResponse[0].store_logo,
                  store_address: storeDataResponse[0].store_address,
                  delivery_address: getDeliveryPrice[0].drop_location_address,
                  store_lat: storeDataResponse[0].store_lat,
                  store_long: storeDataResponse[0].store_long,
                  cat_name: storeDataResponse[0].cat_name,
                  product_title: productResponse[0].product_title,
                  product_img: productResponse[0].product_photo,
                  driver_img: driverResponse[0].driver_img,
                  driver_lat: driverResponse[0].driver_lat,
                  driver_long: driverResponse[0].driver_long,
                  delivery_price: totalDeliveryPrice.toString(),
                  status: getDeliveryPrice[0].status,
                  isAvailable: driverResponse[0].isAvailable,
                  note_number: getDeliveryPrice[0].note_number,
                  note_desc: getDeliveryPrice[0].note_desc,
                  store_verify: getDeliveryPrice[0].store_verify,
                  store_code: getDeliveryPrice[0].store_code,
                  user_verify: getDeliveryPrice[0].user_verify,
                  user_code: getDeliveryPrice[0].user_code,
                  time: 90,
                  productDetails: productDataMultiValueArr
                };

                let registrationToken = driverResponse[0].fcm_token;
                const title = "iAccess Driver";
                const body = "New request available to fulfill GO online";
                const req_id = arg.req_id.toString();
                const product_id = arg.product_id.toString();
                const status = getDeliveryPrice[0].status.toString();

                // console.log("sendNotificationFCM:=", registrationToken, title, body, req_id, product_id);

                console.log("emit::driverAssigned-------------->> 15");
                io.to(driverRoom).emit("driverAssigned", responseData);

                const isAvailableUpdate = await models.Driver.update(
                  {
                    isAvailable: 2
                  },
                  {
                    where: {
                      id: dr_id
                    }
                  }
                );

                const finalRequestByUser = await models.finalRequestByUser.update(
                  {
                    driver_id: dr_id
                  },
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                );

                // console.log("registrationToken12:", registrationToken);
                ayraFCM.sendPushNotificationFCM(
                  registrationToken,
                  title,
                  body,
                  req_id,
                  product_id,
                  status,
                  true
                )

                var timerId = ('' + arg.req_id + dr_id).toString();

                timeOut.push(timerId);
                timeOutMain.push(timerId);
                console.log("timerId7::", timerId, timeOutMain.length);
                timeOutMain[timeOutMain.length - 1] = setTimeout(updateDriver, 90000)
              }
            } else {
              // console.log("Available::");
            }
          }
          var timerId = ('' + arg.req_id + dr_id).toString();
          timeOut.push(timerId);
          timeOutMain.push(timerId);
          console.log("timerId8::", timerId, timeOutMain.length);
          timeOutMain[timeOutMain.length - 1] = setTimeout(updateDriver, 90000)
          // console.log("AfterFunction2");
        }
      }
    });
    // ----- End driverAcceptReject ----- //

    // ----- currentRunningRequest ----- //
    socket.on("currentRunningRequest", async (arg) => {

      // -- For user_id --
      if (arg.user_id) {
        const [getuserProductStoreAccepted] = await models.sequelize.query(
          `
          SELECT
            *
          FROM
            users_product_store_accepteds
          WHERE
            user_id = ${arg.user_id}
          AND
            status IN (5, 6, 7, 8, 9)
          `
        )
        console.log("getuserProductStoreAccepted::", getuserProductStoreAccepted[0]);

        if (getuserProductStoreAccepted[0] == undefined) {
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("runningReqAlertToUser", 0);


          const registrationToken = getuserProductStoreAccepted[0].fcm_token;
          const title = "iAccess notification";
          const body = '';
          const req_id = '1';
          const product_id = '1';
          const status = 'o';

          console.log("registrationToken13:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )


        } else {
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("runningReqAlertToUser", 1);


          const registrationToken = getuserProductStoreAccepted[0].fcm_token;
          const title = "iAccess notification";
          const body = '';
          const req_id = '1';
          const product_id = '1';
          const status = 'o';

          console.log("registrationToken14:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )

        }
      }

      // -- For store_id --
      if (arg.store_id) {
        const [getuserProductStoreAccepted] = await models.sequelize.query(
          `
          SELECT
            *
          FROM
            users_product_store_accepteds
          WHERE
            store_id = ${arg.store_id}
          AND
            status IN (5, 6)
          `
        )

        if (getuserProductStoreAccepted[0] == undefined) {

          const storeRoom = `Store${arg.store_id}`;
          io.to(storeRoom).emit("runningReqAlertToStore", 0);

          const registrationToken = getuserProductStoreAccepted[0].fcm_token;
          const title = "iAccess notification";
          const body = '';
          const req_id = '1';
          const product_id = '1';
          const status = 'o';

          console.log("registrationToken15:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )

        } else {

          const storeRoom = `Store${arg.store_id}`;
          io.to(storeRoom).emit("runningReqAlertToStore", 1);

          const registrationToken = getuserProductStoreAccepted[0].fcm_token;
          const title = "iAccess notification";
          const body = '';
          const req_id = '1';
          const product_id = '1';
          const status = '1';

          console.log("registrationToken16:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )

        }

      }

    })
    // ----- End currentRunningRequest ----- //


    // ----- arrivedToStore ----- //
    socket.on("arrivedToStore", async (arg) => {

      const storeRoom = `Store${arg.store_id}`;
      console.log("storeRoom:=>", storeRoom);

      var getStoreData = await models.Store.findOne(
        {
          where: {
            id: arg.store_id
          }
        }
      );
      console.log("getStoreData:=>", getStoreData.fcm_token);

      const getDriverData = await models.Driver.findOne(
        {
          where: {
            id: arg.driver_id
          }
        }
      );
      console.log("getDriverData::", getDriverData);

      var [updateStatusInAccepted] = await models.UserProductItemRequetAcceptedStore.update(
        {
          status: 6
        },
        {
          where: {
            store_id: arg.store_id,
            req_id: arg.req_id
          }
        }
      );
      console.log("updateStatusInAccepted:-", updateStatusInAccepted);

      const getUserId = await models.UserProductItemRequetAcceptedStore.findOne(
        {
          where: {
            req_id: arg.req_id
          }
        }
      );
      console.log("getUserId::", getUserId);


      var [updateStatusinFinalRequest] = await models.finalRequestByUser.update(
        {
          status: 6
        },
        {
          where: {
            req_id: arg.req_id,
            driver_id: arg.driver_id
          }
        }
      );

      const responseData = {
        req_id: arg.req_id,
        store_id: arg.store_id,
        driver_id: arg.driver_id,
        status: 6
      };

      const userRoom = `User${getUserId.user_id}`

      const registrationToken = getStoreData.fcm_token;
      const title = "iAccess Store";
      let body = `${getDriverData.firstName} has arrived to ${getStoreData.store_name}`;
      const req_id = arg.req_id.toString();
      const product_id = getUserId.product_id.toString();
      const status = 6;

      io.to(storeRoom).emit("alertToStore", responseData);
      io.to(userRoom).emit("onArrivedToUser", responseData);

      console.log("registrationToken17:", registrationToken);
      ayraFCM.sendPushNotificationFCM(
        registrationToken,
        title,
        body,
        req_id,
        product_id,
        status,
        true
      )

      const getUserData = await models.User.findOne(
        {
          where: {
            id: getUserId.user_id
          }
        }
      );
      console.log("getUserData::", getUserData);

      if (getUserData) {
        const registrationToken = getUserData.fcm_token;
        const title = "iAccess";
        let body = `${getDriverData.firstName} has arrived to ${getStoreData.store_name}`;
        const req_id = arg.req_id.toString();
        const product_id = getUserId.product_id.toString();
        const status = '6';

        console.log("registrationToken18:", registrationToken);
        ayraFCM.sendPushNotificationFCM(
          registrationToken,
          title,
          body,
          req_id,
          product_id,
          status,
          true
        )
      }



    })
    // ----- End arrivedToStore ----- //


    // ----- pickupFromStore ----- //
    socket.on("pickupFromStore", async (arg) => {

      // -- Generate Code 6 digit
      const code = Math.floor(100000 + Math.random() * 900000);
      console.log("pickupFromStoreCode::", code);

      const getFinalRequestData = await models.finalRequestByUser.findOne(
        {
          where: {
            req_id: arg.req_id,
            driver_id: arg.driver_id,
            store_id: arg.store_id
          }
        }
      );
      console.log("getFinalRequestData::", getFinalRequestData);

      // -- ifCodeIsInTable,CodeIsn'tGenerate -- //
      if (getFinalRequestData.store_code == null) {

        var updateStatusInFinalRequest = await models.finalRequestByUser.update(
          {
            store_code: code
          },
          {
            where: {
              req_id: arg.req_id,
              driver_id: arg.driver_id,
              store_id: arg.store_id
            }
          }
        );
        console.log("updateStatusInFinalRequest::", updateStatusInFinalRequest);

        const getStoreData = await models.Store.findOne(
          {
            where: {
              id: arg.store_id
            }
          }
        )
        console.log("getStoreData::", getStoreData);

        if (updateStatusInFinalRequest[0] == 1) {
          const responseData = {
            status: 1,
            code: code
          }
          const storeRoom = `Store${arg.store_id}`;
          io.to(storeRoom).emit("pickupAlertToStore", responseData);

          // const registrationToken = getStoreData.fcm_token;
          // const title = "iAccess Notification";
          // const body = '';
          // const req_id = '1';
          // const product_id = '1';
          // const status = '0';

          // console.log("registrationToken19:",registrationToken);
          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        } else {
          const responseData = {
            status: 0,
            code: code
          }
          const storeRoom = `Store${arg.store_id}`;
          io.to(storeRoom).emit("pickupAlertToStore", responseData);

          // const registrationToken = getStoreData.fcm_token;
          // const title = "iAccess Notification";
          // const body = '';
          // const req_id = '1';
          // const product_id = '1';
          // const status = '0';

          // console.log("registrationToken20:",registrationToken);
          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        }

      } else {

        var updateStatusInFinalRequest = await models.finalRequestByUser.update(
          {
            store_code: getFinalRequestData.store_code
          },
          {
            where: {
              req_id: arg.req_id,
              driver_id: arg.driver_id,
              store_id: arg.store_id
            }
          }
        );
        console.log("updateStatusInFinalRequest::", updateStatusInFinalRequest);

        const getStoreData = await models.Store.findOne(
          {
            where: {
              id: arg.store_id
            }
          }
        )
        console.log("getStoreData::", getStoreData);

        if (updateStatusInFinalRequest[0] == 1) {
          const responseData = {
            status: 1,
            code: getFinalRequestData.store_code
          }
          const storeRoom = `Store${arg.store_id}`;
          io.to(storeRoom).emit("pickupAlertToStore", responseData);

          // const registrationToken = getStoreData.fcm_token;
          // const title = "iAccess Notification";
          // const body = '';
          // const req_id = '1';
          // const product_id = '1';
          // const status = '0';

          // console.log("registrationToken21:",registrationToken);
          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        } else {
          const responseData = {
            status: 0,
            code: getFinalRequestData.store_code
          }
          const storeRoom = `Store${arg.store_id}`;
          io.to(storeRoom).emit("pickupAlertToStore", responseData);



          // const registrationToken = getStoreData.fcm_token;
          // const title = "iAccess Notification";
          // const body = '';
          // const req_id = '1';
          // const product_id = '1';
          // const status = '0';

          // console.log("registrationToken22:",registrationToken);
          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        }

      }



    });
    // ----- End pickupFromStore ----- //


    // ----- verifyCode ----- //
    socket.on("verifyCode", async (arg) => {

      var getFinalRequestTable = await models.finalRequestByUser.findOne(
        {
          where: {
            req_id: arg.req_id,
            driver_id: arg.driver_id,
            store_id: arg.store_id
          }
        }
      );
      console.log("getFinalRequestTable:-", getFinalRequestTable);

      const data = getFinalRequestTable.store_code == arg.store_code;

      if (data == true) {

        var updateStoreVerify = await models.finalRequestByUser.update(
          {
            store_verify: 1,
            status: 7
          },
          {
            where: {
              req_id: arg.req_id,
              driver_id: arg.driver_id,
              store_id: arg.store_id
            }
          }
        );

        var updateStatusInAcceptedtable = await models.UserProductItemRequetAcceptedStore.update(
          {
            status: 7
          },
          {
            where: {
              req_id: arg.req_id,
              store_id: arg.store_id
            }
          }
        );

        // ----- forTransactionData ----- //
        const getFinalRequest = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: arg.req_id,
              store_id: arg.store_id
            }
          }
        )
        console.log("getFinalRequest::", getFinalRequest);

        const getUserData = await models.User.findOne(
          {
            where: {
              id: arg.user_id
            }
          }
        )
        console.log("getUserData::", getUserData);

        const getProductData = await models.StoreProduct.findOne(
          {
            where: {
              id: getFinalRequest.product_id
            }
          }
        )
        console.log("getProductData::", getProductData);


        const getUserAcceptData = await models.UserProductItemRequetAcceptedStore.findAll(
          {
            where: {
              req_id: arg.req_id
            }
          }
        )
        console.log("getUserAcceptData::", getUserAcceptData);

        var price = 0;

        for (const processData of getUserAcceptData) {

          const getProduct = await models.StoreProduct.findOne(
            {
              where: {
                id: processData.product_id
              }
            }
          );
          console.log("getProduct::", getProduct);

          let totalPrice = parseFloat(getProduct.regular_price) - parseFloat(getProduct.maintenance_fee);

          price = totalPrice + price;

          console.log("productPrice:", getProduct.regular_price);
          console.log("totalPrice::", totalPrice);

        }

        const Total_price = price;
        console.log("Total_price:", Total_price);


        const insertTransactionDetails = await models.Transaction.create(
          {
            store_id: arg.store_id,
            user_id: null,
            product_id: getFinalRequest.product_id,
            req_id: arg.req_id,
            product_price: getProductData.regular_price,
            transactions: Total_price,
            type: 1,
            message: `${getUserData.firstName} finalized a request for a ${getProductData.product_title} for the amount of ${Total_price} this amount will reflect in you wallet`
          }
        )
        console.log("insertTransactionDetails::", insertTransactionDetails);
        // ----- End forTransactionData ----- //

        // ----- addAmountInStoreAccount ----- //
        const getFinalrequestData = await models.finalRequestByUser.findOne(
          {
            where: {
              store_id: arg.store_id,
              req_id: arg.req_id,
            }
          }
        )
        console.log("getFinalrequestData::", getFinalrequestData.delivery_price);

        // const totalPrice = parseFloat(getProductData.regular_price) + parseFloat(getFinalrequestData.delivery_price);
        // console.log("totalPrice::", totalPrice);

        var getStoreData = await models.Store.findOne(
          {
            where: {
              id: arg.store_id
            }
          }
        );
        console.log("getStoreData::", getStoreData);

        const storeAmt = parseFloat(getStoreData.wallet) + parseFloat(Total_price);
        console.log("storeAmt::", storeAmt);

        const addMoneyToStore = await models.Store.update(
          {
            wallet: storeAmt
          },
          {
            where: {
              id: arg.store_id
            }
          }
        );
        console.log("addMoneyToStore::", addMoneyToStore);

        // ----- End addAmountInStoreAccount ----- //

        var getFinalRequestData = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: arg.req_id,
              store_id: arg.store_id
            }
          }
        )

        const getDriverData = await models.Driver.findOne(
          {
            where: {
              id: arg.driver_id
            }
          }
        );
        console.log("getDriverData::;", getDriverData);

        const responseDataForUser = {
          responseStatus: 1,
          status: 7
        }

        const storeRoom = `Store${arg.store_id}`;
        const userRoom = `User${arg.user_id}`;
        const driverRoom = `Driver${arg.driver_id}`;

        console.log("Rooms::=>", storeRoom, userRoom, driverRoom);

        io.to(storeRoom).emit("verifyCodeOfStore", 1);
        io.to(driverRoom).emit("alertToDriver", 1);
        io.to(userRoom).emit("alertToUser", responseDataForUser);

        const registrationToken = getUserData.fcm_token;
        const title = 'iAccess';
        const body = `${getDriverData.firstName} has submitted correct confirmation code.`;
        const req_id = arg.req_id.toString();
        const product_id = getFinalRequestData.product_id.toString();
        const status = '1';

        console.log("registrationToken23:", registrationToken);
        ayraFCM.sendPushNotificationFCM(
          registrationToken,
          title,
          body,
          req_id,
          product_id,
          status,
          true
        )

      } else {

        const responseDataForUser = {
          responseStatus: 0,
          status: 7
        }
        const storeRoom = `Store${arg.store_id}`;
        const userRoom = `User${arg.user_id}`;
        const driverRoom = `Driver${arg.driver_id}`;

        io.to(storeRoom).emit("verifyCodeOfStore", 0);
        io.to(driverRoom).emit("alertToDriver", 0);
        io.to(userRoom).emit("alertToUser", responseDataForUser);

        // const registrationToken = getStoreData.fcm_token;
        // const title = 'iAccess Notification';
        // const body = '';
        // const req_id = arg.req_id.toString();
        // const product_id = getFinalRequestData.product_id.toString();
        // const status = '0';

        // ayraFCM.sendPushNotificationFCM(
        //   registrationToken,
        //   title,
        //   body,
        //   req_id,
        //   product_id,
        //   status,
        //   true
        // )

      }

    })
    // ----- End verifyCode ----- //


    // ----- arrivedToUser ----- //
    socket.on("arrivedToUser", async (arg) => {

      const userRoom = `User${arg.user_id}`;
      console.log("userRoom", userRoom);

      var getuserForToken = await models.User.findOne(
        {
          where: {
            id: arg.user_id
          }
        }
      )

      const getProductId = await models.finalRequestByUser.findOne(
        {
          where: {
            user_id: arg.user_id,
            req_id: arg.req_id
          }
        }
      )

      const getProductValue = await models.StoreProduct.findOne(
        {
          where: {
            id: getProductId.product_id
          }
        }
      )

      var [updateStatusInAccepted] = await models.UserProductItemRequetAcceptedStore.update(
        {
          status: 8
        },
        {
          where: {
            user_id: arg.user_id,
            req_id: arg.req_id
          }
        }
      )
      console.log("updateStatusinFinalRequest:", updateStatusInAccepted);

      var [updateStatusinFinalRequest] = await models.finalRequestByUser.update(
        {
          status: 8
        },
        {
          where: {
            req_id: arg.req_id,
            driver_id: arg.driver_id
          }
        }
      );

      const responseData = {
        req_id: arg.req_id,
        user_id: arg.user_id,
        driver_id: arg.driver_id,
        status: 8
      };

      const getDriverData = await models.Driver.findOne(
        {
          where: {
            id: arg.driver_id
          }
        }
      )

      const registrationToken = getuserForToken.fcm_token;
      const title = "iAccess";
      let body = `${getDriverData.firstName} has arrived ${getuserForToken.firstName}`;
      const req_id = arg.req_id.toString();
      const product_id = getProductValue.product_id;
      const status = '8';

      io.to(userRoom).emit("arrivedAlertToUser", responseData);

      console.log("registrationToken24:", registrationToken);
      ayraFCM.sendPushNotificationFCM(
        registrationToken,
        title,
        body,
        req_id,
        product_id,
        status,
        true
      )

    })
    // ----- End arrivedToUser ----- //


    // ----- productGiveToUser ----- //
    socket.on("productGiveToUser", async (arg) => {

      // -- Generate Code 6 digit
      const code = Math.floor(100000 + Math.random() * 900000);
      console.log("code::", code);

      const getFinalRequestValue = await models.finalRequestByUser.findOne(
        {
          where: {
            req_id: arg.req_id,
            driver_id: arg.driver_id,
            user_id: arg.user_id
          }
        }
      );
      console.log("getFinalRequestValue::", getFinalRequestValue);

      // -- ifCodeIsInTable,CodeIsn'tGenerate -- //
      if (getFinalRequestValue.user_code == null) {

        var updateStatusInFinalRequestTable = await models.finalRequestByUser.update(
          {
            user_code: code
          },
          {
            where: {
              req_id: arg.req_id,
              driver_id: arg.driver_id,
              user_id: arg.user_id
            }
          }
        );
        console.log("updateStatusInFinalRequestTable:", updateStatusInFinalRequestTable);

        const getUserData = await models.User.findOne(
          {
            where: {
              id: arg.user_id
            }
          }
        )
        console.log("getUserData::", getUserData);

        const getFinalRequestData = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: arg.req_id,
              user_id: arg.user_id
            }
          }
        )

        if (updateStatusInFinalRequestTable[0] == 1) {
          const responseData = {
            status: 1,
            code: code
          }
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("giveProductToUser", responseData);

          // const registrationToken = getUserData.fcm_token;
          // const title = 'iAccess Notification';
          // const body = '';
          // const req_id = arg.req_id.toString();
          // const product_id = getFinalRequestData.product_id.toString();
          // const status = '1';

          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        } else {
          const responseData = {
            status: 0,
            code: code
          }
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("giveProductToUser", responseData);

          // const registrationToken = getUserData.fcm_token;
          // const title = 'iAccess Notification';
          // const body = '';
          // const req_id = arg.req_id.toString();
          // const product_id = getFinalRequestData.product_id.toString();
          // const status = '0';

          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        }

      } else {

        var updateStatusInFinalRequestTable = await models.finalRequestByUser.update(
          {
            user_code: getFinalRequestValue.user_code
          },
          {
            where: {
              req_id: arg.req_id,
              driver_id: arg.driver_id,
              user_id: arg.user_id
            }
          }
        );
        console.log("updateStatusInFinalRequestTable:", updateStatusInFinalRequestTable);

        const getUserData = await models.User.findOne(
          {
            where: {
              id: arg.user_id
            }
          }
        )
        console.log("getUserData::", getUserData);

        const getFinalRequestData = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: arg.req_id,
              user_id: arg.user_id
            }
          }
        )

        if (updateStatusInFinalRequestTable[0] == 1) {
          const responseData = {
            status: 1,
            code: getFinalRequestValue.user_code
          }
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("giveProductToUser", responseData);

          // const registrationToken = getUserData.fcm_token;
          // const title = 'iAccess Notification';
          // const body = '';
          // const req_id = arg.req_id.toString();
          // const product_id = getFinalRequestData.product_id.toString();
          // const status = '1';

          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        } else {
          const responseData = {
            status: 0,
            code: getFinalRequestValue.user_code
          }
          const userRoom = `User${arg.user_id}`;
          io.to(userRoom).emit("giveProductToUser", responseData);

          // const registrationToken = getUserData.fcm_token;
          // const title = 'iAccess Notification';
          // const body = '';
          // const req_id = arg.req_id.toString();
          // const product_id = getFinalRequestData.product_id.toString();
          // const status = '0';

          // ayraFCM.sendPushNotificationFCM(
          //   registrationToken,
          //   title,
          //   body,
          //   req_id,
          //   product_id,
          //   status,
          //   true
          // )

        }

      }


    })
    // ----- End productGiveToUser ----- //


    // ----- verifyCodeToUser ----- //
    socket.on("verifyCodeToUser", async (arg) => {

      var getFinalRequestTableData = await models.finalRequestByUser.findOne(
        {
          where: {
            req_id: arg.req_id,
            driver_id: arg.driver_id,
            user_id: arg.user_id
          }
        }
      );
      console.log("getFinalRequestTableData", getFinalRequestTableData);

      const verifyCodeData = getFinalRequestTableData.user_code == arg.user_code;
      console.log("verifyCodeData:", verifyCodeData);

      if (verifyCodeData == true) {

        var updateUserVerify = await models.finalRequestByUser.update(
          {
            user_verify: 1,
            status: 10
          },
          {
            where: {
              req_id: arg.req_id,
              driver_id: arg.driver_id,
              user_id: arg.user_id
            }
          }
        );
        console.log("updateUserVerify::", updateUserVerify);

        var driverStatusUpdate = await models.Driver.update(
          {
            isAvailable: 0
          },
          {
            where: {
              id: arg.driver_id
            }
          }
        );
        console.log("driverStatusUpdate::", driverStatusUpdate);

        var updateUserStatusInAcceptedTable = await models.UserProductItemRequetAcceptedStore.update(
          {
            status: 10
          },
          {
            where: {
              req_id: arg.req_id,
              user_id: arg.user_id
            }
          }
        )
        console.log("updateUserStatusInAcceptedTable::", updateUserStatusInAcceptedTable);

        // ----- forTransactionData ----- //
        var getFinalRequestTable = await models.finalRequestByUser.findOne(
          {
            where: {
              req_id: arg.req_id,
              user_id: arg.user_id
            }
          }
        )
        console.log("getFinalRequestTable::", getFinalRequestTable);

        var getUserData = await models.User.findOne(
          {
            where: {
              id: arg.user_id
            }
          }
        )
        console.log("getUserData::", getUserData);

        const getProductData = await models.StoreProduct.findOne(
          {
            where: {
              id: getFinalRequestTable.product_id
            }
          }
        )
        console.log("getProductData::", getProductData);

        // ----- deliveryPriceAmount ----- //

        const deliveryPrice = parseFloat(getFinalRequestTable.delivery_price);
        console.log("deliveryPrice::", deliveryPrice);
        const adminAmount = deliveryPrice * 25 / 100;
        console.log("adminAmount::", adminAmount);
        const driverAmount = deliveryPrice * 75 / 100;
        console.log("driverAmount::", driverAmount);

        // ----- End deliveryPriceAmount ----- //

        const getDriverData = await models.Driver.findOne(
          {
            where: {
              id: arg.driver_id
            }
          }
        );
        console.log("getDriverData:;", getDriverData);

        const totalPrice = parseFloat(getDriverData.wallet) + parseFloat(driverAmount);
        console.log("totalPrice::", totalPrice);

        const addMoneyToDriver = await models.Driver.update(
          {
            wallet: totalPrice
          },
          {
            where: {
              id: arg.driver_id
            }
          }
        );
        console.log("addMoneyToDriver::", addMoneyToDriver);

        const insertTransactionDetails = await models.Transaction.create(
          {
            req_id: arg.req_id,
            user_id: null,
            driver_id: arg.driver_id,
            product_id: getFinalRequestTable.product_id,
            store_id: null,
            delivery_price: driverAmount,
            admin_amount: adminAmount,
            total_delivery_price: deliveryPrice,
            transactions: deliveryPrice,
            type: 1,
            message: `${getUserData.firstName} paid for the ordered ${getProductData.product_title} and delivery fees is ${getFinalRequestTable.delivery_price}`
          }
        )
        console.log("insertTransactionDetails::", insertTransactionDetails);

        const insertAdminAmount = await models.adminAmount.create(
          {
            req_id: arg.req_id,
            type: 1,
            product_id: getProductData.id,
            admin_amount: adminAmount,
            comment: "Driver Payment"
          }
        )
        console.log("insertAdminAmount::", insertAdminAmount);
        // ----- End forTransactionData ----- //

        const responseStatusData = {
          responseStatus: 1,
          status: 10,
        }
        const userRoom = `User${arg.user_id}`;
        const driverRoom = `Driver${arg.driver_id}`;
        io.to(userRoom).emit("codeVerifiedToUser", responseStatusData);
        io.to(driverRoom).emit("verifyAlertToDriver", 1);



        // const registrationToken = getUserData.fcm_token;
        // const title = 'iAccess Notification';
        // const body = '';
        // const req_id = arg.req_id.toString();
        // const product_id = getFinalRequestTable.product_id.toString();
        // const status = '1';

        // ayraFCM.sendPushNotificationFCM(
        //   registrationToken,
        //   title,
        //   body,
        //   req_id,
        //   product_id,
        //   status,
        //   true
        // )

      } else {

        const responseStatusData = {
          responseStatus: 0,
          status: 10,
        }
        const userRoom = `User${arg.user_id}`;
        const driverRoom = `Driver${arg.driver_id}`;
        io.to(userRoom).emit("codeVerifiedToUser", responseStatusData);
        io.to(driverRoom).emit("verifyAlertToDriver", 0);

        // const registrationToken = getUserData.fcm_token;
        // const title = 'iAccess Notification';
        // const body = '';
        // const req_id = arg.req_id.toString();
        // const product_id = getFinalRequestTable.product_id.toString();
        // const status = '1';

        // ayraFCM.sendPushNotificationFCM(
        //   registrationToken,
        //   title,
        //   body,
        //   req_id,
        //   product_id,
        //   status,
        //   true
        // )

      }

    })
    // ----- End verifyCodeToUser ----- //


    // ----- sizeAvailability ----- //
    socket.on("sizeAvailability", async (arg) => {

      console.log("Ids------", arg.user_id, arg.store_id);

      var [getProduct] = await models.sequelize.query(
        `
        SELECT * FROM users_product_store_accepteds WHERE user_id = ${arg.user_id} AND store_id = ${arg.store_id} AND product_id = ${arg.product_id} AND size = "${arg.size}" AND status NOT IN (4,10)
        `
      )
      console.log("getProduct::", getProduct.length);

      const userRoom = `User${arg.user_id}`;

      if (getProduct.length == 0) {
        const response = {
          sizeAvailable: 1
        }
        io.to(userRoom).emit("isSize", response)
      } else {
        const response = {
          sizeAvailable: 0
        }
        io.to(userRoom).emit("isSize", response)
      }
    })
    // ----- End sizeAvailability ----- //


    // ----- sizeAvailableOnCart ----- //
    socket.on("sizeAvailableOnCart", async (arg) => {
      console.log("sizeAvailableOnCart-Data::", arg);

      var [getProduct] = await models.sequelize.query(
        `
        SELECT * FROM users_product_add_to_carts WHERE user_id = ${arg.user_id} AND store_id = ${arg.store_id} AND product_id = ${arg.product_id} AND size = "${arg.size}"
        `
      );

      const userRoom = `User${arg.user_id}`;

      if (getProduct.length == 0) {
        const response = {
          sizeAvailable: 1
        }
        io.to(userRoom).emit("isSizeOnCart", response)
      } else {
        const response = {
          sizeAvailable: 0
        }
        io.to(userRoom).emit("isSizeOnCart", response)
      }

    })
    // ----- End sizeAvailableOnCart ----- //


    // ----- cronJob ----- //
    socket.on("cronJob", async (arg) => {

      cron.schedule('*/5 * * * * *', async () => {
        console.log("INFO:-cronjob starting");
        var getRequestQueueData = await models.requestQueue.findAll(
          {
            where: {
              isCheck: 1
            }
          }
        );
        console.log("getRequestQueueData::", getRequestQueueData);

        const currentTimeData = `${new Date().toISOString().substring(0, 19)}.000Z`;
        console.log("currentTimeData:", currentTimeData);
        console.log("getRequestQueueData.end_timestamp::", getRequestQueueData[0].end_timestamp);
        const DBTime = getRequestQueueData[0].end_timestamp;
        const DBTimeId = getRequestQueueData[0].id;
        const startTimeStamp = DBTime.toISOString();
        const endTimeStamp = currentTimeData.toString();

        console.log("Same:::::", startTimeStamp == endTimeStamp);

        console.log("data:-:-:-:-:-", DBTime, DBTimeId, startTimeStamp, endTimeStamp);

        if (startTimeStamp <= endTimeStamp) {

          const updateRequestQueueData = await models.sequelize.query(
            `
              UPDATE
                requestQueues
              SET
                isCheck = 0
              WHERE
                id = ${DBTimeId}
            `
          );
          console.log("updateRequestQueueData::", updateRequestQueueData);

        } else {

          const DBTimeUserId = getRequestQueueData[0].user_id;
          const DBTimeStoreId = getRequestQueueData[0].store_id;
          const DBTimeProductId = getRequestQueueData[0].product_id;
          const DBTimeReqId = getRequestQueueData[0].req_id;

          const [userResponse] = await models.sequelize.query(
            `
                SELECT 
                  fcm_token
                FROM
                  users
                WHERE
                  id = ${DBTimeUserId}
            `
          );
          console.log("userResponse:", userResponse);

          var [storeData] = await models.sequelize.query(
            `
                SELECT 
                  store_address, store_lat, store_long
                FROM
                  stores
                WHERE
                  id = "${DBTimeStoreId}"
                `
          );
          console.log("storeData:", storeData);


          const [getStoreLatLong] = await models.sequelize.query(
            `
            SELECT stores.store_lat, stores.store_long, drivers.id,driver_request_reject_datas.req_id, 
            ( 
              100 * 
              acos(cos(radians(${storeData[0].store_lat})) *
              cos(radians(driver_lat)) *
              cos(radians(driver_long) - 
              radians(${storeData[0].store_long})) + 
              sin(radians(${storeData[0].store_lat})) * 
              sin(radians(driver_lat))) 
            )
            AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${DBTimeReqId}) GROUP BY drivers.id HAVING distance < 30;
            `
          );
          console.log("getStoreLatLong:", getStoreLatLong);

          if (getStoreLatLong[0] == undefined) {
            console.log("No Driver Found");
            return;
          }

          const [driverResponse] = await models.sequelize.query(
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
                  id = ${getStoreLatLong[0].id}
            `
          );
          console.log("driverResponse:=>", driverResponse);

          const [storeDataResponse] = await models.sequelize.query(
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
                  stores.id = ${DBTimeStoreId};
                `
          );
          console.log("storeDataResponse::=>", storeDataResponse);

          const [productResponse] = await models.sequelize.query(
            `
                SELECT
                  product_title,
                  product_photo
                FROM
                  products
                WHERE
                  id = ${DBTimeProductId}
                `
          );
          console.log("productResponse:=>", productResponse);

          const [getDeliveryPrice] = await models.sequelize.query(
            `
            SELECT
              delivery_price,
              status,
              store_code,
              store_verify,
              user_code,
              user_verify,
              drop_location_address,
              note_number,
              note_desc
            FROM
              final_request_by_users
            WHERE
              req_id = ${DBTimeReqId}
            `
          );
          console.log("getDeliveryPrice:", getDeliveryPrice);

          // ----- forProductData -----
          var requestProductDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
            {
              where: {
                user_id: arg.user_id,
                store_id: arg.store_id,
                req_id: arg.store_id
              }
            }
          );
          console.log("cronJobRequestData::", requestProductDataArr);

          const productDataMultiValueArr = [];
          for (const productDataArr of requestProductDataArr) {

            var [productDataValueArr] = await models.sequelize.query(
              `
              SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
              `
            );

            var [productGalleryDataArr] = await models.sequelize.query(
              `
              SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
              `
            );

            const responseProductColorData = [
              {
                "name": productDataArr.color,
                "code": productDataArr.color
              }
            ]

            const responseProductSizeData = [
              {
                "size": productDataArr.size
              }
            ]

            const responseProductData = {
              productData: productDataValueArr[0],
              productColor: responseProductColorData,
              productSize: responseProductSizeData,
              productGallery: productGalleryDataArr
            }
            productDataMultiValueArr.push(responseProductData)
          }
          // ----- End forProductData -----


          // ----- deliveryPriceCaculation ----- //
          const totalDeliveryPrice = parseFloat(getDeliveryPrice[0].delivery_price) * 75 / 100;
          console.log("totalDeliveryPrice::", totalDeliveryPrice);
          // ----- End deliveryPriceCaculation ----- //


          const responseData = {
            req_id: DBTimeReqId,
            store_id: DBTimeStoreId,
            product_id: DBTimeProductId,
            user_id: DBTimeUserId,
            driver_id: getStoreLatLong[0].id,
            store_name: storeDataResponse[0].store_name,
            store_phone: storeDataResponse[0].phone,
            store_logo: storeDataResponse[0].store_logo,
            store_address: storeDataResponse[0].store_address,
            delivery_address: getDeliveryPrice[0].drop_location_address,
            store_lat: storeDataResponse[0].store_lat,
            store_long: storeDataResponse[0].store_long,
            cat_name: storeDataResponse[0].cat_name,
            product_title: productResponse[0].product_title,
            product_img: productResponse[0].product_photo,
            driver_img: driverResponse[0].driver_img,
            driver_lat: driverResponse[0].driver_lat,
            driver_long: driverResponse[0].driver_long,
            delivery_price: totalDeliveryPrice.toString(),
            status: getDeliveryPrice[0].status,
            isAvailable: driverResponse[0].isAvailable,
            note_number: getDeliveryPrice[0].note_number,
            note_desc: getDeliveryPrice[0].note_desc,
            store_verify: getDeliveryPrice[0].store_verify,
            store_code: getDeliveryPrice[0].store_code,
            user_verify: getDeliveryPrice[0].user_verify,
            user_code: getDeliveryPrice[0].user_code,
            time: 90,
            productDetails: productDataMultiValueArr
          };
          console.log("responseData:", responseData);

          let registrationToken = driverResponse[0].fcm_token;
          const title = "iAccess Driver";
          const body = "New request available to fulfill GO online";
          const req_id = DBTimeReqId.toString();
          const product_id = DBTimeProductId.toString();
          const driverRoom = `Driver${getStoreLatLong[0].id}`;
          const status = getDeliveryPrice[0].status.toString();

          console.log("sendNotificationFCM:=", registrationToken, title, body, req_id, product_id);

          io.to(driverRoom).emit("driverAssigned", responseData);

          console.log("registrationToken25:", registrationToken);
          ayraFCM.sendPushNotificationFCM(
            registrationToken,
            title,
            body,
            req_id,
            product_id,
            status,
            true
          )

          const updateDriverStatus = await models.Driver.update(
            {
              isAvailable: 2
            },
            {
              where: {
                id: getStoreLatLong[0].id
              }
            }
          );
          console.log("cronJobDriver::", updateDriverStatus);

          const finalRequestByUser = await models.finalRequestByUser.update(
            {
              driver_id: getStoreLatLong[0].id
            },
            {
              where: {
                req_id: DBTimeReqId
              }
            }
          );

          const getDriverTimeStamp = await models.finalRequestByUser.findOne(
            {
              where: {
                driver_id: getStoreLatLong[0].id
              }
            }
          );


          // --- updateDriverFunction ---
          console.log("BeforeFunction3");
          async function updateDriver() {

            const findDataInDriverQueue = await models.DriverQueues.findOne(
              {
                where: {
                  driver_id: getStoreLatLong[0].id,
                  product_id: arg.product_id,
                  req_id: arg.req_id
                }
              }
            );
            console.log("cronJobFindDataInDriverQueue", findDataInDriverQueue);

            if (findDataInDriverQueue == null) {
              const createDriverQueue = await models.DriverQueues.create(
                {
                  req_id: arg.req_id,
                  user_id: arg.user_id,
                  product_id: arg.product_id,
                  driver_id: getStoreLatLong[0].id,
                  store_id: arg.store_id,
                }
              )
              console.log("createDriverQueue:", createDriverQueue);
            } else {

              const getAfterDriverCount = await models.DriverQueues.findOne(
                {
                  where: {
                    req_id: arg.req_id,
                    product_id: arg.product_id,
                    driver_id: getStoreLatLong[0].id
                  }
                }
              );
              console.log("3AfterUpdatation::", getAfterDriverCount);
              console.log("3DriverCount::", getAfterDriverCount.driver_count);

              if (getAfterDriverCount.driver_count >= 2) {

                const addRejectTable = await models.DriverRequestRejectData.create(
                  {
                    req_id: arg.req_id,
                    product_id: arg.product_id,
                    driver_id: getStoreLatLong[0].id
                  }
                );
                console.log("3addRejectTable::", addRejectTable);

                const deleteDriverQueueData = await models.sequelize.query(
                  `
                  DELETE FROM driverQueues WHERE req_id = ${arg.req_id} AND driver_id = ${getStoreLatLong[0].id}
                  `
                );
                console.log("deleteDriverQueueData::", deleteDriverQueueData);

              } else {

                const getDriverCount = await models.DriverQueues.findOne(
                  {
                    where: {
                      req_id: arg.req_id,
                      product_id: arg.product_id,
                      driver_id: getStoreLatLong[0].id
                    }
                  }
                );
                let count = getDriverCount.driver_count + 1;
                console.log("count::", count);

                const updateDriverCount = await models.DriverQueues.update(
                  {
                    driver_count: count
                  },
                  {
                    where: {
                      req_id: arg.req_id,
                      product_id: arg.product_id,
                      driver_id: getStoreLatLong[0].id
                    }
                  }
                );
                console.log("updateDriverCount::", updateDriverCount);

              }

            }

            const [driverResponse] = await models.sequelize.query(
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
                        id = ${getStoreLatLong[0].id}
              `
            );
            console.log("driverResponse:=>", driverResponse);

            if (driverResponse[0].isAvailable == 2) {

              const getCountData = await models.DriverQueues.findOne(
                {
                  where: {
                    req_id: arg.req_id,
                    product_id: arg.product_id,
                    driver_id: getStoreLatLong[0].id
                  }
                }
              );

              var alertResponse;
              if (getCountData) {
                console.log("getCountData::", getCountData.driver_count);

                alertResponse = {
                  driver_id: getStoreLatLong[0].id,
                  req_id: arg.req_id,
                  count: getCountData.driver_count
                }

              }

              const driverRoom = `Driver${getStoreLatLong[0].id}`;
              io.to(driverRoom).emit("driverAlertTime", alertResponse);

              // --- rejectedRequest ---
              const [userResponse] = await models.sequelize.query(
                `
                      SELECT 
                        fcm_token
                      FROM
                        users
                      WHERE
                        id = ${arg.user_id}
                      `
              );

              const [storeData] = await models.sequelize.query(
                `
                      SELECT 
                        store_address, store_lat, store_long
                      FROM
                        stores
                      WHERE
                        id = "${arg.store_id}"
                      `
              );

              const [getStoreLatLong] = await models.sequelize.query(
                `
                  SELECT stores.store_lat, stores.store_long, drivers.id,driver_request_reject_datas.req_id, 
                  ( 
                    100 * 
                    acos(cos(radians(${storeData[0].store_lat})) *
                    cos(radians(driver_lat)) *
                    cos(radians(driver_long) - 
                    radians(${storeData[0].store_long})) + 
                    sin(radians(${storeData[0].store_lat})) * 
                    sin(radians(driver_lat))) 
                  )
                  AS distance FROM drivers JOIN stores left join driver_request_reject_datas on drivers.id = driver_request_reject_datas.driver_id LEFT JOIN driverQueues on driverQueues.driver_id = drivers.id WHERE store_name is not null AND drivers.status = 1 AND drivers.isAvailable = 0 and drivers.id not in (select driver_id from driver_request_reject_datas WHERE driver_request_reject_datas.req_id = ${arg.req_id}) GROUP BY drivers.id HAVING distance < 30 ORDER BY driverQueues.driver_count, distance;
                  `
              );
              console.log("3getStoreLatLong::", getStoreLatLong);

              const updateDriverData = await models.Driver.update(
                {
                  isAvailable: 0
                },
                {
                  where: {
                    id: getStoreLatLong[0].id
                  }
                }
              );
              console.log("Hello");
              console.log("updateDriverData:=>", updateDriverData);

              const finalRequestByUser = await models.finalRequestByUser.update(
                {
                  driver_id: null
                },
                {
                  where: {
                    req_id: arg.req_id
                  }
                }
              );

              if (getStoreLatLong[0] == undefined) {

                var [updateAcceptedTable] = await models.UserProductItemRequetAcceptedStore.update(
                  {
                    status: 4
                  },
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                );

                var addDataToRequestTable = await models.requestQueue.create(
                  {
                    req_id: arg.req_id,
                    store_id: arg.store_id,
                    user_id: arg.user_id,
                    product_id: arg.product_id,
                    start_timestamp: new Date(),
                    end_timestamp: new Date(Date.now() + 60 * 60 * 2 * 1000)
                  }
                );


                const userRoom = `User${arg.user_id}`;
                conststoreArr.fcm_tokenegistrationToken = userResponse[0].fcm_token;
                const title = "iAccess";
                const body = "There's no driver's available at the moment";
                const req_id = arg.req_id.toString();
                const product_id = arg.product_id.toString();
                const status = '1';
                console.log("room:=>", userRoom);
                conupdateDriver
                updateDriverole.log("userResponse:-", userResponse);

                io.to(userRoom).emit("noDriverFound", "Right Now No Driver Available In This Location");

                console.log("registrationToken26:", registrationToken);
                ayraFCM.sendPushNotificationFCM(
                  registrationToken,
                  title,
                  body,
                  req_id,
                  product_id,
                  status,
                  true
                )
                return;
              } else {

                const [driverResponse] = await models.sequelize.query(
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
                          id = ${getStoreLatLong[0].id}
                  `
                );
                console.log("driverResponse:=>", driverResponse);

                const driverRoom = `Driver${getStoreLatLong[0].id}`;

                const [storeDataResponse] = await models.sequelize.query(
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
                          stores.id = ${arg.store_id};
                        `
                );
                console.log("storeDataResponse::=>", storeDataResponse);

                const [productResponse] = await models.sequelize.query(
                  `
                        SELECT
                          product_title,
                          product_photo
                        FROM
                          products
                        WHERE
                          id = ${arg.product_id}
                        `
                );
                console.log("productResponse:=>", productResponse);

                const [getDeliveryPrice] = await models.sequelize.query(
                  `
                    SELECT
                      delivery_price,
                      status,
                      store_code,
                      store_verify,
                      user_code,
                      user_verify,
                      drop_location_address,
                      note_number,
                      note_desc
                    FROM
                      final_request_by_users
                    WHERE
                      req_id = ${arg.req_id}
                    `
                );

                // ----- forProductData -----
                var requestProductDataArr = await models.UserProductItemRequetAcceptedStore.findAll(
                  {
                    where: {
                      user_id: arg.user_id,
                      store_id: arg.store_id,
                      req_id: arg.req_id
                    }
                  }
                );
                console.log("requestProductCronJobUpdate::", requestProductDataArr);

                const productDataMultiValueArr = [];
                for (const productDataArr of requestProductDataArr) {

                  var [productDataValueArr] = await models.sequelize.query(
                    `
                    SELECT t2.store_name, t2.store_photo, t1.* FROM products t1 JOIN stores t2 ON t1.store_id = t2.id WHERE t1.store_id = "${productDataArr.store_id}" AND t1.id = ${productDataArr.product_id}
                    `
                  );

                  var [productGalleryDataArr] = await models.sequelize.query(
                    `
                    SELECT product_img FROM productGalleries t1 WHERE t1.store_id=${productDataArr.store_id} AND product_id=${productDataArr.product_id} AND isActive = 1
                    `
                  );

                  const responseProductColorData = [
                    {
                      "name": productDataArr.color,
                      "code": productDataArr.color
                    }
                  ]

                  const responseProductSizeData = [
                    {
                      "size": productDataArr.size
                    }
                  ]

                  const responseProductData = {
                    productData: productDataValueArr[0],
                    productColor: responseProductColorData,
                    productSize: responseProductSizeData,
                    productGallery: productGalleryDataArr
                  }
                  productDataMultiValueArr.push(responseProductData)
                }
                // ----- End forProductData -----


                // ----- deliveryPriceCaculation ----- //
                const totalDeliveryPrice = parseFloat(getDeliveryPrice[0].delivery_pricem) * 75 / 100;
                // ----- End deliveryPriceCaculation ----- //


                const responseData = {
                  req_id: arg.req_id,
                  store_id: arg.store_id,
                  product_id: arg.product_id,
                  user_id: arg.user_id,
                  driver_id: getStoreLatLong[0].id,
                  store_name: storeDataResponse[0].store_name,
                  store_phone: storeDataResponse[0].phone,
                  store_logo: storeDataResponse[0].store_logo,
                  store_address: storeDataResponse[0].store_address,
                  delivery_address: getDeliveryPrice[0].drop_location_address,
                  store_lat: storeDataResponse[0].store_lat,
                  store_long: storeDataResponse[0].store_long,
                  cat_name: storeDataResponse[0].cat_name,
                  product_title: productResponse[0].product_title,
                  product_img: productResponse[0].product_photo,
                  driver_img: driverResponse[0].driver_img,
                  driver_lat: driverResponse[0].driver_lat,
                  driver_long: driverResponse[0].driver_long,
                  delivery_price: totalDeliveryPrice.toString(),
                  status: getDeliveryPrice[0].status,
                  isAvailable: driverResponse[0].isAvailable,
                  note_number: getDeliveryPrice[0].note_number,
                  note_desc: getDeliveryPrice[0].note_desc,
                  store_verify: getDeliveryPrice[0].store_verify,
                  store_code: getDeliveryPrice[0].store_code,
                  user_verify: getDeliveryPrice[0].user_verify,
                  user_code: getDeliveryPrice[0].user_code,
                  time: 90,
                  productDetails: productDataMultiValueArr
                };

                let registrationToken = driverResponse[0].fcm_token;
                const title = "iAccess Driver";
                const body = "New request available to fulfill GO online";
                const req_id = arg.req_id.toString();
                const product_id = arg.product_id.toString();
                const status = getDeliveryPrice[0].status.toString();

                console.log("sendNotificationFCM:=", registrationToken, title, body, req_id, product_id);

                io.to(driverRoom).emit("driverAssigned", responseData);

                const isAvailableUpdate = await models.Driver.update(
                  {
                    isAvailable: 2
                  },
                  {
                    where: {
                      id: getStoreLatLong[0].id
                    }
                  }
                );

                const finalRequestByUser = await models.finalRequestByUser.update(
                  {
                    driver_id: getStoreLatLong[0].id
                  },
                  {
                    where: {
                      req_id: arg.req_id
                    }
                  }
                );

                console.log("registrationToken27:", registrationToken);
                ayraFCM.sendPushNotificationFCM(
                  registrationToken,
                  title,
                  body,
                  req_id,
                  product_id,
                  status,
                  true
                )
                setTimeout(updateDriver, 90000)
              }
            } else {
              console.log("Available:::");
            }
          }
          setTimeout(updateDriver, 90000)

          console.log("AfterFunction3");
        }
      });

    })
    // ----- End cronJob ----- //


    // ----- updateStatus ----- //
    socket.on("updateStatus", async (arg) => {

      let withdrawId = arg.withdraw_id;
      console.log("withdrawId::", withdrawId);

      const updateDate = await models.withdrawRequests.update(
        {
          status: arg.status
        },
        {
          where: {
            id: withdrawId
          }
        }
      );

      if (arg.status == 2) {

        var findWithdrawRequest = await models.withdrawRequests.findOne({
          where: {
            id: withdrawId,
          },
        });
        console.log("getDetailOfWithdraw:=---", findWithdrawRequest);

        const reason = arg.reason ? arg.reason : "";
        const message = `Your $${findWithdrawRequest.amount} transfer request has been cancelled because of ${reason} and your funds will reflect back into your wallet.`
        console.log("reason::", reason);

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

          if (getUserData) {

            const deductAmount = parseFloat(getUserData.walletAmount) + parseFloat(findWithdrawRequest.amount);
            console.log("deductAmount::", deductAmount);

            const insertTransaction = await models.Transaction.create({
              user_id: findWithdrawRequest.user_id,
              type: 2,
              message: message,
              transactions: parseFloat(findWithdrawRequest.amount),
              status: 16
            });

            const updateWallet = await models.sequelize.query(
              `
              UPDATE users SET walletAmount = ${deductAmount} WHERE id = ${findWithdrawRequest.user_id}
              `
            );

            const registrationToken = getUserData.fcm_token;
            const title = "Cancelled withdraw request";
            const body = `${getUserData.firstName} your request for $${findWithdrawRequest.amount} transfer has been cancelled because of ${reason}.`;
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

        }

        if (findWithdrawRequest.driver_id) {

          const getDriverData = await models.Driver.findOne({
            where: {
              id: findWithdrawRequest.driver_id
            }
          });
          console.log("getDriverData::", getDriverData);

          if (getDriverData) {

            const deductAmount = parseFloat(getDriverData.wallet) + parseFloat(findWithdrawRequest.amount);
            console.log("deductAmount::", deductAmount);

            const insertTransaction = await models.Transaction.create({
              driver_id: findWithdrawRequest.driver_id,
              type: 2,
              message: message,
              transactions: parseFloat(findWithdrawRequest.amount),
              status: 16
            });

            const updateWallet = await models.sequelize.query(
              `
            UPDATE drivers SET wallet = ${deductAmount} WHERE id = ${findWithdrawRequest.driver_id}
            `
            )

            const registrationToken = getDriverData.fcm_token;
            const title = "Cancelled withdraw request";
            const body = `${getDriverData.firstName} your request for $${findWithdrawRequest.amount} transfer has been cancelled because of ${reason}.`;
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

        }

        if (findWithdrawRequest.store_id) {

          const getStoreData = await models.Store.findOne({
            where: {
              id: findWithdrawRequest.store_id
            }
          });
          console.log("getStoreData::", getStoreData);

          if (getStoreData) {

            const deductAmount = parseFloat(getStoreData.wallet) + parseFloat(findWithdrawRequest.amount);
            console.log("deductAmount::", deductAmount);

            const insertTransaction = await models.Transaction.create({
              store_id: findWithdrawRequest.store_id,
              type: 2,
              message: message,
              transactions: parseFloat(findWithdrawRequest.amount),
              status: 16
            });

            const updateWallet = await models.sequelize.query(
              `
            UPDATE stores SET wallet = ${deductAmount} WHERE id = ${findWithdrawRequest.store_id}
            `
            )

            const registrationToken = getStoreData.fcm_token;
            const title = "Cancelled withdraw request";
            const body = `${getStoreData.store_name} your request for $${findWithdrawRequest.amount} transfer has been cancelled because of ${reason}.`;
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

        }

      }
      if (arg.status == 3) {

        var userName = '';
        var transfer_type = '';
        var acc_number = '';

        const reason = "Completed withdraw request";
        var findWithdrawRequest = await models.withdrawRequests.findOne({
          where: {
            id: withdrawId,
          },
        });
        console.log("getDetailOfWithdraw:=---", findWithdrawRequest);

        const getTransferData = await models.transferAccount.findOne({
          where: {
            id: findWithdrawRequest.transfer_acc_id
          }
        });
        console.log("getTransferData::", getTransferData);

        if (getTransferData != null) {
          if (getTransferData.transfer_type == 1) {
            transfer_type = 'Bank Transfer'
            acc_number = `Acct # ${getTransferData.acc_number}`;
          }

          if (getTransferData.transfer_type == 2) {
            transfer_type = 'Cash App Transfer'
            acc_number = getTransferData.cash_app_tag;
          }

          if (getTransferData.transfer_type == 3) {
            transfer_type = 'Zelle Transfer'
            acc_number = getTransferData.phone_number;
          }
        }

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

          if (getUserData) {

            const insertTransaction = await models.Transaction.create({
              user_id: findWithdrawRequest.user_id,
              type: 2,
              transactions: parseFloat(findWithdrawRequest.amount),
              message: `Withdrawal for $${findWithdrawRequest.amount} to ${getUserData.firstName} ${transfer_type} ${acc_number} has been completed`,
              status: 15
            });

            const registrationToken = getUserData.fcm_token;
            const title = "Completed withdraw request";
            const body = `${getUserData.firstName} your request for $${findWithdrawRequest.amount} transfer has been completed.Check your account to make sure it reflects.`
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

        }

        if (findWithdrawRequest.driver_id) {

          const getDriverData = await models.Driver.findOne({
            where: {
              id: findWithdrawRequest.driver_id
            }
          });
          console.log("getDriverData3::", getDriverData);

          if (getDriverData) {

            const insertTransaction = await models.Transaction.create({
              driver_id: findWithdrawRequest.driver_id,
              type: 2,
              transactions: parseFloat(findWithdrawRequest.amount),
              message: `Withdrawal for $${findWithdrawRequest.amount} to ${getDriverData.firstName} ${transfer_type} ${acc_number} has been completed`,
              status: 15
            });

            const registrationToken = getDriverData.fcm_token;
            const title = "Completed withdraw request";
            const body = `${getDriverData.firstName} your request for $${findWithdrawRequest.amount} transfer has been completed.Check your account to make sure it reflects.`
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

        }

        if (findWithdrawRequest.store_id) {

          const getStoreData = await models.Store.findOne({
            where: {
              id: findWithdrawRequest.store_id
            }
          });
          console.log("getStoreData3:::", getStoreData);

          if (getStoreData) {

            const insertTransaction = await models.Transaction.create({
              store_id: findWithdrawRequest.store_id,
              type: 2,
              transactions: parseFloat(findWithdrawRequest.amount),
              message: `Withdrawal for $${findWithdrawRequest.amount} to ${getStoreData.store_name} ${transfer_type} ${acc_number} has been completed`,
              status: 15
            });

            const registrationToken = getStoreData.fcm_token;
            const title = "Completed withdraw request";
            const body = `${getStoreData.store_name} your request for $${findWithdrawRequest.amount} transfer has been completed.Check your account to make sure it reflects.`
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

        }

      }

    })
    // ----- End updateStatus ----- //


    // ----- addWithdrawRequest ----- //
    socket.on("addWithdrawRequest", async (arg) => {

      var userName = '';
      var transfer_type = '';
      var acc_number = '';

      const createDriverQueue = await models.withdrawRequests.create(
        {
          user_id: arg.user_id,
          store_id: arg.store_id,
          driver_id: arg.driver_id,
          transfer_acc_id: arg.transfer_acc_id,
          amount: arg.amount,
          day_transfer: arg.day_transfer,
          withdraw_fee: arg.withdraw_fee
        }
      );
      console.log("createDriverQueue::", createDriverQueue);

      const getTransferData = await models.transferAccount.findOne({
        where: {
          id: arg.transfer_acc_id
        }
      });
      console.log("getTransferData::", getTransferData);

      if (getTransferData != null) {
        if (getTransferData.transfer_type == 1) {
          transfer_type = 'Bank Transfer'
          acc_number = `Acct # ${getTransferData.acc_number}`;
        }

        if (getTransferData.transfer_type == 2) {
          transfer_type = 'Cash App Transfer'
          acc_number = getTransferData.cash_app_tag;
        }

        if (getTransferData.transfer_type == 3) {
          transfer_type = 'Zelle Transfer'
          acc_number = getTransferData.phone_number;
        }
      }

      var getToken = await models.trasactionFCM.findOne();
      console.log("getToken::", getToken.fcm_token);

      if (arg.driver_id) {

        const findData = await models.Driver.findOne({
          where: {
            id: arg.driver_id
          }
        });
        userName = findData.firstName;
        console.log("findData-driver_id::", findData);
        console.log("wallet::", findData.wallet);

        const totalAmount = parseFloat(arg.amount);
        const deductAmount = parseFloat(findData.wallet) - totalAmount;
        console.log("deductAmount::", deductAmount);

        const updateWallet = await models.Driver.update(
          {
            wallet: deductAmount
          },
          {
            where: {
              id: arg.driver_id
            },
          }
        );

        const registrationToken = getToken.fcm_token;
        const title = "Withdraw Request";
        const body = `${findData.firstName} sent you withdraw request of amount ${arg.amount}`;
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

      if (arg.user_id) {

        const findData = await models.User.findOne({
          where: {
            id: arg.user_id
          }
        });

        userName = findData.firstName;

        console.log("findData-user_id::", findData);
        console.log("walletAmount", findData.walletAmount);

        const totalAmount = parseFloat(arg.amount);
        const deductAmount = parseFloat(findData.walletAmount) - totalAmount;
        console.log("deductAmount::", deductAmount, totalAmount);

        const updateWallet = await models.User.update(
          {
            walletAmount: deductAmount
          },
          {
            where: {
              id: arg.user_id
            },
          }
        );

        const registrationToken = getToken.fcm_token;
        const title = "Withdraw Request";
        const body = `${findData.firstName} sent you withdraw request of amount ${arg.amount}`;
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

      if (arg.store_id) {

        const findData = await models.Store.findOne({
          where: {
            id: arg.store_id
          }
        });
        console.log("arg.store_id", arg.store_id);
        userName = findData.store_name;
        console.log("userName:::", userName);

        console.log("findData-store_id::", findData);
        console.log("wallet::", findData.wallet);

        const totalAmount = parseFloat(arg.amount);
        const deductAmount = parseFloat(findData.wallet) - totalAmount;
        console.log("deductAmount::", deductAmount);

        const updateWallet = await models.Store.update(
          {
            wallet: deductAmount
          },
          {
            where: {
              id: arg.store_id
            },
          }
        );

        const registrationToken = getToken.fcm_token;
        const title = "Withdraw Request";
        const body = `${findData.store_name} sent you withdraw request of amount ${arg.amount}`;
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
          user_id: arg.user_id,
          store_id: arg.store_id,
          driver_id: arg.driver_id,
          transactions: arg.amount,
          message: `Withdrawal for ${arg.amount} to ${userName} ${transfer_type} ${acc_number} has been completed`
        }
      );
      console.log("insertRefundMoney::", insertRefundMoney);

    })
    // ----- End addWithdrawRequest ----- //


    // ----- driverDemoSocket ----- //
    socket.on("test1", async (arg) => {

      var timeout_handles = []
      var i = arg.s_id;
      function set_time_out(id) /// wrapper
      {
        var combinedId = arg.req_id + d_id;
        if (id in combinedId) {
          clearTimeout(id)
        }



        timeout_handles[i] = setTimeout(() => {
          clearTimeout(timeout_handles[id])

          console.log("Inside", i);
          if (i != 3) {
            i++;
            set_time_out(i);
          }

        }, 5000, i)

        //timeout_handles[i] = setTimeout( set_time_out, 3000 ,i)
      }
      //timeout_handles[i] = setTimeout( set_time_out, 1000 ,i)
      timeout_handles[i] = setTimeout(() => {
        console.log("OutSide", i);
        set_time_out(i);
      }, 2000, i)

    })
    // ----- driverDemoSocket ----- //

    // test //

    socket.on("test2", async (arg) => {

      const storeRoom = `Store${arg.store_id}`;
      console.log("testSocket---2");
      async function testDemo(r_id, p_id, d_id) {
        console.log("===============================");
        console.log("test----2");
        console.log("===============================");

        io.to(storeRoom).emit("ontest2", `Test2---${r_id},${p_id},${d_id}`);
        // a = setTimeout(testDemo, 20000, 10, 20, 30)
        setTimeout(testDemo, 20000, 11, 22, 33)

      }

      console.log("outsideTest----2");
      // var a = setTimeout(testDemo, 20000, 10, 20, 30)
      setTimeout(testDemo, 20000, 11, 22, 33)
      // clearTimeout(a)

    })


    // ----- onAcceptFirstTime ----- //
    socket.on("onAcceptFirstTime", function (data) {
      const storeRoom = `Store${data.store_id}`;
      io.to(storeRoom).emit("onAcceptFirstTime", data);
    });
    // ----- End onAcceptFirstTime ----- //


    // ----- onFirstTimeRespFromStore ----- //
    socket.on("onFirstTimeRespFromStore", async (arg) => {
      const userRoom = `User${arg.user_id}`;

      //update store request
      const dataA = await models.UserProductItemRequetAcceptedStore.update(
        {
          status: arg.respStatus,
          // status: 1,
        },
        {
          where: {
            req_id: arg.reqId,
          },
        }
      );

      console.log("dataA==>", dataA);

      //deleted by request id 



      //deleted by request id 

      var storeIDProduct =
        await models.UserProductItemRequetAcceptedStore.findOne({
          where: {
            req_id: arg.reqId,
          },
        });

      const dataS = {
        reqId: arg.reqId,
        storeResponse: arg.respStatus,
        requestedResp: storeIDProduct,
      };

      console.log("dataS==>", dataS);
      //update store request

      if (arg.respStatus == 0) {
        console.log("Reject");

      } else {
        console.log("Accept");
        io.to(userRoom).emit("getFirstTimeRespFromStore", dataS);
      }


      //notification
      var storeArr = await models.Store.findOne({
        where: {
          id: storeIDProduct.store_id,
        },
      });

      var userArr = await models.User.findOne({
        where: {
          id: arg.user_id,
        },
      });

      //console.info(userArr);
      //return userArr;
      // console.log(arg);

      const registrationToken = userArr.fcm_token;

      // const registrationToken = 'epifzojmToi3DQEoSEoAdX:APA91bGiXuPS9hCMv6v2whaYQBsGJAVkNeId_XeKYAmfI-XxujKSRYx2gOBDRKtyUN4wUmTG1Ovvy-nKa4CTmCqKdmc9kLA7tKszOPXXH80OnQrvhlo48OEyOp7nHnfqI93tKrZ9-zs6';

      var productRecordArr = await models.StoreProduct.findOne({
        where: {
          id: storeIDProduct.product_id,
          store_id: storeIDProduct.store_id,
        },
      });
      let body = '';

      if (arg.respStatus == 0) {
        body = `${storeArr.store_name} has rejected your request for ${productRecordArr.product_title}`;
      } else {
        body = `${storeArr.store_name} has accepted your request for ${productRecordArr.product_title} please finalize your request`;
      }

      const title = "iAccess";
      // const body = `${ storeArr.store_name } accept your  ${ productRecordArr.product_title }`;

      const req_id = arg.reqId.toString();
      const product_id = productRecordArr.id.toString();

      const status = '1';

      console.log("registrationToken28:", registrationToken);
      ayraFCM.sendPushNotificationFCM(
        registrationToken,
        title,
        body,
        req_id,
        product_id,
        status,
        true
      );

      if (arg.respStatus == 0) {
        const dataA = await models.UserProductItemRequetAcceptedStore.destroy(
          {
            where: {
              req_id: arg.reqId,
            },
          }
        );
        console.log("dataAinDestroy==>", dataA);
        io.to(userRoom).emit("getFirstTimeRespFromStore", dataS);
      }


      //notification
    });

    // ----- End onFirstTimeRespFromStore ----- //



    //on product final request  by user and send response to store
    socket.on("onFinalRequestByUser", async (arg) => {
      //call by user

      var [userDetail] = await models.sequelize.query(
        `SELECT * from users  where id=${arg.user_id}`
      );
      const productColorArrData = [];
      const productSizeArrData = [];

      var [productDataArr] = await models.sequelize.query(
        `SELECT * from  products where id=${arg.product_id} and store_id="${arg.store_id}"`
      );

      var [productColorArr] = await models.sequelize.query(
        `SELECT t1.id,t2.attr_name from product_colors t1 join attributeValueMasters t2 on t1.color_id=t2.attr_value where t1.store_id=${arg.store_id} and t1.product_id=${arg.product_id} and t2.attr_id=1`
      );
      for (const productColor of productColorArr) {
        productColorArrData.push(productColor.attr_name);
      }
      var [productSizeArr] = await models.sequelize.query(
        `SELECT t1.id,t2.attr_name from product_sizes t1 join attributeValueMasters t2 on t1.size_id=t2.attr_value where t1.store_id=${arg.store_id} and t1.product_id=${arg.product_id} and t2.attr_id=2`
      );
      for (const productSize of productSizeArr) {
        productSizeArrData.push(productSize.attr_name);
      }
      var [productGalleryArr] = await models.sequelize.query(
        `SELECT product_img from productGalleries t1 where t1.store_id=${arg.store_id} and product_id=${arg.product_id}`
      );

      const productAll = {
        products: productDataArr,
        productsAttrColor: productColorArrData,
        productsAttrSize: productSizeArrData,
        productsAttrGallry: productGalleryArr,
      };

      const dataS = {
        reqId: arg.reqId,
        product_id: arg.product_id,
        productAll: productAll,
        store_id: arg.store_id,
        user_id: arg.user_id,
        latitude: arg.latitude,
        longitude: arg.longitude,
        location: arg.location,
        phone: arg.phone,
        note: arg.note,
        userDetail: userDetail,
      };

      const userRoom = `User${arg.user_id}`;
      const storeRoom = `Store${arg.store_id}`;
      io.to(userRoom).emit("onFinalRequestByUser", dataS); //emit to user back
      // io.to(storeRoom).emit("getFinalResponseFromUser", dataS); //emit to store
    });

    //on product final request  by user and send response to store
    socket.on("onFinalRespondFromStore", async (arg) => {
      //call by store
      const dataS = {
        reqId: arg.reqId,
        storeResponse: arg.respStatus,
      };
      const userRoom = `User${arg.user_id}`;
      io.to(userRoom).emit("getFinalRespondFromStore", dataS); //emit to
    });

    // Update Driver Lat And Long


    socket.on("updateDriverLatLongByDriverId", async (arg) => {

      const dataS = {
        driver_id: arg.driver_id,
        driver_lat: arg.driver_lat,
        driver_long: arg.driver_long
      };

      const driverRoom = `Driver${arg.driver_id}`;

      //update Driver request
      const dataA = await models.Driver.update(
        {

          driver_lat: arg.driver_lat,
          driver_long: arg.driver_long

        },
        {
          where: {
            id: arg.driver_id,
          },
        }
      );
      console.log("dataA==>", dataA);
      // io.to(driverRoom).emit("updateDriverLatLongByDriverId", dataS);
    });
  });

  //socket.io
  http.listen(4007, "0.0.0.0");

  // Set destination
  server.route({
    method: "POST",
    url: "/api/v1/updateUserAvatar",
    preHandler: server.multer.parser.single("profile_img"),
    handler: async function (req, reply) {
      // console.log(req.file.filename);
      // console.log(req.file.originalname);
      // console.log(req.file.path);
      //https://res.cloudinary.com/imajkumar/image/upload/w_150,h_100,c_fill/fastify-gallery/1computed-filename-using-request.png

      const results = await userAvatarUpdatechema.validateAsync(req.body);
      console.log(results);

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
        const userdata = await models.User.update(
          { avatar: req.file.path },
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
        let message_code = "UserController:resendUserOTP-03";
        let message_action =
          "Gender:1 Male 2:Female 3:Others | role:1=Admin 2:User:3:Store";

        const userData = {
          user_id: userDetails.id,
          phoneVerify: userDetails.id,
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

      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    },
  });

  /* UpdateProductImage */
  // server.route({
  //   method: "POST",
  //   url: "/api/v1/updateProductImage",
  //   preHandler: server.multer.parser.array("product_img", 8), // 5
  //   handler: async function (req, reply) {


  //     const dataAUp = await models.productGallery.update(
  //       {
  //         isActive: 2
  //       },
  //       {
  //         where: {
  //           product_id: req.body.product_id,
  //         },
  //       }
  //     );


  //     const urls = [];
  //     const files = req.files;

  //     for (const file of files) {
  //       // console.log(file.path);
  //       const resultsdata = await models.StoreProduct.findOne({
  //         where: { id: req.body.product_id },
  //       });


  //       // --- create data in product_gallery table ---
  //       // const data = await models.productGallery.create({
  //       //   product_id: req.body.product_id,
  //       //   store_id: resultsdata.store_id,
  //       //   product_img: file.path,
  //       // });

  //       // --- update product image in product_gallery table ---
  //       // const data = await models.productGallery.update(
  //       //   {
  //       //     product_id: req.body.product_id,
  //       //     store_id: resultsdata.store_id,
  //       //     product_img: file.path,
  //       //   }
  //       // )

  //       const updateImageData = await models.productGallery.update(
  //         {
  //           product_img: file.path
  //         }, {
  //         where: {
  //           product_id: req.body.product_id,
  //           store_id: resultsdata.store_id,
  //         }
  //       }
  //       )

  //     }
  //     const Imgdata = await models.productGallery.findAll({
  //       where: {
  //         product_id: req.body.product_id,
  //       },
  //     });


  //     const ImgdataOne = await models.productGallery.findOne({
  //       where: {
  //         product_id: req.body.product_id,
  //       },
  //     });


  //     //update product photo
  //     const dataA = await models.StoreProduct.update(
  //       {
  //         product_photo: ImgdataOne.product_img,
  //       },
  //       {
  //         where: {
  //           id: req.body.product_id,
  //         },
  //       }
  //     );

  //     //update product photo

  //     const ProductData = await models.StoreProduct.findOne({
  //       where: {
  //         id: req.body.product_id,
  //       },
  //     });


  //     const data = {
  //       product_id: ProductData.id,
  //       store_id: ProductData.store_id,
  //       product_title: ProductData.product_title,
  //       product_photo: ProductData.product_photo,
  //       product_qty: ProductData.product_qty,
  //       regular_price: ProductData.regular_price,
  //       selling_price: ProductData.selling_price,
  //       product_infomation: ProductData.product_infomation,
  //       productImg: Imgdata,
  //     };


  //     //https://res.cloudinary.com/imajkumar/image/upload/w_150,h_100,c_fill/fastify-gallery/1computed-filename-using-request.png

  //     let message = "list of products Gallery";
  //     let message_code = "UserController:resendUserOTP-01";
  //     let message_action = "product id is not exist";
  //     let api_token = "";
  //     return Api.setSuccessResponse(
  //       data,
  //       message,
  //       message_code,
  //       message_action,
  //       api_token
  //     );

  //     // request.file is the `avatar` file
  //     // request.body will hold the text fields, if there were any
  //   },
  // });
  /****** UpdateProductImage ******/

  // old update product image code
  server.route({
    method: "POST",
    url: "/api/v1/updateProductImage",
    preHandler: server.multer.parser.array("product_img", 5),
    handler: async function (req, reply) {

      // const dataAUp = await models.productGallery.update(
      //   {
      //     isActive:2
      //   },
      //   {
      //     where: {
      //       product_id: req.body.product_id,
      //     },
      //   }
      // );

      const dataAUp = await models.sequelize.query(
        `
          UPDATE
           productGalleries 
          SET
           isActive = 2 
          WHERE 
            product_id = ${req.body.product_id}
          `
      )

      // console.log(req.body.product_id);
      // console.log("dataAUp", dataAUp);

      const urls = [];
      const files = req.files;

      // console.log("file", files);
      // console.log(files[0], "<==");

      if (files[0]) {
        console.log("sakhfgasuwfbsiakj");
        var saveImageInProducts = await models.sequelize.query(
          `
              UPDATE
                products 
              SET
                product_photo = "${files[0].path}" 
              WHERE 
                id = ${req.body.product_id}
              `
        )

      }

      for (const file of files) {
        // console.log(file.path);
        const resultsdata = await models.StoreProduct.findOne({
          where: { id: req.body.product_id },
        });

        const data = await models.productGallery.create({
          product_id: req.body.product_id,
          store_id: resultsdata.store_id,
          product_img: file.path,
        });
      }
      const Imgdata = await models.productGallery.findAll({
        where: {
          product_id: req.body.product_id,
          isActive: 1
        },
      });

      // const ImgdataOne = await models.productGallery.findOne({
      //   where: {
      //     product_id: req.body.product_id,
      //   },
      // });

      //update product photo
      // const dataA = await models.StoreProduct.update(
      //   {
      //     product_photo: ImgdataOne.product_img,
      //   },
      //   {
      //     where: {
      //       id: req.body.product_id,
      //     },
      //   }
      // );
      //update product photo

      const ProductData = await models.StoreProduct.findOne({
        where: {
          id: req.body.product_id,
        },
      });

      const data = {
        product_id: ProductData.id,
        store_id: ProductData.store_id,
        product_title: ProductData.product_title,
        product_photo: ProductData.product_photo,
        product_qty: ProductData.product_qty,
        regular_price: ProductData.regular_price,
        selling_price: ProductData.selling_price,
        product_infomation: ProductData.product_infomation,
        productImg: Imgdata,
      };

      //https://res.cloudinary.com/imajkumar/image/upload/w_150,h_100,c_fill/fastify-gallery/1computed-filename-using-request.png

      let message = "list of products Gallery";
      let message_code = "UserController:resendUserOTP-01";
      let message_action = "product id is not exist";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    },
  });


  //upload backgroud images of store
  server.route({
    method: "POST",
    url: "/api/v1/updateStorePhoto",
    preHandler: server.multer.parser.single("store_photo"),
    handler: async function (req, reply) {
      console.log(req.file.filename);

      // console.log(req.file.originalname);
      //console.log(req.file.path);

      const photoPath = req.file.path;
      const userdata = await models.Store.update(
        { store_photo: photoPath },
        {
          where: {
            id: req.body.store_id,
          },
        }
      );

      var storeTimingData = await models.StoreTiming.findOne({
        where: {
          store_id: req.body.store_id,
        },
      });

      var storeCategory = await models.StoreCategory.findOne({
        where: {
          store_id: req.body.store_id
        }
      })

      const StoreTimeDetails = storeTimingData.get();

      const userDetails = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });

      const userData = {
        store_id: userDetails.id,
        deviceType: userDetails.deviceType,
        fcm_token: userDetails.fcm_token,
        phoneVerify: userDetails.phoneVerify,
        phoneCode: userDetails.phoneCode,
        phone: userDetails.phoneNumber,
        email: userDetails.email,
        cat_name: storeCategory.cat_name,
        store_lat: userDetails.store_lat,
        store_long: userDetails.store_long,
        store_photo: userDetails.store_photo,
        store_logo: userDetails.store_logo,
        store_name: userDetails.store_name,
        store_address: userDetails.store_address,
        city_name: userDetails.city_name,
        state_name: userDetails.state_name,
        country_name: userDetails.country_name,
        role: userDetails.role,
        securiy_pin: userDetails.securiy_pin,
        isActive: userDetails.isActive,
        createdAt: userDetails.createdAt,
        storetiming: StoreTimeDetails,
      };

      //https://res.cloudinary.com/imajkumar/image/upload/w_150,h_100,c_fill/fastify-gallery/1computed-filename-using-request.png

      let message = "No user id found";
      let message_code = "UserController:resendUserOTP-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setSuccessResponse(
        userData,
        message,
        message_code,
        message_action,
        api_token
      );

      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    },
  });

  //upload backgroud images of store
  // Upload route
  //upload logo images of store
  server.route({
    method: "POST",
    url: "/api/v1/updateStoreLogo",
    preHandler: server.multer.parser.single("store_logo"),
    handler: async function (req, reply) {
      // console.log(req.file.filename);
      // console.log(req.file.originalname);
      //console.log(req.file.path);
      const photoPath = req.file.path;
      const userdata = await models.Store.update(
        { store_logo: photoPath },
        {
          where: {
            id: req.body.store_id,
          },
        }
      );
      var data = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });

      //https://res.cloudinary.com/imajkumar/image/upload/w_150,h_100,c_fill/fastify-gallery/1computed-filename-using-request.png

      let message = "No user id found";
      let message_code = "UserController:resendUserOTP-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    },
  });
  //upload logo images of store

  //addd multiple images in store product
  server.route({
    method: "POST",
    url: "/api/v1/uploadProductImage",
    preHandler: server.multer.parser.array("product_img", 5),
    handler: async function (req, reply) {
      // console.log(req.file.filename);
      // console.log(req.file.originalname);
      //console.log(req.file.path);
      //productGallery

      const urls = [];
      const files = req.files;


      for (const file of files) {
        // console.log(file.path);
        const resultsdata = await models.StoreProduct.findOne(
          {
            where: {
              id: req.body.product_id
            },
          });

        console.log("resultsdata", resultsdata);

        const data = await models.productGallery.create({
          product_id: req.body.product_id,
          store_id: resultsdata.store_id,
          product_img: file.path,
        });
      }

      const Imgdata = await models.productGallery.findAll({
        where: {
          product_id: req.body.product_id,
        },
      });

      const ImgdataOne = await models.productGallery.findOne({
        where: {
          product_id: req.body.product_id,
        },
      });

      //update product photo
      const dataA = await models.StoreProduct.update(
        {
          product_photo: ImgdataOne.product_img,
        },
        {
          where: {
            id: req.body.product_id,
          },
        }
      );
      //update product photo

      const ProductData = await models.StoreProduct.findOne({
        where: {
          id: req.body.product_id,
        },
      });


      const data = {
        product_id: ProductData.id,
        store_id: ProductData.store_id,
        product_title: ProductData.product_title,
        product_photo: ProductData.product_photo,
        product_qty: ProductData.product_qty,
        regular_price: ProductData.regular_price,
        selling_price: ProductData.selling_price,
        product_infomation: ProductData.product_infomation,
        productImg: Imgdata,
      };

      //https://res.cloudinary.com/imajkumar/image/upload/w_150,h_100,c_fill/fastify-gallery/1computed-filename-using-request.png

      let message = "list of products Gallery";
      let message_code = "UserController:resendUserOTP-01";
      let message_action = "product id is not exist";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    },
  });
  //addd multiple images in store product

  // --- uploadDriverImage ---
  server.route({
    method: "POST",
    url: "/api/v1/uploadDriverImage",
    preHandler: server.multer.parser.single("driver_image"),
    handler: async function (req, reply) {
      const imagePath = req.file.path;
      console.log("imagePath:::", imagePath);

      const driverData = await models.Driver.update(
        {
          avatar: imagePath
        },
        {
          where: {
            id: req.body.driver_id
          }
        }
      );
      console.log("driverData::", driverData);

      const data = await models.Driver.findOne(
        {
          where: {
            id: req.body.driver_id
          }
        }
      );
      console.log("data::", data);

      let message = "upload driver avatar";
      let message_code = "load-modules:uploadDriverImage-01";
      let message_action = "set all data in driver table";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );
    }
  })
  // --- End uploadDriverImage ---

  // --- uploadVehicleImage ---
  server.route({
    method: "POST",
    url: "/api/v1/uploadVehicleImage",
    preHandler: server.multer.parser.single("vehicle_img"),
    handler: async function (req, reply) {
      const imagePath = req.file.path;

      const vehicleData = await models.Driver.update(
        {
          vehicle_img: imagePath
        },
        {
          where: {
            id: req.body.driver_id
          }
        }
      );

      const data = await models.Driver.findOne(
        {
          where: {
            id: req.body.driver_id
          }
        }
      );

      let message = "upload vehicle image";
      let message_code = "load-modules:uploadVehicleImage-01";
      let message_action = "set all data in driver table";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );

    }
  })
  // --- End uploadVehicleImage ---

  // --- uploadDriverLicence ---
  // server.route({
  //   method: "post",
  //   url: "/api/v1/uploadDriverLicence",
  //   preHandler: server.multer.parser.array("driver_licence", 5),
  //   handler: async function (req, reply) {
  //     console.log("files:::", req.file.filename);

  //     const urls = [];
  //     const files = req.files;
  //     console.log("files::", files);

  //     for (const file of files) {
  //       console.log("file::", file);
  //     }

  //   }
  // })

  server.route({
    method: "POST",
    url: "/api/v1/uploadDriverLicence",
    preHandler: server.multer.parser.array("driver_licence", 5),
    handler: async function (req, reply) {
      console.log("Files:::", req.files[0].path);
      console.log("Files-->:::", req.files[1].path);
      console.log("filedata::", req.files);
      // console.log(req.file.originalname);
      //console.log(req.file.path);
      //productGallery

      const urls = [];
      const files = req.files;
      console.log("thisOne::---:;", files[0].path);
      console.log("thisSecong::--::", files[1].path);

      const updateDriverImage = await models.Driver.update(
        {
          dri_licence_front: files[0].path,
          dri_licence_back: files[1].path
        },
        {
          where: {
            id: req.body.driver_id

          }
        }
      );
      console.log("req.body.driver_id::", req.body.driver_id);
      console.log("updateDriverImage:::", updateDriverImage);

      const getDriverData = await models.Driver.findOne({
        where: {
          id: req.body.driver_id
        }
      });
      console.log("getDriverData::", getDriverData);

      // for (const file of files) {
      //   console.log("file::", file);
      //   console.log("data::===>>>", file.path);
      // }

      const response = {
        driver_licence_front: getDriverData.dri_licence_front,
        driver_licence_back: getDriverData.dri_licence_back
      }

      let message = "Driver Lincence Uploaded";
      let message_code = "UserController:uploadDriverLicence-01";
      let message_action = "product id is not exist";
      let api_token = "";
      return Api.setSuccessResponse(
        response,
        message,
        message_code,
        message_action,
        api_token
      );

    },
  });

  // --- End uploadDriverLicence ---

  server.register(require("fastify-jwt"), {
    secret: "apptech@&%%PUY", // use .env for this
  });
  console.info("SETUP - JWT");
  server.register(require("./middleware/auth_middleware"));

  server.register(require("fastify-swagger"), {
    routePrefix: "/apidoc",
    swagger: {
      info: {
        title: "Test swagger",
        description: "testing the fastify swagger api",
        version: "0.1.0",
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info herR",
      },
      host: "localhost:4002",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [
        { name: "user", description: "User related end-points" },
        { name: "code", description: "Code related end-points" },
      ],
      definitions: {
        User: {
          type: "object",
          required: ["id", "email"],
          properties: {
            id: { type: "string", format: "uuid" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  });

  // console.info("SETUP - 1");
  // Request body parser
  //server.use(bodyParser.json())
  // server.use(bodyParser.urlencoded({ extended: false }))

  // // Request body cookie parser
  server.register(require("fastify-cookie"), {
    secret: "my-secret", // for cookies signature
    parseOptions: {}, // options for parsing cookies
  });
  // console.info("SETUP - 2");
  // // Static files folder
  // server.use(fastify.static(path.join(__dirname, '..', '..', 'public')))
  server.register(require("fastify-static"), {
    root: path.join(__dirname, "..", "..", "public"),
    prefix: "/public/", // optional: default '/'
  });
  // console.info("SETUP - 3");
  // // HTTP logger

  // console.info("SETUP - 3");
}
