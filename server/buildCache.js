const IORedis = require("ioredis");
const config = require("../config.js");
const cacheDecorator = require("../cacheDecorator");

const SEGMENT = "cache";

/**
 *
 * @param {FastifyInstance} fastifyInstance
 * @returns boolean
 */
async function registerRedis(fastifyInstance) {
  if (config.redisUrl === undefined || config.redisUrl?.length === 0) return false;
  const redis = new IORedis(config.redisUrl);
  try {
    await redis.connect();
  } catch (error) {
    return false;
  }
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
  fastifyInstance.register(require("@fastify/redis"), { client: redis });
  fastifyInstance.register(require("@fastify/caching"), {
    cache: abcache,
  });
  cacheDecorator(fastifyInstance, SEGMENT);
}

function registerNodeCache(fastifyInstance) {
  const abcache = require("abstract-cache")({
    useAwait: true,
    driver: {
      options: {
        segment: SEGMENT,
      },
    },
  });
  fastifyInstance.register(require("@fastify/caching"), {
    cache: abcache,
  });
  cacheDecorator(fastifyInstance, SEGMENT);
}

/**
 *
 * @param {FastifyInstance} fastifyInstance
 */
module.exports = async function (fastifyInstance) {
  if (await registerRedis(fastifyInstance)) return;
  registerNodeCache(fastifyInstance);
};
