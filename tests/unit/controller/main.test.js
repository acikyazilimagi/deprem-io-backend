import { afterAll, beforeAll, describe, expect, test } from "vitest";

const buildServer = require("../../../server/build.js");

describe("Main Controller Tests", () => {
  const fastify = buildServer();

  beforeAll(async () => {
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  test("/", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/",
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)["status"]).toBe("up");
  });
});
