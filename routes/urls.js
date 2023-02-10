const mongoose = require("mongoose");
const connectDB = require("../mongo-connection");
const Yardim = require("../models/yardimModel");
const cache = require("../cache");
const YardimEt = require("../models/yardimEtModel");
const Iletisim = require("../models/iletisimModel");
const YardimKaydi = require("../models/yardimKaydiModel");
const YardimEtKaydi = require("../models/yardimEtKaydiModel");
const check = new (require("../lib/Check"))();

/**
 * @param {FastifyInstance} app
 */
module.exports = async function (app) {
  app.get(
    "/",
    {
      schema: {
        tags: ["main"],
        description: "Main page",
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              status: { type: "string" },
            },
          },
        },
      },
    },
    () => ({ status: "up" }),
  );
  app.get(
    "/yardim",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: {
              type: "number",
              default: 1,
            },
            limit: {
              type: "number",
              default: 10,
            },
            yardimTipi: {
              type: "string",
            },
          },
          required: [],
        },
        description: "Yardim listesi",
      },
    },
    async function (req, res) {
      const { page, limit, yardimTipi } = req.query;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};

      let cacheKey = `yardim_${page}_${limit}${yardimTipi}`;
      if (cache.getCache().has(cacheKey)) {
        return cache.getCache().get(cacheKey);
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

      let query = yardimTipi ? { yardimTipi } : {};

      results.totalPage = Math.ceil((await Yardim.countDocuments(query)) / limit);
      results.data = await Yardim.find(query).sort({ _id: -1 }).limit(limit).skip(startIndex).exec();

      results.data = results.data.map((yardim) => {

        if(yardim.email){
          yardim.email = check.hideEmailCharacters(yardim.email);
        }
        yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
        const names = yardim.adSoyad.split(" ");
        if (names.length > 1) {
          yardim.adSoyad = `${names[0].charAt(0)}${"*".repeat(names[0].length - 2)} ${names[1].charAt(0)}${"*".repeat(
            names[1].length - 2,
          )}`;
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

      return results;
    },
  );

  app.post(
    "/yardim",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            yardimTipi: {
              type: "string",
            },
            adSoyad: {
              type: "string",
            },
            adres: {
              type: "string",
            },
            acilDurum: {
              type: "string",
            },
            telefon: {
              type: "string"
            },
          },
          required: ["yardimTipi", "adSoyad", "adres", "acilDurum"],
        },
      },
    },
    async function (req, res) {
      const { yardimTipi, adSoyad, adres, acilDurum, telefon } = req.body;

      if (telefon && !check.isPhoneNumber(telefon)) {
        res.statusCode = 400;
        return {
          error: "Lütfen doğru formatta bir telefon numarası giriniz.(örn: 05554443322)",
        };
      }

      // TODO: yedekTelefonlari JSON schema'ya tasi.
      if (req.body.yedekTelefonlar) {
        if (req.body.yedekTelefonlar.length > 0) {
          let yedekTelefonlar = req.body.yedekTelefonlar;
          for (let i = 0; i < yedekTelefonlar.length; i++) {
            if (!check.isPhoneNumber(yedekTelefonlar[i])) {
              res.statusCode = 400;
              return {
                error: "Lütfen doğru formatta bir telefon numarası giriniz.(örn: 05554443322)",
              };
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
        res.statusCode = 409;
        return {
          error: "Bu yardım bildirimi daha önce veritabanımıza eklendi.",
        };
      }

      const fields = {};

      // TODO: Bunlarin hepsini JSON schema'ya tasiyalim.
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
        ip: req.ip,
        fields: fields || {},
      });

      cache.getCache().flushAll();
      await newYardim.save();
      return { message: "Yardım talebiniz başarıyla alındı" };
    },
  );

  app.post(
    "/yardimet",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            yardimTipi: { type: "string" },
            adSoyad: { type: "string" },
            telefon: {
              type: "string"
            },
            sehir: {
              type: "string",
            },
          },
          required: ["yardimTipi", "adSoyad", "sehir"],
        },
      },
    },
    async function (req, res) {
      const { yardimTipi, adSoyad, telefon, sehir } = req.body;

      if (telefon && !check.isPhoneNumber(telefon)) {
        res.statusCode = 400;
        return {
          error: "Lütfen doğru formatta bir telefon numarası giriniz.(örn: 05554443322)",
        };
      }

      // TODO: yedekTelefonlari json schemaya tasiyalim.
      if (req.body.yedekTelefonlar) {
        if (req.body.yedekTelefonlar.length > 0) {
          let yedekTelefonlar = req.body.yedekTelefonlar;
          for (let i = 0; i < yedekTelefonlar.length; i++) {
            if (!check.isPhoneNumber(yedekTelefonlar[i])) {
              res.statusCode = 400;
              return {
                error: "Lütfen doğru formatta bir telefon numarası giriniz.(örn: 05554443322)"
              }
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
        res.statusCode = 409;
        return {
          error: "Bu yardım bildirimi daha önce veritabanımıza eklendi.",
        };
      }
      const fields = {};

      // TODO: Bunlari JSON schema'ya tasiyalim.
      for (const key in req.body) {
        if (key.startsWith("fields-")) {
          const fieldName = key.split("-")[1];
          fields[fieldName] = req.body[key];
        }
      }

      // Create a new Yardim document
      let hedefSehir = req.body.hedefSehir || "";
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
        ip: req.ip,
      });

      cache.getCache().flushAll();
      await newYardim.save();
      return { message: "Yardım talebiniz başarıyla alındı" };
    },
  );

  app.get(
    "/yardimet",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 10 },
            yardimTipi: { type: "string" },
            sehir: { type: "string" },
            hedefSehir: { type: "string" },
          },
          required: [],
        },
      },
    },
    async function (req, res) {
      const { page, limit, yardimTipi, sehir, hedefSehir } = req.query;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      let data;
      let results = {};

      const cacheKey = `yardimet_${page}_${limit}${yardimTipi}${sehir}${hedefSehir}`;

      if (cache.getCache().has(cacheKey)) {
        return cache.getCache().get(cacheKey);
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

      const searchQuery = yardimTipi ? { yardimTipi } : {};

      if (hedefSehir) searchQuery.hedefSehir = hedefSehir;
      if (sehir) searchQuery.sehir = sehir;

      results.totalPage = Math.ceil((await YardimEt.countDocuments(searchQuery)) / limit);

      results.data = await YardimEt.find(searchQuery).sort({ _id: -1 }).limit(limit).skip(startIndex).exec();
      results.data = results.data.map((yardim) => {
        //console.log('res: '+Object.values(results));
        yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
        const names = yardim.adSoyad.split(" ");
        if (names.length > 0) {
          const name = names[0];
          const surname = names[names.length - 1];
          // hidden name and surname
          yardim.adSoyad = `${name[0]}${"*".repeat(name.length - 1)} ${surname[0]}${"*".repeat(surname.length - 1)}`;
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

      return results;
    },
  );

  app.get(
    "/ara-yardimet",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string" },
            yardimDurumu: { type: "string" },
            helpType: { type: "string" },
            location: { type: "string" },
            hedefSehir: { type: "string" },
          },
          required: [],
        },
      },
    },
    async (req, res) => {
      const queryString = req.query.q;
      const yardimDurumuQuery = req.query.yardimDurumu;
      const helpType = req.query.yardimTipi || "";
      const location = req.query.sehir || "";
      const dest = req.query.hedefSehir || "";
      let query = {
        $or: [{ adSoyad: { $regex: queryString, $options: "i" } }, { telefon: { $regex: queryString, $options: "i" } }],
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
       // console.log('res: '+Object.values(results));
        yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
        const names = yardim.adSoyad.split(" ");
        if (names.length > 1) {
          yardim.adSoyad = `${names[0].charAt(0)}${"*".repeat(names[0].length - 2)} ${names[1].charAt(0)}${"*".repeat(
            names[1].length - 2,
          )}`;
        }
        const yedekTelefonlar = yardim.yedekTelefonlar;
        if (yedekTelefonlar) {
          yardim.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
            return yedekTelefon.replace(/.(?=.{4})/g, "*");
          });
        }
        return yardim;
      });

      return results.data;
    },
  );

  app.get(
    "/ara-yardim",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string" },
            yardimDurumu: { type: "string" },
            acilDurum: { type: "string" },
            yardimTipi: { type: "string" },
            aracDurumu: { type: "string" },
          },
          required: [],
        },
      },
    },
    async (req, res) => {
      const queryString = req.query.q || "";
      const yardimDurumuQuery = req.query.yardimDurumu;
      const acilDurumQuery = req.query.acilDurum;
      const helpType = req.query.yardimTipi;
      const vehicle = req.query.aracDurumu;
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
        if(yardim.email){
          yardim.email=check.hideEmailCharacters(yardim.email);
        }
        yardim.telefon = yardim.telefon.replace(/.(?=.{4})/g, "*");
        const names = yardim.adSoyad.split(" ");
        if (names.length > 1) {
          yardim.adSoyad = `${names[0].charAt(0)}${"*".repeat(names[0].length - 2)} ${names[1].charAt(0)}${"*".repeat(
            names[1].length - 2,
          )}`;
        }
        const yedekTelefonlar = yardim.yedekTelefonlar;
        if (yedekTelefonlar) {
          yardim.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
            return yedekTelefon.replace(/.(?=.{4})/g, "*");
          });
        }
        return yardim;
      });
      return results.data;
    },
  );

  app.get("/yardim/:id", async (req, res) => {
    const cacheKey = `yardim_${req.params.id}`;

    if (cache.getCache().has(cacheKey)) {
      return cache.getCache().get(cacheKey);
    }
    await checkConnection();
    let results = await Yardim.findById(req.params.id);
    try {

      //console.log('res email: '+results.email);
      results.telefon = results.telefon.replace(/.(?=.{4})/g, "*");
      const yedekTelefonlar = results.yedekTelefonlar;
      if (results.yedekTelefonlar) {
        results.yedekTelefonlar = yedekTelefonlar.map((yedekTelefon) => {
          return yedekTelefon.replace(/.(?=.{4})/g, "*");
        });
      }
    } catch (error) { }

    let yardimKaydi = await YardimKaydi.find({ postId: req.params.id });

    cache.getCache().set(cacheKey, {
      results: results,
      yardimKaydi: yardimKaydi,
    });
    if (!results) {
      res.statusCode = 404;
      return { status: 404 };
    }

    return {
      results,
      yardimKaydi,
    };
  });

  app.get("/yardimet/:id", async (req, res) => {
    const cacheKey = `yardimet_${req.params.id}`;

    if (cache.getCache().has(cacheKey)) {
      return cache.getCache().get(cacheKey);
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
      res.statusCode = 404;
      return { status: 404 };
    }

    let yardimEtKaydi = await YardimEtKaydi.find({ postId: req.params.id });

    if (yardimEtKaydi.length > 0) {
      cache.getCache().set(cacheKey, {
        results: results,
        yardimEtKaydi: yardimEtKaydi,
      });
    } else {
      cache.getCache().set(cacheKey, {results:results});
    }
    if (!results) {
      res.statusCode = 404;
      return { status: 404 };
    }

    return {
      results,
      yardimEtKaydi,
    };
  });

  app.post(
    "/iletisim",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            adSoyad: { type: "string" },
            email: { type: "string" },
            mesaj: { type: "string" },
          },
          required: ["adSoyad", "email", "mesaj"],
        },
      },
    },
    async function (req, res) {
      await checkConnection();

      const existingIletisim = await Iletisim.findOne({
        adSoyad: req.body.adSoyad,
        email: req.body.email,
        mesaj: req.body.mesaj,
      });

      if (existingIletisim) {
        res.statusCode = 400;
        return {
          error: "Bu iletişim talebi zaten var, lütfen farklı bir talepte bulunun.",
        };
      }

      let telefon = req.body.telefon?.trim();

      if (telefon && !check.isPhoneNumber(telefon)) {
        res.statusCode = 400;
        return {
          error: "Lütfen doğru formatta bir telefon numarası giriniz.(örn: 05554443322)",
        };
      }

      // Create a new Yardim document
      const newIletisim = new Iletisim({
        adSoyad: req.body.adSoyad || "",
        email: req.body.email || "",
        telefon: telefon || "",
        mesaj: req.body.mesaj || "",
        ip: req.ip,
      });

      await newIletisim.save();
      return { message: "İletişim talebiniz başarıyla alındı" };
    },
  );

  app.post(
    "/ekleYardimKaydi",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            postId: { type: "string" },
            adSoyad: { type: "string", minLength: 3 },
            sonDurum: { type: "string" },
            email: { type: "string" },
            aciklama: { type: "string" },
            telefon: { type: "string" },
          },
          required: ["postId","adSoyad", "sonDurum", "telefon", "aciklama"],
        },
      },
    },
    async (req, res) => {
      await checkConnection();
      const existingYardimKaydi = await Yardim.findOne({
        _id: req.body.postId,
      });
      if (existingYardimKaydi) {
        if (req.body.telefon) {
          if (req.body.telefon.trim().replace(/ /g, "")) {
            if (!check.isPhoneNumber(req.body.telefon)) {
              res.statusCode = 400;
              return {
                error: "Lütfen doğru formatta bir telefon numarası giriniz.(örn: 05554443322)"
              }
            }
          }
          req.body.telefon = req.body.telefon.replace(/ /g, "");
        }
        const newYardimKaydi = new YardimKaydi({
          postId: req.body.postId || "",
          adSoyad: req.body.adSoyad || "",
          telefon: req.body.telefon || "",
          sonDurum: req.body.sonDurum || "",
          email: req.body.email || "",
          aciklama: req.body.aciklama || "",
        });
        await newYardimKaydi.save();
      } else {
        res.statusCode = 400;
        return {
          error: "postId bulunamadı.",
        };
      }

      return { status: 200 };
    },
  );

  app.post(
    "/ekleYardimEtKaydi",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            postId: { type: "string" },
            adSoyad: { type: "string" },
            sonDurum: { type: "string" },
            email: { type: "string" },
            aciklama: { type: "string" },
            telefon: { type: "integer" },
          },
          required: ["postId", "adSoyad", "sonDurum", "telefon", "aciklama"],
        },
      },
    },
    async (req, res) => {
      await checkConnection();
      const existingYardimEtKaydi = await YardimEt.findOne({
        _id: req.body.postId,
      });
      if (existingYardimEtKaydi) {
        const newYardimEtKaydi = new YardimEtKaydi({
          postId: req.body.postId || "",
          adSoyad: req.body.adSoyad || "",
          telefon: req.body.telefon || "",
          sonDurum: req.body.sonDurum || "",
          email: req.body.email || "",
          aciklama: req.body.aciklama || "",
        });
        await newYardimEtKaydi.save();
      } else {
        res.statusCode = 400;
        return {
          error: "postId bulunamadı.",
        };
      }

      return { status: 200 };
    },
  );
};

async function checkConnection() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
  } catch (error) {
    console.log(error);
  }
}
