import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { serializerCompiler } from "fastify-type-provider-zod";
import { createSampleApi, sampleResponseSchema } from "../src/sample-api";

describe("Fastify + Zod on the Bun/TypeScript/Vitest baseline", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("runs Vitest with Bun as the JavaScript runtime", () => {
    expect(process.versions.bun).toBeDefined();
  });

  it("accepts a schema-valid request and returns the typed response", async () => {
    app = createSampleApi();
    const response = await app.inject({
      method: "POST",
      url: "/sample",
      payload: { label: "synthetic", count: 3 },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ accepted: true, summary: "synthetic:3" });
  });

  it("rejects an invalid request body at runtime", async () => {
    app = createSampleApi();
    const response = await app.inject({
      method: "POST",
      url: "/sample",
      payload: { label: "", count: -1 },
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects an invalid response payload through the Zod serializer", () => {
    const serialize = serializerCompiler({
      schema: sampleResponseSchema,
      method: "GET",
      url: "/sample",
    });

    expect(() => serialize({ accepted: "yes", summary: "not a boolean" })).toThrow();
  });

  it("rejects a request whose numeric field has the wrong runtime type", async () => {
    app = createSampleApi();
    const response = await app.inject({
      method: "POST",
      url: "/sample",
      payload: { label: "synthetic", count: "3" },
    });

    expect(response.statusCode).toBe(400);
  });
});
