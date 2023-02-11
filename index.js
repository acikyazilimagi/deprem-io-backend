require("dotenv").config();
const config = require("./config.js");
const cache = require("./cache.js");
const buildServer = require("./server/build.js");

const app = buildServer();

const Database = require("./utils/Database");

// DB connection
Database.connect(app.log.info)
  .then(() => {
    cache.createCacheInstance();
    app.log.info("Connected to DB...");
    return app.listen(
      {
        port: config.port,
        host: "0.0.0.0",
      },
      (err, address) => {
        if (config.NODE_ENV === "development") {
          console.log(`Available routes: \n${app.printRoutes()}`);
        }
      },
    );
  })
  .catch((error) => {
    app.log.fatal("Uncaught error", error);
    process.exit(0);
  });
