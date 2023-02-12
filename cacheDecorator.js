/**
 * @param {FastifyInstance} fastify
 * @param {string} segmentName
 */
module.exports = function (fastify, segmentName) {
  fastify.decorate("selectiveFlush", async function (prefix) {
    if (fastify.cache.keys) {
      // this is a blocking operation in redis.
      // should eventually be replaced with having a separate redis instance and flushing it all
      const keys = await fastify.cache.keys(`${prefix}*`);
      fastify.log.info(`flushing keys ${prefix}* ${JSON.stringify(keys)}`);
      // cache exposes a method that deletes a single key asynchronously.
      // using that would be terrible for node performance ad medium scale.
      // instead, use del(...keys) from redis directly
      await fastify.redis.del(...keys.map((k) => `${segmentName}:${k}`));
    } else if (fastify.cache.client._cache?._keymap) {
      const _keys = fastify.cache.client._cache._keymap.keys();
      const _keysToDelete = [];
      for (const _key of _keys) {
        if (_key.startsWith(`${segmentName}:${prefix}`)) _keysToDelete.push(_key);
      }
      _keysToDelete.forEach((_key) => fastify.cache.delete(_keysToDelete));
    }
  });

  fastify.decorate("flush", async function () {
    if (fastify.redis) {
      await fastify.redis.del();
    } else if (fastify.cache.client._cache?._keymap) {
      fastify.cache.client._cache._keymap.clear();
    }
  });
};
