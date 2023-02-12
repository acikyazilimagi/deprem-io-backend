const fs = require("fs");

async function main() {
  if (fs.existsSync(".env")) {
    require("dotenv").config();
    console.log("Using environment variables from .env file");
  } else {
    console.log(".env file not found");
  }
  const config = require("./config.js");
  const buildServer = require("./server/build.js");

  const mongoose = require("mongoose");

  const app = await buildServer();

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
      if (config.NODE_ENV === "development") {
        console.log(error);
      }
      app.log.fatal("Uncaught error", error);
      process.exit(0);
    });
}

main();
