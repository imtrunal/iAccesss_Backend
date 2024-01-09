const SendOtp = require("sendotp");

const sendOtp = new SendOtp("332533AhDBihu7o608ce1a0P1");

async function routes(fastify, options) {
  fastify.get("/", async function (request, reply) {
    return { API: "api/v1" };
  }),
    fastify.get("/", async function (request, reply) {
      return { hello: "world" };
    }),
    fastify.get("/send", async function (request, reply) {
      sendOtp.send("7703886088", "PRIIND", "4635", function (error, data) {
        console.log(data);
      });
      sendOtp.retry("917703886088", true, function (error, data) {
        console.log(data);
      });

      return { hello: "world" };
    }),
    fastify.get("/login", async function (request, reply) {
      sendOtp.send("7703886088", "PRIIND", "4635", function (error, data) {
        console.log(data);
      });
      sendOtp.retry("917703886088", true, function (error, data) {
        console.log(data);
      });

      return { hello: "world" };
    });
}

module.exports = routes;
