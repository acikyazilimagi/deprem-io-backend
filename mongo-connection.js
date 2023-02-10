require("dotenv").config();

const mongoose = require("mongoose");

module.exports.connect = async function () {
	try {
		await connection;
		console.log("Veri tabanı bağlantısı sağlandı");
	} catch (e) {
		console.log("Veri tabanı bağlantısında hata oluştu", e);
	}
};

const connection = new Promise(function (resolve, reject) {
	mongoose.connect(
		process.env.MONGOURL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		function (e) {
			if (e) return reject(e);
			resolve();
		},
	);
});
