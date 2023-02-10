const ObjectsToCsv = require("objects-to-csv");

// Datayı csv olarak export etmek için kodlanmış bir tool
module.exports = async function (rows, columns, file) {
	const flat = rows.map(function (row) {
		const hold = {};

		for (const key of columns) {
			// eğer obje yapısındaysa
			if (typeof row[key] === "object" && row[key] != null) {
				for (const subKey of Object.keys(row[key])) {
					hold[`ekstra_${subKey}`] = row[key][subKey];
				}
			}

			// eğer array yapısındaysa
			else if (Array.isArray(row[key])) {
				hold[key] = row[key].join(", ");
			}

			// eğer nested değilse
			else hold[key] = row[key];
		}
		return hold;
	});

	const csv = new ObjectsToCsv(flat);
	await csv.toDisk(`./${file}`, { allColumns: true });
	console.log("Veriler dışarı aktarıldı");
};
