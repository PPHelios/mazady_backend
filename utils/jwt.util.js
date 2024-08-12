import jwt from "jsonwebtoken";
import { jwtAccessTTL, jwtRefreshTTL } from "../config/jwt.config.js";
import {
  SECRET_ACCESS_TOKEN,
  SECRET_REFRESH_TOKEN
} from "../config/env.config.js";

export const verifyToken = async(token,secret) => jwt.verify(token, secret,async(err,decoded)=>{
  if(err){
    console.log(err.message)
    return res
    .status(401)
    .json({ message: "This session has expired. Please login" });
  }
  // console.log(decoded)
  return decoded
});

export const createAccessToken = (payload) =>
  jwt.sign(payload, SECRET_ACCESS_TOKEN, { expiresIn: jwtAccessTTL });

export const createRefreshToken = (payload) =>
  jwt.sign(payload, SECRET_REFRESH_TOKEN, { expiresIn: jwtRefreshTTL });
