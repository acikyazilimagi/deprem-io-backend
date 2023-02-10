const fastify = require("fastify");
const cors = require("@fastify/cors");
const autoload = require("@fastify/autoload");
const path = require("path");
const config = require("../config.js");
const cache = require("../cache.js");

const cacheRoutes = require("../routes/cache");

const mongoose = require("mongoose");

module.exports = function () {
  const app = fastify({
    trustProxy: true,
  });

  app.register(require("@fastify/swagger"), {
    openapi: {
      info: {
        title: "Deprem.io API",
        description: "testing the fastify swagger api",
        version: "1.0.0",
      },
      servers: [{ url: `http://localhost:${config.port}`, variables: {} }],
      tags: [
        {
          name: "main",
          description: "main routes",
        },
      ],
    },
    prefix: "docs",
  });

  app.register(require("@fastify/swagger-ui"), {
    routePrefix: "docs",
    uiConfig: {
      docExpansion: "full",
    },
  });

  app.register(cors);

  app.decorate("mongoose", mongoose);
  app.decorate("cache", cache);

  app.register(autoload, {
    dir: path.join(__dirname, "../routes/controllers"),
  });

  cacheRoutes(app);

  return app;
};
