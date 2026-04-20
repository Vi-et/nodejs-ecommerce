"use strict";

const fs = require("fs");
const path = require("path");
const { getRedis } = require("../dbs/init.redis");

const scriptPath = path.join(__dirname, "../scripts/rate_limit.lua");
const script = fs.readFileSync(scriptPath, "utf8");

/**
 * Check if the request is allowed based on the sliding window rate limiting algorithm.
 * @param {string} userId - Unique identifier for the user (IP or user ID).
 * @param {number} limit - Maximum number of requests allowed in the window.
 * @param {number} windowSecs - Duration of the window in seconds.
 * @returns {Promise<{allowed: boolean, estimate: string, remaining: number}>}
 */
const isAllowed = async (userId, limit = 10, windowSecs = 60) => {
  const now = Math.floor(Date.now() / 1000)
  const currentWindowStartAt = Math.floor(now / windowSecs) * windowSecs
  const elapsed = now - currentWindowStartAt
  const previousWindowStartAt = currentWindowStartAt - windowSecs

  const previousKey = `rate:${userId}:${previousWindowStartAt}`
  const currentKey = `rate:${userId}:${currentWindowStartAt}`

  const redis = getRedis().instanceConnect;

  try {
    const [allowed, curr, prev, estimate, remaining] = await redis.eval(
      script, 2,
      currentKey, previousKey,         // KEYS
      limit, windowSecs, elapsed // ARGV
    )

    return {
      allowed: allowed === 1,
      currentCount: curr,
      previousCount: prev,
      estimate: parseFloat(estimate).toFixed(2),
      remaining: remaining
    }
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open or closed depending on policy. Here we fail open.
    return { allowed: true, estimate: "0", remaining: limit };
  }
};

/**
 * Middleware to apply rate limiting.
 * @param {number} limit - Max requests per window.
 * @param {number} windowSecs - Window size in seconds.
 */
const rateLimitMiddleware = (limit = 100, windowSecs = 60) => {
  return async (req, res, next) => {
    const userIp = req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress;
    const identifier = req.user?.id || userIp;

    const result = await isAllowed(identifier, limit, windowSecs);

    res.set({
      "X-RateLimit-Limit": limit,
      "X-RateLimit-Remaining": result.remaining,
      "X-RateLimit-Estimate": result.estimate,
    });

    if (!result.allowed) {
      return res.status(429).json({
        status: "error",
        code: 429,
        message: "Too Many Requests",
        limit,
        remaining: result.remaining,
        estimate: result.estimate,
      });
    }
    next();
  };
};

module.exports = { rateLimitMiddleware };
