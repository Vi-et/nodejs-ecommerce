const app = require('./src/app');
const mongoose = require('mongoose');

const PORT =  process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(async () => {
    console.log('Server closed');
    await mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});