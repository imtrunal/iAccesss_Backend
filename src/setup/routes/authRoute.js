import {
  userRegister,
  userLogin,
  getUserDetail,
} from "../../modules/user/controllers/UserController";

async function routes(fastify, options) {
  fastify.post("/login", { handler: userLogin });
  fastify.post("/register", { handler: userRegister });
  fastify.get("/users/:userId", { handler: getUserDetail }); //this is
}

module.exports = routes;
