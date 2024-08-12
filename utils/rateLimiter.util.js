import { RateLimiterRedis } from "rate-limiter-flexible";
import { createClient } from "redis";
import { REDIS_HOST } from "../config/env.config.js";

// Create Redis client
const redisClient = createClient({
  url: REDIS_HOST
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Initialize the client
await redisClient.connect();

const opts = {
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 10, // Number of points
  duration: 60 // Per second(s)
};
export const rateLimiter = new RateLimiterRedis(opts);
