<<<<<<< HEAD
const Database = require("../utils/Database");
=======
const Database = require("../mongo-connection");
>>>>>>> d9ad086 (add export for other models)

const YardimEt = require("../models/YardimEt");

const CsvExporter = require("../utils/CsvExporter");

// Datayı csv olarak export etmek için script
async function main() {
	await Database.connect();

	const select = [
		"ip",
		"yardimTipi",
		"adSoyad",
		"telefon",
		"sehir",
		"hedefSehir",
		"aciklama",
		"createdAt",
		"updatedAt",
		"fields",
	];

	const docs = await YardimEt.find({}).select(select).lean();
	await CsvExporter(docs, select, `Yardım_Et_Export_${Date.now()}.csv`);
}

main().then(console.log).catch(console.error);
