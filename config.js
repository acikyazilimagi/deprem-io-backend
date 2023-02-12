require("dotenv").config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUrl: process.env.MONGOURL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  exportEmails: process.env.EXPORT_EMAILS || "istenilenstaticemail@mail.com",
  emailProviderAPIKey: process.env.EMAIL_PROVIDER_API_KEY || "",
};
