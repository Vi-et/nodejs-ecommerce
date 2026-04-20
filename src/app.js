require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db
require("./dbs/init.mongo");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

const initRedis = require("./dbs/init.redis");
initRedis.initRedis();

const { rateLimitMiddleware } = require("./middlewares/rateLimit.middleware");
app.use(rateLimitMiddleware(100, 60));

//init routes
app.use("", require("./routes"));
//handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

const MyLogger = require("./loggers/mylogger.log");
const { ErrorResponse } = require("./core/error.response");

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const resMessage = error.message || "Internal Server Error";

  MyLogger.error(resMessage, [req.path, req, { stack: error.stack }]);

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: resMessage,
  });
});
module.exports = app;
