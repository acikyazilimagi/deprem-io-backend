const check = new (require("../../lib/Check"))();
const Iletisim = require("../../models/iletisimModel");

module.exports = async function (fastifyInstance) {
  fastifyInstance.post(
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
};
