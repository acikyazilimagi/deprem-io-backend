const mongoose = require("mongoose");

// yardım edebilecek kişilerin model dosyası
const yardimEtSchema = new mongoose.Schema(
  {
    yardimTipi: {
      // Yolcu Taşıma - konaklama - işmakinesi kullanma
      type: String,
      required: true,
      maxLength: 1000,
    },
    adSoyad: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    telefon: {
      type: String,
      required: true,
    },
    yedekTelefonlar: {
      type: [String],
      required: false,
    },
    sehir: {
      type: String,
      required: true,
    },
    // TODO: ilçe geçici required false yapıldı
    ilce: {
      type: String,
      required: false,
    },
    hedefSehir: {
      type: String,
      required: false,
    },
    aciklama: {
      type: String,
      required: false,
      maxLength: 10000,
    },
    fields: {
      // Tüm alternatif kullanımlar için buraya json yollayın
      type: Object,
      required: false,
    },
    yardimDurumu: {
      type: String,
      enum: ["bekleniyor", "yolda", "yapildi"],
      required: true,
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
    },
  },
  { timestamps: true },
);

const YardimEt = mongoose.model("yardimet", yardimEtSchema);

module.exports = YardimEt;
