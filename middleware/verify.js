import { SECRET_REFRESH_TOKEN } from "../config/env.config.js";
import User from "../models/User.js";
import { getBlackList } from "../utils/cache.util.js";
import { verifyToken } from "../utils/jwt.util.js";

export async function Verify(req, res, next) {
  // console.log(req?.cookies)
  // const authHeader = req.headers["cookie"]; // get the session cookie from request header
  // console.log(authHeader)
  // if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
  // const cookie = authHeader.split("=")[1];
  // console.log(cookie) // If there is, split the cookie string to get the actual jwt token
  // const accessToken = cookie.split(";")[0];
  const refreshToken = req.cookies["RefreshToken"];
  if (!refreshToken) {
    res.status(401).json({ message: "RefreshToken doesnt exist" });
    return;
  }

  const checkIfBlacklisted = await getBlackList(refreshToken); // Check if that token is blacklisted
  // // if true, send an unathorized message, asking for a re-authentication.
  if (checkIfBlacklisted) {
    res.status(401).json({ message: "This session has expired. Please login" });
    return;
  }

  // if token has not been blacklisted, verify with jwt to see if it has been tampered with or not.
  // that's like checking the integrity of the refreshToken
  const decoded = await verifyToken(refreshToken, SECRET_REFRESH_TOKEN);
  // console.log(decoded);
  // if token has been tampered with, send an unathorized response
  if (!decoded) return res.sendStatus(401);
  const { userId } = decoded;
  req.userId = userId; // put the data object into req.user
  next();
}

export async function VerifyRole(req, res, next) {
  try {
    const userId = req.userId; // we have access to the user object from the request
    const user = await User.findById(userId).select("-password"); // find user by that `userId`
    if (!user)
      return res.status(404).json({ message: "Account does not exist" });
    // console.log(user);
    const { role } = user; // extract the user role
    // check if user has no advance privileges
    // return an unathorized response
    if (role !== "0x88") {
      res.status(401).json({
        status: "failed",
        message: "You are not authorized to view this page."
      });
      return;
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
