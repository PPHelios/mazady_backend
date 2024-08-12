export const cookieOptions = {
  // maxAge: 20 * 60 * 1000, // would expire in 20minutes
  httpOnly: true, // The cookie is only accessible by the web server
  secure: true,
  sameSite: "None" //'Strict'
};