const fastify = require("fastify"); //Bring in Fastify
const server = fastify({
  logger: true,
});   

import setupLoadModules from "./setup/load-modules";
import setupStartServer from "./setup/start-server";
setupLoadModules(server);
setupStartServer(server);

