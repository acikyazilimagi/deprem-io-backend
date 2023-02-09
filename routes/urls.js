const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connectDB = require("../mongo-connection");
const Yardim = require("../models/yardimModel");
const cache = require("../cache");
var requestIp = require("request-ip");
const YardimEt = require("../models/yardimEtModel");
const Iletisim = require("../models/iletisimModel");
const YardimKaydi = require("../models/yardimKaydiModel");

router.get("/", function (req, res) {
  res.send("depremio backend");
});

router.get("/yardim", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let data;

    const yardimTipi = req.query.yardimTipi || "";

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    let cacheKey = `yardim_${page}_${limit}` + yardimTipi;
    if (cache.getCache().has(cacheKey)) {
      data = cache.getCache().get(cacheKey);
      res.send(data);
    }

    await checkConnection();
    if (endIndex < (await Yardim.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    if (yardimTipi !== "") {
      results.totalPage = Math.ceil(
        (await Yardim.countDocuments({ yardimTipi: yardimTipi })) / limit
      );
      results.data = await Yardim.find({ yardimTipi: yardimTipi })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else {
      results.totalPage = Math.ceil((await Yardim.countDocuments()) / limit);
      results.data = await Yardim.find()
        .sort({ _id: -1 })
        .limit(limit)
        .skip(startIndex)
        .exec();
    }

    results.data = results.data.map((yardim) => {
      yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
      const names = yardim.adSoyad.split(" ");
      if (names.length > 1) {
        yardim.adSoyad =
          names[0].charAt(0) +
          "*".repeat(names[0].length - 2) +
          " " +
          names[1].charAt(0) +
          "*".repeat(names[1].length - 2);
      }
      const yedekTelefonlar = yardim.yedekTelefonlar;
      if (yedekTelefonlar) {
        yardim.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
          return yedekTelefon.replace(/.(?=.{4})/g, "*");
        });
      }
      return yardim;
    });
    cache.getCache().set(cacheKey, results);
    if (!data) {
      res.json(results);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not retrieve the Yardim documents." });
  }
});

router.post("/yardim", async function (req, res) {
  try {
    const { yardimTipi, adSoyad, adres, acilDurum } = req.body;

    if (!yardimTipi || !adSoyad || !adres || !acilDurum) {
      return res.status(400).json({
        error: "yardimTipi, adSoyad, adres and acilDurum alanları gerekli",
      });
    }
    if (req.body.telefon.trim().replace(/ /g, "")) {
      if (!/^\d+$/.test(req.body.telefon)) {
        return res.status(400).json({
          error: "Telefon numarası sadece rakamlardan oluşmalıdır.",
        });
      }
    }
    req.body.telefon = req.body.telefon.replace(/ /g, "");
    if (req.body.yedekTelefonlar) {
      if (req.body.yedekTelefonlar.length > 0) {
        let yedekTelefonlar = req.body.yedekTelefonlar;
        for (let i = 0; i < yedekTelefonlar.length; i++) {
          if (!/^\d+$/.test(yedekTelefonlar[i])) {
            return res.status(400).json({
              error: "Telefon numarası sadece rakamlardan oluşmalıdır.",
            });
          }
          yedekTelefonlar[i] = yedekTelefonlar[i].replace(/ /g, "");
        }
        req.body.yedekTelefonlar = yedekTelefonlar;
      }
    }
    await checkConnection();

    // check exist
    const existingYardim = await Yardim.findOne({ adSoyad, adres });
    if (existingYardim) {
      return res.status(409).json({
        error: "Bu yardım bildirimi daha önce veritabanımıza eklendi.",
      });
    }

    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1

    const fields = {};

    for (const key in req.body) {
      if (key.startsWith("fields-")) {
        const fieldName = key.split("-")[1];
        fields[fieldName] = req.body[key];
      }
    }

    // Create a new Yardim document
    const newYardim = new Yardim({
      yardimTipi,
      adSoyad,
      telefon: req.body.telefon || "", // optional fields
      yedekTelefonlar: req.body.yedekTelefonlar || "",
      email: req.body.email || "",
      adres,
      acilDurum,
      adresTarifi: req.body.adresTarifi || "",
      yardimDurumu: "bekleniyor",
      kisiSayisi: req.body.kisiSayisi || "",
      fizikiDurum: req.body.fizikiDurum || "",
      tweetLink: req.body.tweetLink || "",
      googleMapLink: req.body.googleMapLink || "",
      ip: clientIp,
      fields: fields || {},
    });

    cache.getCache().flushAll();
    await newYardim.save()
    res.json({ message: "Yardım talebiniz başarıyla alındı" });
  } catch (error) {
    res.status(500).json({ error: "Hata! Yardım dökümanı kaydedilemedi!" });
  }
});

