require("dotenv").config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUrl: process.env.MONGOURL || "mongodb://localhost:27017",
  NODE_ENV: process.env.NODE_ENV || "development",
};
