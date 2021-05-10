import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import expressWinston from "express-winston";
import morgan from "morgan";
import path from "path";
import { dirname } from "path";
import { createStream } from "rotating-file-stream";
import { fileURLToPath } from "url";
import winston from "winston";
import { initModulesServerRoutes, initModulesServerPolicies } from "./init.js";

/**
 * Initialize application middleware
 */
export const initMiddleware = function (app: Express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  app.use("/api/payments/stripe/webhook", bodyParser.raw({ type: "*/*" }));
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cookieParser());

  if (!(process.env.NODE_ENV === "test")) {
    if (process.env.NODE_ENV === "production") {
      // create a rotating write stream
      const accessLogStream = createStream("access.log", {
        interval: "1d", // rotate daily
        path: path.join(__dirname, "../../../", "log"),
        maxFiles: 30,
      });
      app.use(morgan("combined", { stream: accessLogStream }));
    } else {
      // create a rotating write stream
      const accessLogStream = createStream("access.log", {
        interval: "1d", // rotate daily
        path: path.join(__dirname, "../../../", "log"),
        maxSize: "1G",
      });
      app.use(morgan("combined", { stream: accessLogStream }));
    }
    app.use(morgan("dev"));
    app.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
        colorize: true,
      })
    );
  }
};

/**
 * Initialize security application middleware
 */
export const initSecurityMiddleware = (app: Express) => {
  app.all("/*", function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE, OPTIONS");
    // Set custom headers for CORS
    res.header(
      "Access-Control-Allow-Headers",
      "Content-type,Accept,X-Access-Token,X-Key"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  });
};

export const initErrorMiddleware = (app: Express) => {
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
  );
};

export const init = () => {
  const app = express();
  // Initialize Express middleware
  initMiddleware(app);

  // Initialize security Express middleware
  initSecurityMiddleware(app);

  // Initialize modules server authorization policies
  initModulesServerPolicies();

  // Initialize modules server routes
  initModulesServerRoutes(app);

  // Initialize error Express middleware
  initErrorMiddleware(app);

  return app;
};
export default { init };
