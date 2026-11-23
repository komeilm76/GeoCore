import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod/v4";

const requestSchema = z.object({
  label: z.string().min(1),
  count: z.number().int().nonnegative(),
});
export const sampleResponseSchema = z.object({
  accepted: z.boolean(),
  summary: z.string(),
});

type RequestBody = z.infer<typeof requestSchema>;
type ResponseBody = z.infer<typeof sampleResponseSchema>;

/** Compatibility spike only; this does not define a GeoCore API contract. */
export function createSampleApi() {
  const app = Fastify({ logger: false });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.withTypeProvider<ZodTypeProvider>().post(
    "/sample",
    {
      schema: {
        body: requestSchema,
        response: { 200: sampleResponseSchema },
      },
    },
    async (request): Promise<ResponseBody> => {
      // This assignment confirms that the request type is inferred from the Zod schema.
      const body: RequestBody = request.body;
      return {
        accepted: true,
        summary: `${body.label}:${body.count}`,
      };
    },
  );

  return app;
}
