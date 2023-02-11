const cache = require("../cache");

/**
 *
 * @param {(request: FastifyRequest) => string} keyGenerator
 * @returns
 */
function readCache(keyGenerator) {
  /**
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   */
  return async function (request, reply) {
    const key = keyGenerator(request);
    if (key !== undefined && cache.getCache().has(key)) {
      reply.send(await cache.getCache().get(key));
      return reply;
    }
  };
}

/**
 *
 * @param {(request: FastifyRequest) => string} keyGenerator
 * @returns
 */
function writeCache(keyGenerator) {
  /**
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   * @param {any} payload
   */
  return async function (request, reply, payload) {
    const key = keyGenerator(request);
    if (key !== undefined && payload !== undefined) {
      cache.getCache().set(key, payload);
    }
  };
}

module.exports = {
  readCache,
  writeCache,
};
