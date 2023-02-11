const Database = require("../utils/Database");

const YardimKaydi = require("../models/YardimKaydi");

const CsvExporter = require("../utils/CsvExporter");

// Datayı csv olarak export etmek için script
async function main() {
  await Database.connect();

  const select = ["postId", "adSoyad", "telefon", "sonDurum", "email", "aciklama"];

  const docs = await YardimKaydi.find({}).select(select).lean();
  await CsvExporter(docs, select, `Yardım_Kaydi_Export_${Date.now()}.csv`);
}

main().then(console.log).catch(console.error);
