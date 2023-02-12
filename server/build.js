const fastify = require("fastify");
const IORedis = require("ioredis");
const cors = require("@fastify/cors");
const autoload = require("@fastify/autoload");
const path = require("node:path");
const config = require("../config.js");
const cacheDecorator = require("../cacheDecorator");

const cacheRoutes = require("../routes/cache");

const mongoose = require("mongoose");
const SEGMENT = "cache";

module.exports = function () {
  const app = fastify({
    logger: { level: "info" },
    trustProxy: true,
    ignoreTrailingSlash: true,
    disableRequestLogging: true,
  });

  if (config.redisUrl.length === 0) {
    // TODO Fix this poor implementation
    config.redisUrl = process.env.REDIS_URL;
    if (config.redisUrl.length === 0) {
      throw new Error("REDIS_URL is missing from .env");
    }
  }

  const redis = new IORedis(config.redisUrl);
  const abcache = require("abstract-cache")({
    useAwait: true,
    driver: {
      name: "abstract-cache-redis",
      options: {
        client: redis,
        segment: SEGMENT,
      },
    },
  });

  app.register(require("@fastify/redis"), { client: redis });
  app.register(require("@fastify/caching"), {
    cache: abcache,
  });

  cacheDecorator(app, SEGMENT);

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

  app.register(autoload, {
    dir: path.join(__dirname, "../routes/controllers"),
  });

  cacheRoutes(app);

  return app;
};
