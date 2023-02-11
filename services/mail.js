const emailConfig = {
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
};
const mailgun = require("mailgun-js");

function sendMail(to, subject, text) {
  const data = {
    from: process.env.MAILGUN_FROM,
    to: process.env.MAIL_RECEIVERS || "mehmetik@gmail.com",
    subject: subject,
    html: text,
  };
  mailgun(emailConfig)
    .messages()
    .send(data, function (error, body) {
      console.info(data);
      console.log(body);
      console.error(error);
    });
}

module.exports = { sendMail };
