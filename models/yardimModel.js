const mongoose = require("mongoose");

// yardım istyenlerin model dosyası
const yardimSchema = new mongoose.Schema(
  {
    yardimTipi: {
      // Gıda, İlaç, Enkaz, Isınma, Kayıp
      type: String,
      required: true,
    },
    adSoyad: {
      type: String,
      required: true,
    },
    telefon: {
      type: String,
      required: false,
      pattern: /^\d{10}$/,
      message: "Telefon numarası 10 karakterli olmalıdır",
    },
    yedekTelefonlar: {
      type: [String],
      required: false,
      // eğer array ise her biri kontrol edilecek.
      pattern: /^\d{10}$/,
      message: "Yedek Telefon numarası 10 karakterli olmalıdır",
    },
    email: {
      type: String,
      required: false,
    },
    adres: {
      type: String,
      required: true,
    },
    adresTarifi: {
      type: String,
      required: false,
    },
    acilDurum: {
      type: String,
      enum: ["normal", "orta", "kritik"],
      required: true,
    },
    kisiSayisi: {
      type: String,
      required: false,
    },
    yardimDurumu: {
      type: String,
      enum: ["bekleniyor", "yolda", "yapildi"],
      required: true,
    },
    fizikiDurum: {
      type: String,
      required: false,
    },
    googleMapLink: {
      type: String,
      required: false,
    },

    tweetLink: {
      type: String,
      required: false,
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
  },
  { timestamps: true },
);

const Yardim = mongoose.model("yardim", yardimSchema);

module.exports = Yardim;
