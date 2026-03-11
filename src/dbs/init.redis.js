"use strict";

const redis = require("ioredis");
const { RedisError } = require("../core/error.response");

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connectionTimeOut;

const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
      vi: "Lỗi kết nối Redis quá thời gian",
      en: "Redis connection timeout",
    },
  };

const handleTimeoutError = () => {
  connectionTimeOut = setTimeout(() => {
    console.error(REDIS_CONNECT_MESSAGE.message.vi);
    // Thay vì throw crash app, ta chỉ log lỗi hoặc xử lý logic riêng ở đây
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionRedis - Connection status: connected`);
    clearTimeout(connectionTimeOut);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`connectionRedis - Connection status: disconnected`);
    clearTimeout(connectionTimeOut);
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionRedis - Connection status: reconnecting`);
    clearTimeout(connectionTimeOut);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection status: error ${err}`);
    handleTimeoutError();
  });
};

const {
  redis: { host, port },
} = require("../configs/config.redis");

const initRedis = async () => {
  const instanceRedis = new redis({
    host,
    port,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });
  client.instanceConnect = instanceRedis;
  handleEventConnection({ connectionRedis: instanceRedis });

  try {
    await instanceRedis.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
};

const getRedis = () => client;

const closeRedis = async () => {
  if (client.instanceConnect) {
    await client.instanceConnect.quit();
  }
};

module.exports = { initRedis, getRedis, closeRedis };
