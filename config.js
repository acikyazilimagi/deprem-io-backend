require("dotenv").config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 80,
  mongoUrl: process.env.MONGOURL || "mongodb://localhost:27017",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  NODE_ENV: process.env.NODE_ENV || "development",
  API_KEY: process.env.API_KEY || "",
  email: {
    host: process.env.EMAIL_SMTP || "",
    port: process.env.EMAIL_PORT || "",
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
  afetharitaUrl: process.env.AFET_HARITA_URL || "",
  afetharitaKey: process.env.AFET_HARITA_KEY || "",
};
