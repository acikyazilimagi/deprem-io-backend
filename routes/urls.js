const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const connectDB = require("../mongo-connection");
const Yardim = require("../models/yardimModel");
const cache = require("../cache");
var requestIp = require('request-ip');
const YardimEt = require("../models/yardimEtModel");

router.get("/", function (req, res) {
  res.send("depremio backend");
});

router.get("/yardim", async function (req, res) {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let data ;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const cacheKey = `yardim_${page}_${limit}`;
  
    if (cache.getCache().has(cacheKey)) {
      data = cache.getCache().get(cacheKey);
      res.send(data);
    }

    await checkConnection();
    if (endIndex < (await Yardim.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit
      };
    }

    results.data = await Yardim.find().sort({ _id: -1 }).limit(limit).skip(startIndex).exec();

    cache.getCache().set(cacheKey, results);

    if(!data){res.json(results);}
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not retrieve the Yardim documents." });
  }
});

router.post('/yardim', async function (req, res) {
  try {

  const { yardimTipi, adSoyad, adres, acilDurum } = req.body;  
  console.log(req);

  // Validate required fields
  if (!yardimTipi || !adSoyad || !adres || !acilDurum) {
    return res.status(400).json({ error: "yardimTipi, adSoyad, adres and acilDurum alanları gerekli" });
  }
  await checkConnection();

  // check exist
  const existingYardim = await Yardim.findOne({ adSoyad, adres });
  if (existingYardim) {
    return res.status(409).json({ error: "Bu yardım bildirimi daha önce veritabanımıza eklendi." });
  }  

    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
   
    // Create a new Yardim document
    const newYardim = new Yardim({
      yardimTipi,
      adSoyad,
      telefon: req.body.telefon || "",  // optional fields
      email: req.body.email || "",
      adres,
      adresTarifi: req.body.adresTarifi || "",
      acilDurum,
      yardimDurumu: req.body.yardimDurumu || "",
      fizikiDurum: req.body.fizikiDurum || "",
      tweetLink: req.body.tweetLink || "",
      googleMapLink:  req.body.googleMapLink || "",
      ip: clientIp,
      fields: req.body.fields|| {},
    });

    cache.getCache().flushAll();
    const savedYardim = await newYardim.save();

    res.json({message: "Yardım talebiniz başarıyla alındı"} );

  } catch (error) {
    res.status(500).json({ error: "Hata! Yardım dökümanı kaydedilemedi!" });
  }

});

router.post('/yardimet', async function (req, res) {
  try {

  const { yardimTipi, adSoyad, telefon, sehir,hedefSehir } = req.body;  

  // Validate required fields
  if (!yardimTipi || !adSoyad || !telefon || !sehir) {
    return res.status(400).json({ error: "yardimTipi, adSoyad, telefon and sehir alanları gerekli" });
  }
  await checkConnection();

  // check exist
  const existingYardim = await YardimEt.findOne({ adSoyad, sehir });
  if (existingYardim) {
    return res.status(409).json({ error: "Bu yardım bildirimi daha önce veritabanımıza eklendi." });
  }  
    var clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1
    
    // Create a new Yardim document
    const newYardim = new YardimEt({
      yardimTipi,
      adSoyad,
      telefon,
      sehir,
      hedefSehir,
      yardimDurumu :req.body.yardimDurumu || "",
      aciklama: req.body.aciklama || "",
      tweetLink: req.body.tweetLink || "",
      googleMapLink:  req.body.googleMapLink || "",
      fields: req.body.fields|| {},
      ip: clientIp
    });

    cache.getCache().flushAll();
    const savedYardim = await newYardim.save();

    res.json({message: "Yardım talebiniz başarıyla alındı"} );

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hata! Yardım dökümanı kaydedilemedi!" });
  }

});

router.get("/yardimet", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let data ;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const cacheKey = `yardimet_${page}_${limit}`;
  
    if (cache.getCache().has(cacheKey)) {
      data = cache.getCache().get(cacheKey);
      res.send(data);
    }
    await checkConnection();

    if (endIndex < (await YardimEt.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit
      };

    }
    results.data = await YardimEt.find().sort({ _id: -1 }).limit(limit).skip(startIndex).exec();

    cache.getCache().set(cacheKey, results);

    if(!data){res.json(results);}
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Could not retrieve the Yardim documents." });
  }
});

router.get('/ara-yardimet', async (req, res) => {
  const queryString = req.query.q;
  const yardimDurumuQuery = req.query.yardimDurumu
  try {

    let query = {
      $or: [
        { adSoyad: { $regex: queryString, $options: 'i' } },
            { telefon: { $regex: queryString, $options: 'i' } },
            { sehir: { $regex: queryString, $options: 'i' } },
            { hedefSehir: { $regex: queryString, $options: 'i' } }
      ]
    };

    if (yardimDurumuQuery) {
      query = {
        $and: [
          query,
          { yardimDurumu: yardimDurumuQuery }
        ]
      };
    }

    
    const results = await YardimEt.find(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/ara-yardim', async (req, res) => {
  const queryString = req.query.q;
  const yardimDurumuQuery = req.query.yardimDurumu;
  const  acilDurumQuery = req.query.acilDurum;
  try {

    let query = {
      $or: [
        { adSoyad: { $regex: queryString, $options: 'i' } },
        { telefon: { $regex: queryString, $options: 'i' } },
        { sehir: { $regex: queryString, $options: 'i' } },
        { adresTarifi: { $regex: queryString, $options: 'i' } }, 
      ]
    };

    if (yardimDurumuQuery) {
      query = {
        $and: [
          query,
          { yardimDurumu: yardimDurumuQuery }
        ]
      };
    }

    if (acilDurumQuery) {
      query = {
        $and: [
          query,
          { acilDurum: acilDurumQuery }
        ]
      };
    }

    const results = await Yardim.find(query);
    res.json(results);
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
    const results = await Yardim.findById(req.params.id);
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

   

module.exports = router;


async function checkConnection() {
  if (mongoose.connection.readyState != 1) {
    await connectDB();
  }
}

module.exports = router;
