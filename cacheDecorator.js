/**
 * @param {FastifyInstance} fastify
 * @param {string} segmentName
 */
module.exports = function (fastify, segmentName) {
  fastify.decorate("selectiveFlush", async function (prefix) {
    // this is a blocking operation in redis.
    // should eventually be replaced with having a separate redis instance and flushing it all
    const keys = await fastify.cache.keys(`${prefix}*`);
    fastify.log.info(`flushing keys ${prefix}* ${JSON.stringify(keys)}`);
    // cache exposes a method that deletes a single key asynchronously.
    // using that would be terrible for node performance ad medium scale.
    // instead, use del(...keys) from redis directly

    await fastify.redis.del(...keys.map((k) => `${segmentName}:${k}`));
  });

  fastify.decorate("flush", async function () {
    await fastify.redis.del();
  });
};
