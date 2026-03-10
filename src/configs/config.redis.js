"use strict";

const dev = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
};

const prod = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
};

const config = {
  dev,
  prod,
};

const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
