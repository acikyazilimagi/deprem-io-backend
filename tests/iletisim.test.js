import { describe, assert, test } from "vitest";

const buildServer = require("../server/build.js");

describe("/iletisim POST", () => {
  test("should return 400 on missing fields", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "POST",
      url: "/iletisim",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        test: "",
      }),
    });

    assert.equal(response.statusCode, 400);
  });
});
