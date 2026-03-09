"use strict";
const myLogger = require("../loggers/mylogger.log");

const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};

const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
  NO_CONTENT: "No Content",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.status = statusCode;
    this.message = !message ? reasonStatusCode : message;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    const req = res.req;
    myLogger.log(this.message, {
      context: req.path,
      requestId: req.headers["x-request-id"] || "unknown",
      message: this.message,
      metadata: this.metadata,
    });
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata = {}) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor(
    message,
    metadata = {},
    reasonStatusCode = ReasonStatusCode.CREATED,
    statusCode = StatusCode.CREATED,
  ) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED,
};
