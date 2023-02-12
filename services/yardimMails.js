const nodemailer = require("nodemailer");
const Yardim = require("../models/yardimModel");
const YardimEt = require("../models/yardimEtModel");
const config = require("../config.js");
const logger = require("../server/logger.js");

async function sendYardimList(yardimTipi) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  const yardimlar = await Yardim.find({ yardimTipi: yardimTipi, gonderildi: false }).exec();
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
    const [hour, minute] = new Date().toLocaleTimeString().split(":");
    let subject = str.replace("%s", yardimSayisi);
    subject += ` - ${new Date().toLocaleDateString()} - ${hour}:${minute}`;
    subject += " Tarihli Mail";
    logger.info(`${yardimSayisi} adet ${yardimTipi} yardım talebi gönderildi.`);
    const mailOptions = {
      from: process.env.MAILGUN_FROM,
      to: to || "mehmetik@gmail.com",
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  }
}

async function sendYardimEtProviderList(yardimTipi) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  const yardimlar = await YardimEt.find({ yardimTipi: yardimTipi, gonderildi: false }).exec();
  const yardimSayisi = yardimlar.length;
  if (yardimSayisi >= 10) {
    let html =
      '<table border="1"><thead><tr><th>Sağlayıcı Tipi</th><th>Ad Soyad</th><th>Telefon</th><th>Yedek Telefonlar</th><th>Şehir</th><th>İlçe</th><th>Hedef Şehir</th><th>Açıklama</th><th>Alanlar</th><th>Yardım Durumu</th><th>IP</th><th>Gönderildi</th></tr></thead><tbody>';
    for (let yardim of yardimlar) {
      if (typeof yardim.fields === "object") {
        yardim.fields = JSON.stringify(yardim.fields);
      }
      html += `<tr><td>${yardim.yardimTipi}</td><td>${yardim.adSoyad}</td><td>${yardim.telefon}</td><td>${yardim.yedekTelefonlar}</td><td>${yardim.sehir}</td><td>${yardim.ilce}</td><td>${yardim.hedefSehir}</td><td>${yardim.aciklama}</td><td>${yardim.fields}</td><td>${yardim.yardimDurumu}</td><td>${yardim.ip}</td><td>${yardim.gonderildi}</td></tr>`;
      yardim.gonderildi = true;
      await yardim.save();
    }

    html += "</tbody></table>";

    const to = process.env.MAIL_RECEIVERS;
    const str = `${process.env.MAIL_SUBJECT_PROVIDER} - ${yardimTipi.toUpperCase()}`;
    const [hour, minute] = new Date().toLocaleTimeString().split(":");
    let subject = str.replace("%s", yardimSayisi);
    subject += ` - ${new Date().toLocaleDateString()} - ${hour}:${minute}`;
    subject += " Tarihli Mail";
    logger.info(`${yardimSayisi} adet ${yardimTipi} yardım talebi gönderildi.`);
    const mailOptions = {
      from: process.env.MAILGUN_FROM,
      to: to || "mehmetik@gmail.com",
      subject: subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);
  }
}

module.exports = {
  sendYardimList,
  sendYardimEtProviderList,
};
