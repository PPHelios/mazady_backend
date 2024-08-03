import { RateLimiterMemory } from "rate-limiter-flexible";

const opts = {
  points: 10, // Number of points
  duration: 60 // Per second(s)
};
const rateLimiter = new RateLimiterMemory(opts);

export const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip, 2) // consume 2 points
    .then((rateLimiterRes) => {
      // 2 points consumed
      // console.log(rateLimiterRes);
      next();
    })
    .catch((rateLimiterRes) => {
      // Not enough points to consume
      // console.log("rateLimiter errr");
      // console.log(rateLimiterRes);
      res.sendStatus(429);
    });
};
