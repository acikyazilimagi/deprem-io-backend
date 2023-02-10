async function checkConnection(fastifyInstance) {
  try {
    if (fastifyInstance.mongoose.connection.readyState !== 1) {
      await fastifyInstance.mongoose.connect(fastifyInstance.config.mongoose);
    }
  } catch (error) {
    fastifyInstance.log.fatal(error);
  }
}

module.exports = {
  checkConnection,
};
