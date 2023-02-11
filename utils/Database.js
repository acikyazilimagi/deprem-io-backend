require("dotenv").config();

const mongoose = require("mongoose");

module.exports.connect = async function (log = (m) => {}) {
  try {
    await connection;
    log("Veri tabanı bağlantısı sağlandı");
  } catch (e) {
    log("Veri tabanı bağlantısında hata oluştu");
    process.exit(1);
  }
};

const connection = new Promise(function (resolve, reject) {
  mongoose.connect(
    process.env.MONGOURL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (e) {
      if (e) return reject(e);
      resolve();
    },
  );
});
