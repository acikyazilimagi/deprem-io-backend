const Database = require("../utils/Database");

const Yardim = require("../models/Yardim");

const CsvExporter = require("../utils/CsvExporter");

// Datayı csv olarak export etmek için script
async function main() {
  await Database.connect();

  const select = [
    "yardimTipi",
    "adSoyad",
    "telefon",
    "yedekTelefonlar",
    "email",
    "adres",
    "adresTarifi",
    "acilDurum",
    "kisiSayisi",
    "yardimDurumu",
    "fizikiDurum",
    "googleMapLink",
    "tweetLink",
    "fields",
    "ip",
    "createdAt",
    "updatedAt",
  ];

  const docs = await Yardim.find({}).select(select).lean();
  await CsvExporter(docs, select, `Yardım_Export_${Date.now()}.csv`);
}

main().then(console.log).catch(console.error);
