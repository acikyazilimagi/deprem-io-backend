const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const yardimKaydiSchema = new mongoose.Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
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
    maxLength: 20000,
  },
});

const YardimKaydi = mongoose.model("yardimkaydi", yardimKaydiSchema);

module.exports = YardimKaydi;
