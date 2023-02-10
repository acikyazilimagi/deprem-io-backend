const fastify = require("fastify");
const cors = require("@fastify/cors");
const config = require("../config.js");
const cache = require("../cache.js");

const mainRoutes = require("../routes/urls");
const cacheRoutes = require("../routes/cache");

const mongoose = require("mongoose");

module.exports = function () {
  const app = fastify({
    trustProxy: true,
  });
  app.register(cors);

  mainRoutes(app);
  cacheRoutes(app);

  app.decorate("mongoose", mongoose);
  app.decorate("cache", cache);

  return app;
};
