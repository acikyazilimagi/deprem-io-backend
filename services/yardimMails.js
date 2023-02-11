const mailService = require("./mail");
const Yardim = require("../models/yardimModel");
async function sendYardimList(yardimTipi) {
  const yardimlar = await Yardim.find({ yardimTipi: yardimTipi, gonderildi: false }).exec();
  const yardimSayisi = yardimlar.length;
  if (yardimSayisi >= 10) {
    let html =
      '<table border="1"><thead><tr><th>Yardım Tipi</th><th>Ad Soyad</th><th>Telefon</th><th>Yedek Telefonlar</th><th>Email</th><th>Adres</th><th>Adres Tarifi</th><th>Acil Durum</th><th>Kişi Sayısı</th><th>Yardım Durumu</th><th>Fiziki Durum</th><th>Google Map Link</th><th>Tweet Link</th><th>Fields</th><th>IP</th><th>Gönderildi</th></tr></thead><tbody>';

    for (let yardim of yardimlar) {
      yardim.fields = JSON.stringify(yardim.fields);
      yardim.yedekTelefonlar = JSON.stringify(yardim.yedekTelefonlar);
      html += `<tr><td>${yardim.yardimTipi}</td><td>${yardim.adSoyad}</td><td>${yardim.telefon}</td><td>${yardim.yedekTelefonlar}</td><td>${yardim.email}</td><td>${yardim.adres}</td><td>${yardim.adresTarifi}</td><td>${yardim.acilDurum}</td><td>${yardim.kisiSayisi}</td><td>${yardim.yardimDurumu}</td><td>${yardim.fizikiDurum}</td><td>${yardim.googleMapLink}</td><td>${yardim.tweetLink}</td><td>${yardim.fields}</td><td>${yardim.ip}</td><td>${yardim.gonderildi}</td></tr>`;
      yardim.gonderildi = true;
      await yardim.save();
    }

    html += "</tbody></table>";

    const to = process.env.MAIL_RECEIVERS;
    const str = `${process.env.MAIL_SUBJECT} - ${yardimTipi.toUpperCase()}`;
    let subject = str.replace("%s", yardimSayisi);
    console.log(`${yardimSayisi} adet ${yardimTipi} yardım talebi gönderildi.`);
    return mailService.sendMail(to, subject, html);
  }
}

module.exports = sendYardimList;
