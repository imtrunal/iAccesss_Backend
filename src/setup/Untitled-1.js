 //-storageUser
 const storageUser = multer.diskStorage({
    destination: path.join(
      __dirname,
      "..",
      "..",
      "filestorage",
      "images",
      "uploads"
    ),

    filename: async function (request, file, callback) {
      // console.log(request.body.name);
     
      const strFilename = '565'
        .replace(/\s+/g, "-")
        .toLowerCase();

      callback(
        null,
        strFilename + "-user-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
//--storageUser
//-storageStoreLogoPhoto
const storageStoreLogoPhoto = multer.diskStorage({
  destination: path.join(
    __dirname,
    "..",
    "..",
    "filestorage",
    "images",
    "uploads"
  ),

  filename: async function (request, file, callback) {
    var users = await models.Store.findOne({
      where: {
        id: request.body.store_id,
      },
    });

    const userDetails = users.get();
    const strFilename = userDetails.username
      .replace(/\s+/g, "-")
      .toLowerCase();
      if (file.fieldname === "photo") { 
        callback(
          null,
          strFilename + "-photo-" + Date.now() + path.extname(file.originalname)
        );
      }
      if (file.fieldname === "logo") { 
        callback(
          null,
          strFilename + "-logo-" + Date.now() + path.extname(file.originalname)
        );
      }

   
  },
});

//--storageStoreLogoPhoto
  //storageStoreLogo
  const storageStoreLogo = multer.diskStorage({
    destination: path.join(
      __dirname,
      "..",
      "..",
      "filestorage",
      "images",
      "uploads"
    ),

    filename: async function (request, file, callback) {
      // console.log(request.body.name);
      var users = await models.Store.findOne({
        where: {
          id: request.body.store_id,
        },
      });

      const userDetails = users.get();
      const strFilename = userDetails.store_name
        .replace(/\s+/g, "-")
        .toLowerCase();

      callback(
        null,
        strFilename + "-logo-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  //storageStoreLogo

  const storageStore = multer.diskStorage({
    destination: path.join(
      __dirname,
      "..",
      "..",
      "filestorage",
      "images",
      "uploads"
    ),

    filename: async function (request, file, callback) {
      // console.log(request.body.name);
      
      
      callback(
        null,
        "-store-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({ storage: storageUser });
  const uploadStore = multer({ storage: storageStore });
  const uploadStoreLogo = multer({ storage: storageStoreLogo });
  const uploadStoreLogoPhoto = multer({ storage: storageStoreLogoPhoto });

  server.register(multer.contentParser);
  //upload logo and store single photo 
  server.route({
    method: 'POST',
    url: '/api/v2/uploadStoreLogoWithSinglePhoto',
    preHandler: uploadStoreLogoPhoto.fields([{ name: 'photo', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
    handler: async function (req, reply) {
      //console.log(req.files['photo'][0].filename);
      var stores = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });
      if (!stores) {
        let message = "No store id found";
        let message_code = "LoadModules:uploadStoreLogoWithSinglePhoto-01";
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
      

        const userdata = await models.Store.update(
          { 
            store_logo: req.files['logo'][0].filename,
            store_photo: req.files['photo'][0].filename,
           },
          {
            where: {
              id: req.body.store_id,
            },
          }
        );
       
    
        

        var storeData = await models.Store.findOne({
          where: {
            id: req.body.store_id,
          },
        });
        var storeTimingData = await models.StoreTiming.findOne({
          where: {
            store_id: req.body.store_id,
          },
        });
        const userDetails = storeData.get();
        const StoreTimeDetails = storeTimingData.get();

        let message = "Stores Detail";
        let message_code = "LoadModules:uploadStoreLogoWithSinglePhoto-03";
        let message_action = "";

        const userData = {
          store_id: userDetails.id,
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

        return Api.setSuccessResponse(
          userData,
          message,
          message_code,
          message_action
        );
      }
      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    }


  });
  //upload logo and store single photo 

  server.route({
    method: "POST",
    url: "/api/v1/updateUserAvatar",
    preHandler: upload.single("profile_img"),
    handler: async function (req, reply) {
      //console.log(req.file.filename);
      cloudinary.uploader.upload(req.files.upload.path, result => {
        console.log(result);
      });
      var users = await models.User.findOne({
        where: {
          id: 1
        },
      });
      //update 
     

      
      //update 
      let message = "No user id found";
      let message_code = "UserController:resendUserOTP-01";
      let message_action = "username is not exist";
      let api_token = "";
      return Api.setWarningResponse(
        users,
        message,
        message_code,
        message_action,
        api_token
      );
      // request.file is the `avatar` file
      // request.body will hold the text fields, if there were any
    },
  });
  //setStoreImage
  server.route({
    method: "POST",
    url: "/api/v1/setStoreImage",
    preHandler: uploadStore.single("store_back_img"),
    handler: async function (req, reply) {
      console.log(req.file.filename);
      var stores = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });
      if (!stores) {
        let message = "No store id found";
        let message_code = "LoadModules:setStoreImage-01";
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
        const userdata = await models.Store.update(
          { store_photo: req.file.filename },
          {
            where: {
              id: req.body.store_id,
            },
          }
        );
        var stores = await models.Store.findOne({
          where: {
            id: req.body.store_id,
          },
        });

        const userDetails = stores.get();

        let message = "Stores Detail";
        let message_code = "LoadModules:resendUserOTP-03";
        let message_action = "";

        const userData = {
          store_id: userDetails.id,
          phoneVerify: userDetails.phoneVerify,
          phone: userDetails.phone,
          email: userDetails.email,
          store_photo: userDetails.store_photo,
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
  server.route({
    method: "POST",
    url: "/api/v1/setStoreLogo",
    preHandler: uploadStoreLogo.single("store_logo"),
    handler: async function (req, reply) {
      console.log(req.file.filename);
      var stores = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });
      if (!stores) {
        let message = "No store id found";
        let message_code = "LoadModules:setStoreImage-01";
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
        const userdata = await models.Store.update(
          { store_logo: req.file.filename },
          {
            where: {
              id: req.body.store_id,
            },
          }
        );
        var stores = await models.Store.findOne({
          where: {
            id: req.body.store_id,
          },
        });

        const userDetails = stores.get();

        let message = "Stores Detail";
        let message_code = "LoadModules:resendUserOTP-03";
        let message_action = "";

        const userData = {
          store_id: userDetails.id,
          phoneVerify: userDetails.phoneVerify,
          phone: userDetails.phone,
          email: userDetails.email,
          store_photo: userDetails.store_photo,
          store_logo: userDetails.store_logo,
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
  //setStoreImage

  server.route({
    method: "POST",
    url: "/api/v1/editStoreDetailsA",
    preHandler: uploadStore.single("store_back_img"),
    handler: async function (req, reply) {
      console.log(req.file.filename);
      var stores = await models.Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });
      if (!stores) {
        let message = "No store id found";
        let message_code = "LoadModules:setStoreImage-01";
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
        const userdata = await models.Store.update(
          { store_photo: req.file.filename },
          {
            where: {
              id: req.body.store_id,
            },
          }
        );
        var stores = await models.Store.findOne({
          where: {
            id: req.body.store_id
          },
        });
        

        const userDetails = stores.get();

        let message = "Stores Detail";
        let message_code = "LoadModules:resendUserOTP-03";
        let message_action = "";

        const userData = {
          store_id: userDetails.id,
          phoneVerify: userDetails.phoneVerify,
          phone: userDetails.phone,
          email: userDetails.email,
          store_photo: userDetails.store_photo,
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
  //fastify.post("/editStoreDetails", { handler: editStoreDetails });