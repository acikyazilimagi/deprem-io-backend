module.exports = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUrl: process.env.MONGOURL || "",
};
