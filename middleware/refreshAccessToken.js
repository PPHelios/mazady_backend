import jwt from "jsonwebtoken";
import {
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN
} from "../config/env.config.js";
import { cookieOptions } from "../config/cookie.config.js";
import { createAccessToken } from "../utils/jwt.util.js";

// Generate new access token if it is expired using refresh token

export default function refreshAccessToken(req, res, next) {
  // console.time("refreshAccessToken");
  const accessToken = req.cookies["AccessToken"];
  if (!accessToken) return res.sendStatus(401);
  jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err) => {
    // If access token is expired, generate new one
    if (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies["RefreshToken"];
        if (!refreshToken) return res.sendStatus(401);
        jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, async (err, decoded) => {
          if (err) {
            console.log(err);
            return res.sendStatus(401);
          }
          const { userId } = decoded;
          const accessToken = createAccessToken({ userId });
          res.cookie("AccessToken", accessToken, cookieOptions);
          console.log("refreshed token");
        });
      } else {
        console.log(err);
        return res.sendStatus(401);
      }
    }
  });
  // console.timeEnd("refreshAccessToken");
  next();
}