router.post("/yardimet", async function (req, res) {
  try {
    const { yardimTipi, adSoyad, telefon, sehir, hedefSehir } = req.body;

    // Validate required fields
    if (!yardimTipi || !adSoyad || !telefon || !sehir) {
      return res.status(400).json({
        error: "yardimTipi, adSoyad, telefon, sehir ve ilçe alanları gerekli",
      });
    }
    if (req.body.telefon.trim().replace(/ /g, "")) {
      if (!/^\d+$/.test(req.body.telefon)) {
        return res.status(400).json({
          error: "Telefon numarası sadece rakamlardan oluşmalıdır.",
        });
      }
    }
    req.body.telefon = req.body.telefon.replace(/ /g, "");
    if (req.body.yedekTelefonlar) {
      if (req.body.yedekTelefonlar.length > 0) {
        let yedekTelefonlar = req.body.yedekTelefonlar;
        for (let i = 0; i < yedekTelefonlar.length; i++) {
          if (!/^\d+$/.test(yedekTelefonlar[i])) {
            return res.status(400).json({
              error: "Telefon numarası sadece rakamlardan oluşmalıdır.",
            });
          }
          yedekTelefonlar[i] = yedekTelefonlar[i].replace(/ /g, "");
        }
        req.body.yedekTelefonlar = yedekTelefonlar;
      }
    }
    await checkConnection();

    // check exist
    const existingYardim = await YardimEt.findOne({ adSoyad, sehir });
    if (existingYardim) {
      return res.status(409).json({
        error: "Bu yardım bildirimi daha önce veritabanımıza eklendi.",
      });
    }
    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1

    const fields = {};

    for (const key in req.body) {
      if (key.startsWith("fields-")) {
        const fieldName = key.split("-")[1];
        fields[fieldName] = req.body[key];
      }
    }

    // Create a new Yardim document
    const newYardim = new YardimEt({
      yardimTipi,
      adSoyad,
      telefon,
      sehir,
      ilce: req.body.ilce || "",
      hedefSehir,
      yardimDurumu: req.body.yardimDurumu || "",
      yedekTelefonlar: req.body.yedekTelefonlar || "",
      aciklama: req.body.aciklama || "",
      tweetLink: req.body.tweetLink || "",
      googleMapLink: req.body.googleMapLink || "",
      fields: fields || {},
      ip: clientIp,
    });

    cache.getCache().flushAll();
    await newYardim.save()
    res.json({ message: "Yardım talebiniz başarıyla alındı" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hata! Yardım dökümanı kaydedilemedi!" });
  }
});

router.get("/yardimet", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const yardimTipi = req.query.yardimTipi || "";
    const hedefSehir = req.query.hedefSehir || "";
    let data;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let results = {};

    const cacheKey = `yardimet_${page}_${limit}` + yardimTipi;

    if (cache.getCache().has(cacheKey)) {
      data = cache.getCache().get(cacheKey);
      res.send(data);
    }
    await checkConnection();

    if (endIndex < (await YardimEt.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    let searchQuery = {};

    if (yardimTipi !== "") {
      searchQuery = { yardimTipi: yardimTipi };
    }

    if (hedefSehir !== "") {
      searchQuery = { ...searchQuery, hedefSehir: hedefSehir };
    }

    results.totalPage = Math.ceil(
      (await YardimEt.countDocuments(searchQuery)) / limit
    );

    results.data = await YardimEt.find(searchQuery)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex)
      .exec();
    results.data = results.data.map((yardim) => {
      yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
      const names = yardim.adSoyad.split(" ");
      if (names.length > 1) {
        yardim.adSoyad =
          names[0].charAt(0) +
          "*".repeat(names[0].length - 2) +
          " " +
          names[1].charAt(0) +
          "*".repeat(names[1].length - 2);
      }
      const yedekTelefonlar = yardim.yedekTelefonlar;
      if (yedekTelefonlar) {
        yardim.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
          return yedekTelefon.replace(/.(?=.{4})/g, "*");
        });
      }
      return yardim;
    });



    cache.getCache().set(cacheKey, results);

    if (!data) {
      res.json(results);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not retrieve the Yardim documents." });
  }
});

