const z = require("zod");
const { phoneRegex } = require("../utils");

const createHelpSchema = z.object({
  body: z.object({
    yardimTipi: z.string({
      required_error: "yardimTipi alani gerekli",
    }),
    adSoyad: z.string({
      required_error: "adSoyad alani gerekli",
    }),
    telefon: z.preprocess(
      (val) => (val ? val.replace(/ /g, "") : val),
      z
        .string({
          required_error: "telefon alani gerekli",
        })
        .regex(new RegExp(phoneRegex))
    ),
    yedekTelefonlar: z.optional(
      z.array(
        z.preprocess(
          (val) => (val ? val.replace(/ /g, "") : val),
          z
            .string({
              required_error: "telefon alani gerekli",
            })
            .regex(new RegExp(phoneRegex))
        )
      )
    ),
    email: z.optional(z.string().email("email gecersiz")),
    sehir: z.string({
      required_error: "sehir alani gerekli",
    }),
    adres: z.string({
      required_error: "adres alani gerekli",
    }),
    adresTarifi: z.optional(z.string()),
    acilDurum: z.enum(["normal", "orta", "kritik"]),
    kisiSayisi: z.optional(z.string()),
    yardimDurumu: z.enum(["bekleniyor", "yolda", "yapildi"]),
    fizikiDurum: z.optional(z.string()),
    googleMapLink: z.optional(z.string()),
    tweetLink: z.optional(z.string()),
    fields: z.optional(z.object()),
  }),
});

module.exports = createHelpSchema;
