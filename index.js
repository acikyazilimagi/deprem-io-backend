const config = require("./config.js");
const buildServer = require("./server/build.js");
const { connect, set } = require("mongoose");
const { run } = require("./server/cron");

async function main() {
  const app = await buildServer();

  set("strictQuery", false);

  // DB connection
  connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      app.log.info("Connected to MongoDB");

      // Run cron jobs
      run();

      return app.listen({
        port: config.port,
        host: "0.0.0.0",
      });
    })
    .catch((error) => {
      app.log.fatal(error);
      process.exit(0);
    });
}

main();
