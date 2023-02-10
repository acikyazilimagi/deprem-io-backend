import type { MongoClient } from "mongoose";
import type {
  FastifyInstance as OriginalFastifyInstance,
  FastifyRequest as OriginalFastifyRequest,
  FastifyReply as OriginalFastifyReply,
} from "fastify";
import mongoose from "mongoose";
import config from "../config.js";
import cache from "../cache.js";

declare global {
  interface FastifyInstance extends OriginalFastifyInstance {
    config: typeof config;
    mongoose: typeof mongoose;
    cache: typeof cache;
  }

  interface FastifyRequest extends OriginalFastifyRequest {}

  interface FastifyReply extends OriginalFastifyReply {}
}