router.get("/ara-yardimet", async (req, res) => {
  const queryString = req.query.q;
  const yardimDurumuQuery = req.query.yardimDurumu;
  const helpType = req.query.yardimTipi;
  const location = req.query.sehir;
  const dest = req.query.hedefSehir;

  try {
    let query = {
      $or: [
        { adSoyad: { $regex: queryString, $options: "i" } },
        { telefon: { $regex: queryString, $options: "i" } },
        { sehir: { $regex: queryString, $options: "i" } },
        { hedefSehir: { $regex: queryString, $options: "i" } },
      ],
    };

    if (helpType) {
      query = {
        $and: [query, { yardimTipi: helpType }],
      };
    }

    if (location) {
      query = {
        $and: [query, { sehir: location }],
      };
    }

    if (dest) {
      query = {
        $and: [query, { hedefSehir: dest }],
      };
    }

    if (yardimDurumuQuery) {
      query = {
        $and: [query, { yardimDurumu: yardimDurumuQuery }],
      };
    }
    let results = {};
    results.data = await YardimEt.find(query);

    // hidden phone number for security
    results.data = results.data.map((yardim) => {
      yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
      const names = yardim.adSoyad.split(" ");
      if (names.length > 1) {
        yardim.adSoyad =
          names[0].charAt(0) +
          "*".repeat(names[0].length - 2) +
          " " +
          names[1].charAt(0) +
          "*".repeat(names[1].length - 2);
      }
      const yedekTelefonlar = yardim.yedekTelefonlar;
      if (yedekTelefonlar) {
        yardim.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
          return yedekTelefon.replace(/.(?=.{4})/g, "*");
        });
      }
      return yardim;
    });
    res.json(results.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/ara-yardim", async (req, res) => {
  const queryString = req.query.q || "";
  const yardimDurumuQuery = req.query.yardimDurumu;
  const acilDurumQuery = req.query.acilDurum;
  const helpType = req.query.yardimTipi;
  const vehicle = req.query.aracDurumu;

  try {
    let query = {
      $or: [
        { adSoyad: { $regex: queryString, $options: "i" } },
        { telefon: { $regex: queryString, $options: "i" } },
        { sehir: { $regex: queryString, $options: "i" } },
        { adresTarifi: { $regex: queryString, $options: "i" } },
      ],
    };

    if (helpType) {
      query = {
        $and: [query, { yardimTipi: helpType }],
      };
    }

    if (vehicle) {
      query = {
        $and: [query, { aracDurumu: vehicle }],
      };
    }

    if (yardimDurumuQuery) {
      query = {
        $and: [query, { yardimDurumu: yardimDurumuQuery }],
      };
    }

    if (acilDurumQuery) {
      query = {
        $and: [query, { acilDurum: acilDurumQuery }],
      };
    }
    let results = {};
    results.data = await Yardim.find(query);
    results.data = results.data.map((yardim) => {
      yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
      const names = yardim.adSoyad.split(" ");
      if (names.length > 1) {
        yardim.adSoyad =
          names[0].charAt(0) +
          "*".repeat(names[0].length - 2) +
          " " +
          names[1].charAt(0) +
          "*".repeat(names[1].length - 2);
      }
      const yedekTelefonlar = yardim.yedekTelefonlar;
      if (yedekTelefonlar) {
        yardim.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
          return yedekTelefon.replace(/.(?=.{4})/g, "*");
        });
      }
      return yardim;
    });
    res.json(results.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/yardim/:id", async (req, res) => {
  try {
    let data;

    const cacheKey = `yardim_${req.params.id}`;

    if (cache.getCache().has(cacheKey)) {
      data = cache.getCache().get(cacheKey);
      res.send(data);
    }
    await checkConnection();
    let results = await Yardim.findById(req.params.id);
    results.telefon = results.telefon.replace(/.(?=.{4})/g, "*");
    const yedekTelefonlar = results.yedekTelefonlar;
    if (results.yedekTelefonlar) {
      results.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
        return yedekTelefon.replace(/.(?=.{4})/g, "*");
      });
    }
    cache.getCache().set(cacheKey, results);
    if (!results) {
      return res.status(404).send("Yardim not found");
    }
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while fetching Yardim");
  }
});

