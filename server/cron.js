const cron = require("node-cron");
const { sendYardimList, sendYardimEtProviderList } = require("../services/yardimMails.js");
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

      logger.info("Sending provider list");
      await sendYardimEtProviderList("gida");
      await sendYardimEtProviderList("enkaz");
      await sendYardimEtProviderList("isinma");
      await sendYardimEtProviderList("cadirKurma");
      await sendYardimEtProviderList("gidaSaglama");
      await sendYardimEtProviderList("isMakinasi");
      await sendYardimEtProviderList("konaklama");
      await sendYardimEtProviderList("yolcuTasima");
      logger.info("Successfully sent provider list");
    } catch (error) {
      logger.fatal(error);
    }
  });
}

module.exports = {
  run,
};
