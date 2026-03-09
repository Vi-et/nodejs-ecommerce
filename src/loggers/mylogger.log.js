"use strict";
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`;
      },
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint,
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint,
          ),
          dirname: "src/logs",
          level: "info",
        }),

        new transports.DailyRotateFile({
          filename: "error-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint,
          ),
          dirname: "src/logs",
          level: "error",
        }),
      ],
    });
  }

  logInfo(message, params = {}) {
    this.logger.info(message, params);
  }

  logError(message, params = {}) {
    this.logger.error(message, params);
  }

  logWarn(message, params = {}) {
    this.logger.warn(message, params);
  }

  logDebug(message, params = {}) {
    this.logger.debug(message, params);
  }

  logHttp(message, params = {}) {
    this.logger.http(message, params);
  }

  logSilly(message, params = {}) {
    this.logger.silly(message, params);
  }

  logVerbose(message, params = {}) {
    this.logger.verbose(message, params);
  }

  logDebug(message, params = {}) {
    this.logger.debug(message, params);
  }
}

module.exports = new MyLogger();
