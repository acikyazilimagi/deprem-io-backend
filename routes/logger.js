var fs = require("fs");
module.exports = {
  logger: function(req, res, next) {
    const user_ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.get('User-Agent') ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const req_page = req.originalUrl;
    const date = new Date();
    console.log(date);

    const log = `[${date}]:  |  Ip=${user_ip}  |  Req_page=${req_page}\n`;

    fs.appendFile("logs.txt", log, err => {
      if (err) throw err;
    });

    next();
  }
};