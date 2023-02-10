const z = require("zod");
const { phoneRegex } = require("../utils");

const createContactSchema = z.object({
  body: z.object({
    adSoyad: z.string(),
    email: z.optional(z.string().email("email gecersiz")),
    telefon: z.preprocess(
      (val) => (val ? val.replace(/ /g, "") : val),
      z
        .string({
          required_error: "telefon alani gerekli",
        })
        .regex(new RegExp(phoneRegex))
    ),
    mesaj: z.optional(z.string()),
  }),
});

module.exports = createContactSchema;
