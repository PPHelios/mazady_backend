import AuthRouter from "./auth.js";
import AdminRouter from "./admin.js";
import UserRouter from "./user.js";
import SearchRouter from "./search.js";
const Route = (server) => {
  server.get("/favico.ico", (req, res) => {
    res.sendStatus(404);
  });

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
  server.use("/dashboard", AdminRouter);
  server.use("/auth", AuthRouter);
  server.use("/search", SearchRouter);
  server.use("/", UserRouter);
};
export default Route;
