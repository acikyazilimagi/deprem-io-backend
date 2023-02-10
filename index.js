const express = require("express");
const mainRoutes = require("./routes/urls");
const cache = require("./cache");
const cacheRoutes = require("./routes/cacheUrls");

const app = express();
const PORT = process.env.PORT || 8080;
var cors = require("cors");
require("dotenv").config();

const Database = require("./mongo-connection");

app.use(express.json());

app.use(
	cors({
		origin: "*",
	}),
);

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

Database.connect()
	.then(() => {
		cache.createCacheInstance();
		app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
	})
	.catch(console.error);
