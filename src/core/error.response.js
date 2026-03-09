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

    MyLogger.error(this.message, ["test_api", "v3334444", { erorr: "Bad" }]);
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
