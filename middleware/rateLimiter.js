import { rateLimiter } from "../utils/rateLimiter.util.js";

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
