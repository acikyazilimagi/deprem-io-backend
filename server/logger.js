const pino = require("pino");
const config = require("../config");

const options = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname,reqId",
      colorize: true,
    },
  },
};

module.exports = pino(config.NODE_ENV === "development" ? options : undefined);
