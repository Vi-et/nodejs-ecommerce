const app = require("./src/app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { closeRedis } = require("./src/dbs/init.redis");

process.on("SIGINT", () => {
  server.close(async () => {
    console.log("Server closed");
    await mongoose.connection.close();
    console.log("Mongoose disconnected on app termination");
    await closeRedis();
    console.log("Redis disconnected on app termination");
    process.exit(0);
  });
});
