const mongoose = require("mongoose");

const  yardimSchema = new mongoose.Schema(
  {
    yardimTipi: {  // Gıda, İlaç, Enkaz, Isınma, Kayıp
      type: String, 
      required: true
    },
    adSoyad: {
      type: String,
      required: true
    },
    telefon: {
      type: String,
      required: false
    },
    adres: {
      type: String,
      required: true
    },
    adresTarifi: {
      type: String,
      required: false
    },
    acilDurum: {
      type: String,
      enum: ['normal', 'orta', 'kritik'],
      required: true
    },
    fizikiDurum: {
      type: String,
      required: false
    },
  
    tweetLink: {
      type: String,
      required: false
    },

    fields: {
      type: Object,
      required: false
    }

  },
  { timestamps: true }
);

const Yardim = mongoose.model("yardim", yardimSchema);

module.exports = Yardim;
