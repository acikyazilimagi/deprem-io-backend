require("dotenv").config();
const config = require("./config.js");
const buildServer = require("./server/build.js");

const mongoose = require("mongoose");

const app = buildServer();

// DB connection
mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
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
