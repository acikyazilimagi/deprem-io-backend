const cron = require("node-cron");
const sendYardimList = require("../services/yardimMails.js");
const logger = require("./logger.js");

function run() {
  cron.schedule("*/10 * * * *", async () => {
    try {
      logger.info("Sending help list");
      await sendYardimList("gida");
      await sendYardimList("enkaz");
      await sendYardimList("isinma");
      await sendYardimList("cadirKurma");
      await sendYardimList("gidaSaglama");
      await sendYardimList("isMakinasi");
      await sendYardimList("konaklama");
      await sendYardimList("yolcuTasima");
      logger.info("Successfully sent help list");
    } catch (error) {
      logger.fatal(error);
    }
  });
}

module.exports = {
  run,
};
