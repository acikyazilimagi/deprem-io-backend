/**
 * @param {FastifyInstance} app
 */
module.exports = function (app) {
  app.get("/flushall", async () => {
    app.cache.getCache().flushAll();
    return { status: "ok" };
  });

  app.get("/getstats", async () => {
    return app.cache.getCache().getStats();
  });
};
