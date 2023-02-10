<<<<<<< HEAD
const YardimEt = require("../models/yardimEtModel");
const fs = require("node:fs");
const mongoose = require("mongoose");
const config = require("../config.js");
=======
const mongoose = require('mongoose')
const YardimEt = require('../models/yardimEtModel')
const connectDB = require('../mongo-connection')

const ObjectsToCsv = require('objects-to-csv')
>>>>>>> 1b6824f (fix export yardimet)

// Datayı csv olarak export etmek için script
// node scripts/exportYardimEtCsv.js
// ekstra fields kımsında bug var

async function main() {
<<<<<<< HEAD
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
=======
   await checkConnection()

   const select = [
      'ip',
      'yardimTipi',
      'adSoyad',
      'telefon',
      'sehir',
      'hedefSehir',
      'aciklama',
      'createdAt',
      'updatedAt',
      'fields',
   ]

   try {
      const docs = await YardimEt.find({}).select(select).lean()

      const flat = docs.map(function (doc) {
         const hold = {}

         for (const key of select) {
            // eğer nested yapıdaysa
            if (typeof doc[key] === 'object') {
               for (const subKey of Object.keys(doc[key])) {
                  hold['ekstra_' + subKey] = doc[key][subKey]
               }
            }
            // eğer nested değilse
            else hold[key] = doc[key]
         }

         return hold
      })

      const csv = new ObjectsToCsv(flat)
      const file = ['Yardım_Et_Export_' + Date.now(), 'csv'].join('.')
      await csv.toDisk(`./${file}`, { allColumns: true })
      console.log('Yardım verileri dışarı aktarıldı')
      mongoose.connection.close()
   } catch (error) {
      console.log(error)
      mongoose.connection.close()
   }
}

async function checkConnection() {
   if (mongoose.connection.readyState !== 1) {
      console.log('Veritabanı bağlantısı sağlandı')
      await connectDB()
   }
}

main()
>>>>>>> 1b6824f (fix export yardimet)
