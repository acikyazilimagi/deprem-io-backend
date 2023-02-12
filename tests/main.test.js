import { describe, assert, test } from "vitest";

const buildServer = require("../server/build.js");

describe("Main Controller Tests", () => {
  test("/", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(await response.json(), { status: "up" });
  });
});
