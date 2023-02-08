const express = require("express");
const mainRoutes = require("./routes/urls");
const cache = require("./cache");
const cacheRoutes = require("./routes/cacheUrls");

const app = express();
const PORT = process.env.PORT || 8080;
var cors = require("cors");
require("dotenv").config();

const mongoUrl = process.env.MONGOURL;
const mongoose = require("mongoose");

app.use(express.json());

app.use(cors({
  origin: '*'
}));

/*
app.use(
  cors({
    origin: [
        ""
    ],
  })
);
*/

app.use("/", mainRoutes);
app.use("/cache/", cacheRoutes);

// DB connection
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((r) => {
    cache.createCacheInstance();
    console.log("Connected to DB...");
    app.listen(PORT, () => console.log(`App listening on port ${PORT}...`)); // App start
  })
  .catch((err) => console.log(err));
