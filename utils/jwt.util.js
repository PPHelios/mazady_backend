import jwt from "jsonwebtoken";
import { jwtAccessTTL, jwtRefreshTTL } from "../config/jwt.config.js";
import {
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN
} from "../config/env.config.js";

export const verifyToken = (token) => jwt.verify(token, SECRET_ACCESS_TOKEN);

export const createAccessToken = (payload) =>
  jwt.sign(payload, SECRET_ACCESS_TOKEN, { expiresIn: jwtAccessTTL });

export const createRefreshToken = (payload) =>
  jwt.sign(payload, SECRET_REFRESH_TOKEN, { expiresIn: jwtRefreshTTL });
