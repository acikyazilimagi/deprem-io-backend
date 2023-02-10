const mongoose = require("mongoose");

// yardım edebilecek kişilerin model dosyası
const iletisimSchema = new mongoose.Schema(
	{
		adSoyad: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: false,
		},

		telefon: {
			type: String,
			required: false,
		},
		mesaj: {
			type: String,
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

const Iletisim = mongoose.model("iletisim", iletisimSchema);

module.exports = Iletisim;
