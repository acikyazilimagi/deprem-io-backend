const mongoose = require("mongoose");
const YardimEt = require("../models/yardimEtModel");
const fs = require("fs");
const connectDB = require("../mongo-connection");

// Datayı csv olarak export etmek için script
// node scripts/exportYardimEtCsv.js
// ekstra fields kımsında bug var


async function main() {
await checkConnection();
const writeStream = fs.createWriteStream("yardimEt.csv");

await YardimEt.find({})
  .select("yardimTipi adSoyad telefon sehir hedefSehir aciklama fields ip createdAt updatedAt")
  .then(docs => {
    writeStream.write("yardimTipi,adSoyad,telefon,sehir,hedefSehir,aciklama,fields,createdAt,updatedAt\n");
    docs.forEach(doc => {
      writeStream.write(
        `"${doc.yardimTipi}","${doc.adSoyad}","${doc.telefon}","${doc.sehir}","${doc.hedefSehir}","${doc.aciklama}","${JSON.stringify(
          doc.fields
        )}","${doc.createdAt}","${doc.updatedAt}"\n`
      );
    });
    writeStream.end();
    console.log("CSV file exported successfully.");
   mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });

}

  async function checkConnection() {
    if (mongoose.connection.readyState !== 1) {
        console.log("burası");
      await connectDB();
    }
  }
  
  main();