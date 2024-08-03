import { SECRET_REFRESH_TOKEN } from "../config/env.config.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { getBlackList } from "../utils/cache.util.js";

export async function Verify(req, res, next) {
  // console.log(req?.cookies)
  // const authHeader = req.headers["cookie"]; // get the session cookie from request header
  // console.log(authHeader)
  // if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
  // const cookie = authHeader.split("=")[1];
  // console.log(cookie) // If there is, split the cookie string to get the actual jwt token
  // const accessToken = cookie.split(";")[0];
  const refreshToken = req.cookies["RefreshToken"];
  if (!refreshToken) return res.sendStatus(401);
  const checkIfBlacklisted = await getBlackList(refreshToken); // Check if that token is blacklisted
  // // if true, send an unathorized message, asking for a re-authentication.
  if (checkIfBlacklisted)
    return res
      .status(401)
      .json({ message: "This session has expired. Please login" });
  // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
  // that's like checking the integrity of the refreshToken
  jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, async (err, decoded) => {
    if (err) {
      // if token has been altered, return a forbidden error
      return res
        .status(401)
        .json({ message: "This session has expired. Please login" });
    }
    const { userId } = decoded; // get user id from the decoded token
    const user = await User.findById(userId).select("-password"); // find user by that `userId`
    // console.log(user);
    req.user = user; // put the data object into req.user
    next();
  });
}

export function VerifyRole(req, res, next) {
  try {
    const user = req.user; // we have access to the user object from the request
    const { role } = user; // extract the user role
    // check if user has no advance privileges
    // return an unathorized response
    if (role !== "0x88") {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this page."
      });
    }
    next(); // continue to the next middleware or function
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error"
    });
  }
}
