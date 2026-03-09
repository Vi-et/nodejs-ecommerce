"use strict";
const MyLogger = require("../loggers/mylogger.log");

const StatusCode = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: "Forbidden",
  UNAUTHORIZED: "Unauthorized",
  CONFLICT: "Conflict",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
    this._logged = false; // flag để tránh log trùng
  }

  log(context = "unknown", requestId = "unknown") {
    if (this._logged) return; // đã log rồi thì bỏ qua
    this._logged = true;
    MyLogger.logError(this.message, {
      context,
      requestId,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata || {},
    });
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  ErrorResponse,
};
