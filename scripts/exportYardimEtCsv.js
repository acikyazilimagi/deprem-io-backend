const YardimEt = require("../models/yardimEtModel");
const fs = require("node:fs");
const mongoose = require("mongoose");
const config = require("../config.js");

// Datayı csv olarak export etmek için script
// node scripts/exportYardimEtCsv.js
// ekstra fields kımsında bug var

async function main() {
  await mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const writeStream = fs.createWriteStream("yardimEt.csv");

  await YardimEt.find({})
    .select("yardimTipi adSoyad telefon sehir hedefSehir aciklama fields ip createdAt updatedAt")
    .then((docs) => {
      writeStream.write("yardimTipi,adSoyad,telefon,sehir,hedefSehir,aciklama,fields,createdAt,updatedAt\n");
      docs.forEach((doc) => {
        writeStream.write(
          `"${doc.yardimTipi}","${doc.adSoyad}","${doc.telefon}","${doc.sehir}","${doc.hedefSehir}","${
            doc.aciklama
          }","${JSON.stringify(doc.fields)}","${doc.createdAt}","${doc.updatedAt}"\n`,
        );
      });
      writeStream.end();
      console.log("CSV file exported successfully.");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error(err);
      mongoose.connection.close();
    });
}

main();
