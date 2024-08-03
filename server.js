import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Route from "./routes/index.js";
import { PORT, WHITE_LISTED_END_POINTS } from "./config/env.config.js";
import helmet from "helmet";
import { connectToMongo } from "./utils/connectToMongo.util.js";
// === CREATE SERVER ===
const server = express();
// Allow request from any source. In real production, this should be limited to allowed origins only
const allowedOrigins =
  WHITE_LISTED_END_POINTS.split(","); /** other domains if any */
// console.log(allowedOrigins);
server.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1 || !origin) {
        // Not allowed
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    credentials: true // Allow cookies to be sent
  })
);
server.disable("x-powered-by"); //Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Use helmet to set up various security headers
server.use(helmet());

// Set up Content Security Policy separately
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  })
);
// ===  CREATE DATABASE ===

await connectToMongo();

// ===  CONFIGURE ROUTES ===
// Configure Route

Route(server);

// === 5 - START UP SERVER ===
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
