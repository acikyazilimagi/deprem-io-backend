const fs = require("fs");

if (fs.existsSync(".env")) {
  require("dotenv").config();
  console.log("Using environment variables from .env file");
} else {
  console.log(".env file not found");
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 80,
  mongoUrl: process.env.MONGOURL || "mongodb://localhost:27017",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  NODE_ENV: process.env.NODE_ENV || "development",
};
