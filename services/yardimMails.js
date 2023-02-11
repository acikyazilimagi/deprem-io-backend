const nodemailer = require("nodemailer");
const Yardim = require("../models/yardimModel");
async function sendYardimList(yardimTipi) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_SMTP,
    port: process.env.MAILGUN_PORT,
    secure: false, // SSL güvenli bağlantı için true olabilir
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const yardimlar = await Yardim.find({ yardimTipi: yardimTipi, gonderilen: false }).exec();
  const yardimSayisi = yardimlar.length;
  if (yardimSayisi >= 10) {
    let html =
      '<table border="1"><thead><tr><th>Yardım Tipi</th><th>Ad Soyad</th><th>Telefon</th><th>Email</th><th>Adres</th><th>Adres Tarifi</th><th>Acil Durum</th><th>Kişi Sayısı</th><th>Yardım Durumu</th><th>Fiziki Durum</th><th>Google Map Link</th><th>Tweet Link</th><th>IP</th><th>Gönderildi</th></tr></thead><tbody>';

    for (let yardim of yardimlar) {
      html += `<tr><td>${yardim.yardimTipi}</td><td>${yardim.adSoyad}</td><td>${yardim.telefon}</td><td>${yardim.email}</td><td>${yardim.adres}</td><td>${yardim.adresTarifi}</td><td>${yardim.acilDurum}</td><td>${yardim.kisiSayisi}</td><td>${yardim.yardimDurumu}</td><td>${yardim.fizikiDurum}</td><td>${yardim.googleMapLink}</td><td>${yardim.tweetLink}</td><td>${yardim.ip}</td><td>${yardim.gonderildi}</td></tr>`;
      yardim.gonderildi = true;
      await yardim.save();
    }

    html += "</tbody></table>";

    const to = process.env.MAIL_RECEIVERS;
    const str = `${process.env.MAIL_SUBJECT} - ${yardimTipi.toUpperCase()}`;
    let hourandMinute = new Date().toLocaleTimeString().split(":");
    let subject = str.replace("%s", yardimSayisi);
    subject += ` - ${new Date().toLocaleDateString()} - ${hourandMinute[0]}:${hourandMinute[1]}`;
    subject += " Tarihli Mail";
    console.log(`${yardimSayisi} adet ${yardimTipi} yardım talebi gönderildi.`);
    const mailOptions = {
      from: process.env.MAILGUN_FROM,
      to: to || "mehmetik@gmail.com",
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  }
}

module.exports = sendYardimList;
