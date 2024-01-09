import bcrypt from "bcrypt";
const fastify = require("fastify")();
const jwt = require("fastify-jwt");
import models from "../../../setup/models";
import serverConfig from "../../../config/server.json";
import * as Api from "../../../setup/ApiResponse";
import path from "path";
import multer from "multer";
import { date } from "joi";
const { AuthSchema, LoginSchema, UserVerifySchema } = require("./userValidate");
const SendOtp = require("sendotp");
const moment = require("moment");
const sendOtp = new SendOtp("332533AhDBihu7o608ce1a0P1");
// Set destination
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "public", "images", "uploads"),

  filename: function (request, file, callback) {
    callback(

      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const Jimp = require("jimp");

var randtoken = require("rand-token");

//saveIMG
//saveIMG
exports.saveIMG = async (request, response) => {
  const IMGPATH = `${serverConfig.server_url}/public/images/uploads/avatar-1631860583391.png`;

  const image = await Jimp.read(IMGPATH);

  // resizes the image to width 150 and heigth 150.
  await image.resize(600, 600);
  const newpath = "public/images/uploads/" + `resize_${Date.now()}_150x150.png`;
  // saves the image on the file system
  await image.writeAsync(newpath);
  const NEWIMGPATH = `${serverConfig.server_url}/` + newpath;
  return NEWIMGPATH;
};
//getUserDetail
exports.getUserDetail = async (req, reply) => {
  try {
    console.log(req.query.userId);

    var users = await models.User.findOne({
      where: {
        id: req.query.userId,
      },
    });

    let message = "User Details ";
    let message_code = "UserController:userLogin-01";
    let message_action = "";
    let api_token = "";
    return Api.setSuccessResponse(
      users,
      message,
      message_code,
      message_action,
      api_token
    );

    // let data=data;
  } catch (err) {
    let message = "opps";
    let message_code = "UserController:getAll-01";
    let message_action = "";
    let api_token = "";
    return Api.setErrorResponse(
      err,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};
//getUserDetail

//userRegister
exports.userRegister = async (req, reply) => {
  try {
    var users = await models.User.findOne({
      where: {
        phone: req.body.phone,
      },
    });

    if (!users) {
      const passwordHashed = await bcrypt.hash(
        req.body.password,
        serverConfig.saltRounds
      );

      const data = await models.User.create({
        phone: req.body.phone,
        firstName: req.body.name,
        email: req.body.email,
        password: passwordHashed,
        role: req.body.role,
      });

      let message = "user Created ";
      let message_code = "UserController:OTP-01";
      let message_action = "Get back to login or Get started screen";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );
    } else {
      var data = await models.User.findOne({
        where: {
          phone: req.body.phone,
        },
      });

      let message = "User Details ";
      let message_code = "UserController:userLogin-01";
      let message_action = "";
      let api_token = "";
      return Api.setSuccessResponse(
        data,
        message,
        message_code,
        message_action,
        api_token
      );
    }

    // let data=data;
  } catch (err) {
    let message = "opps";
    let message_code = "UserController:getAll-01";
    let message_action = "";
    let api_token = "";
    return Api.setErrorResponse(
      err,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//userLogin
exports.userLogin = async (req, reply) => {
  try {
    const results = await LoginSchema.validateAsync(req.body);
    //say.sayHi('ajay');

    var users = await models.User.findOne({
      where: {
        phone: results.phone,
      },
    });
    if (!users) {
      let message = "No Phone found";
      let message_code = "UserController:Err";
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
      // check password and login
      const userDetails = users.get();
      const passwordMatch = await bcrypt.compare(
        results.password,
        userDetails.password
      );
      if (!passwordMatch) {
        let message = "Invalid credential";
        let message_code = "UserController:passwordMatch-01";
        let message_action = "Ask again password ";
        let api_token = "";
        return Api.setWarningResponse(
          users,
          message,
          message_code,
          message_action,
          api_token
        );
      } else {
        const { email, id, password } = userDetails;
        const token = await reply.jwtSign(
          {
            email,
            id,
            password,
          },
          {
            expiresIn: 86400,
          }
        );
        let message = "User Detail with token";
        let message_code = "UserController:userLogin-01";
        let message_action = "";

        const data = { data: userDetails, token: token };
        return Api.setSuccessResponse(
          data,
          message,
          message_code,
          message_action
        );
      }
    }

    // let data=data;
  } catch (err) {
    let message = "opps";
    let message_code = "UserController:Err";
    let message_action = "";
    let api_token = "";
    return Api.setErrorResponse(
      err,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

//userLogin

exports.getAllUser = async (req, reply) => {
  try {
    var data = await models.User.findAll();
    //say.sayHi('ajay');
    let message = "Show all user data";
    let message_code = "UserController:getAll-01";
    let message_action = "";
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    let message = "Show all user data";
    let message_code = "UserController:getAll-01";
    let message_action = "";
    let api_token = "";
    return Api.setErrorResponse(
      err,
      message,
      message_code,
      message_action,
      api_token
    );
  }
};

exports.saveUser = async (req, reply) => {
  try {
    const results = await AuthSchema.validateAsync(req.body);
    console.log(results);
    const user = await models.User.create(results);
    const data = await models.User.findByPk(user.id); //say.sayHi('ajay');
    let message = "Show all user data";
    let message_code = "UserController:getAll-01";
    let message_action = req.body.name;
    let api_token = "";
    return Api.setSuccessResponse(
      data,
      message,
      message_code,
      message_action,
      api_token
    );
  } catch (err) {
    if (err.isJoi == true) {
      let message = "Invalid Input";
      let message_code = "UserController:saveUser-01";
      let message_action = "";
      let api_token = "";
      return Api.setErrorResponse(
        err,
        message,
        message_code,
        message_action,
        api_token
      );
    }
  }
};
