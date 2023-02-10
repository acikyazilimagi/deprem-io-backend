const z = require("zod");
const { phoneRegex } = require("../utils");

const createAssistantCandidateSchema = z.object({
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
    sehir: z.string({
      required_error: "sehir alani gerekli",
    }),
    ilce: z.optional(z.string()),
    hedefSehir: z.optional(z.string()),
    aciklama: z.optional(z.string()),
    yardimDurumu: z.enum(["bekleniyor", "yolda", "yapildi"]),
    fields: z.optional(z.object()),
  }),
});

module.exports = createAssistantCandidateSchema;
