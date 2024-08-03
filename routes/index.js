import refreshAccessToken from "../middleware/refreshAccessToken.js";
import { Verify, VerifyRole } from "../middleware/verify.js";
import { rateLimiterMiddleware } from "../utils/rateLimiterMongo.js";
import Auth from "./auth.js";

const Route = (server) => {
  // server.get("/favico.ico", (req, res) => {
  // 	res.sendStatus(404);
  // });

  server.disable("x-powered-by");
  server.use((req, res, next) => {
    console.log(
      req.method,
      req.path,
      new Date(Date.now()).toLocaleString(),
      req.body
    );
    next();
  });

  server.get("/", (req, res) => {
    try {
      res.status(200).json({
        status: "success",
        data: [],
        message: "Welcome to our API homepage!"
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
    }
  });
  server.use("/auth", Auth);
  server.get(
    "/user",
    rateLimiterMiddleware,
    refreshAccessToken,
    Verify,
    (req, res) => {
      res.status(200).json({
        status: "success",
        message: "Welcome to your Dashboard!"
      });
    }
  );
  server.get("/admin", refreshAccessToken, Verify, VerifyRole, (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to the Admin portal!"
    });
  });
};
export default Route;
