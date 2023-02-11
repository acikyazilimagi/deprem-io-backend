const mailgun = require("mailgun-js");
const emailConfig = {
  apiKey: "b68a5b9884e06b93208ffcc5252129ef-d1a07e51-1b24647c",
  domain: "sandbox597a13b3cace4f6fb8b0abfad9346bfb.mailgun.org"
};
const mg = mailgun(emailConfig);
const data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'mehmetik@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
  console.log(body);
});