router.get("/yardimet/:id", async (req, res) => {
  try {
    let data;

    const cacheKey = `yardimet_${req.params.id}`;

    if (cache.getCache().has(cacheKey)) {
      data = cache.getCache().get(cacheKey);
      res.send(data);
    }
    await checkConnection();
    const results = await YardimEt.findById(req.params.id);
    results.telefon = results.telefon.replace(/.(?=.{4})/g, "*");
    const yedekTelefonlar = results.yedekTelefonlar;
    if (results.yedekTelefonlar) {
      results.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
        return yedekTelefon.replace(/.(?=.{4})/g, "*");
      });
    }
    cache.getCache().set(cacheKey, results);
    if (!results) {
      return res.status(404).send("Yardim not found");
    }
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while fetching Yardim");
  }
});

router.post("/iletisim", async function (req, res) {
  try {
    await checkConnection();
    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1

    const existingIletisim = await Iletisim.findOne({
      adSoyad: req.body.adSoyad,
      email: req.body.email,
      mesaj: req.body.mesaj,
    });

    if (existingIletisim) {
      return res.status(400).json({
        error:
          "Bu iletişim talebi zaten var, lütfen farklı bir talepte bulunun.",
      });
    }

    // Create a new Yardim document
    const newIletisim = new Iletisim({
      adSoyad: req.body.adSoyad || "",
      email: req.body.email || "",
      telefon: req.body.telefon || "",
      mesaj: req.body.mesaj || "",
      ip: clientIp,
    });
    await newIletisim.save()
    res.json({ message: "İletişim talebiniz başarıyla alındı" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hata! Yardım dökümanı kaydedilemedi!" });
  }
});

router.post('/ekleYardimKaydi', (req, res) => {
  //const { postId, adSoyad, telefon, sonDurum, email, aciklama } = req.body;

  Yardim.findById(req.body.postId)
    .then(post => {
      if (!post) {
        return res.status(400).json({
          message: 'Belirtilen postId bulunamadi.'
        });
      }

      const newYardimKaydi = new YardimKaydi({
        postId: req.body.postId || "",
        adSoyad: req.body.adSoyad || "",
        telefon: req.body.telefon || "",
        sonDurum: req.body.sonDurum || "",
        email: req.body.email || "",
        aciklama: req.body.aciklama || "",
      });

      return newYardimKaydi.save();
    })
    .then(createdYardimKaydi => {
      res.status(201).json({
        message: 'Yardim kaydi basariyla olusturuldu.',
        createdYardimKaydi
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Yardim kaydi olusturulamadi.',
        error
      });
    });
});

module.exports = router;

async function checkConnection() {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
}

module.exports = router;
