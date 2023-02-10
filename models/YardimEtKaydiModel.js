const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const yardimEtKaydiSchema = new mongoose.Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "YardimEt",
    required: true,
  },
  adSoyad: {
    type: String,
    required: true,
  },
  telefon: {
    type: String,
    required: false
  },
  sonDurum: {
    type: String,
    enum: ["yardim-bekleniyor", "yardim-edildi", "yetersiz-bilgi", "yardim-edilemedi"],
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  aciklama: {
    type: String,
    required: true,
  },
});

const YardimEtKaydi = mongoose.model("yardimetkaydi", yardimEtKaydiSchema);

module.exports = YardimEtKaydi;
