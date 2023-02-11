const mongoose = require("mongoose");

// yardım istyenlerin model dosyası
const yardimSchema = new mongoose.Schema(
  {
    yardimTipi: {
      // Gıda, İlaç, Enkaz, Isınma, Kayıp
      type: String,
      required: true,
      maxLength: 2000,
    },
    adSoyad: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    telefon: {
      type: String,
      required: false,
    },
    yedekTelefonlar: {
      type: [String],
      required: false,
    },
    email: {
      type: String,
      required: false,
      maxLength: 2000,
    },
    adres: {
      type: String,
      required: true,
      maxLength: 20000,
    },
    adresTarifi: {
      type: String,
      required: false,
      maxLength: 20000,
    },
    acilDurum: {
      type: String,
      enum: ["normal", "orta", "kritik"],
      required: true,
    },
    kisiSayisi: {
      type: String,
      required: false,
      maxLength: 2000,
    },
    yardimDurumu: {
      type: String,
      enum: ["bekleniyor", "yolda", "yapildi"],
      required: true,
    },
    fizikiDurum: {
      type: String,
      required: false,
      maxLength: 2000,
    },
    googleMapLink: {
      type: String,
      required: false,
      maxLength: 2000,
    },

    tweetLink: {
      type: String,
      required: false,
      maxLength: 2000,
    },

    fields: {
      // Tüm alternatif kullanımlar için buraya json yollayın
      type: Object,
      required: false,
    },

    ip: {
      type: String,
      required: true,
      select: false,
    },
    gonderildi: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  { timestamps: true },
);

const Yardim = mongoose.model("yardim", yardimSchema);

module.exports = Yardim;
