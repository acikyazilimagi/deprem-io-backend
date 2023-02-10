const mongoose = require('mongoose')
const YardimEt = require('../models/yardimEtModel')
const connectDB = require('../mongo-connection')

const ObjectsToCsv = require('objects-to-csv')

// Datayı csv olarak export etmek için script
// node scripts/exportYardimEtCsv.js
// ekstra fields kımsında bug var

async function main() {
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
