require("dotenv").config();

const mongoose = require("mongoose");

const fastify = require("fastify");
const cors = require("@fastify/cors");
const config = require("./config.js");
const cache = require("./cache.js");

const mainRoutes = require("./routes/urls");
const cacheRoutes = require("./routes/cache");

const app = fastify({
  trustProxy: true,
});
app.register(cors);

mainRoutes(app);
cacheRoutes(app);

app.decorate("mongoose", mongoose);
app.decorate("cache", cache);

// DB connection
mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    cache.createCacheInstance();
    app.log.info("Connected to DB...");
    return app.listen({
      port: config.port,
      host: "0.0.0.0",
    });
  })
  .catch((error) => {
    app.log.fatal("Uncaught error", error);
    process.exit(0);
  });
