require("dotenv").config();

const mongoose = require("mongoose");

module.exports.connectDB = async function () {
	try {
		mongoose.connect(process.env.MONGOURL);
		console.log("Veri tabanı bağlantısı sağlandı");
	} catch (e) {
		console.log("Veri tabanı bağlantısında hata oluştu", e);
	}
};
