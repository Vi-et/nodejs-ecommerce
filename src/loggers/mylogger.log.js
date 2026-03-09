"use strict";
const { createLogger, format, transports } = require("winston");
const { randomUUID } = require("crypto");
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

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    // Lấy requestId từ header, req có thể là object hoặc string (khi test hardcode)
    const requestId =
      (req && typeof req === "object" ? req.headers?.["x-request-id"] : req) ||
      randomUUID();

    return {
      context,
      requestId,
      metadata,
    };
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign({ message }, paramLog);
    this.logger.error(logObject); // ← phải dùng .error() để ghi vào error log
  }
}

module.exports = new MyLogger();
