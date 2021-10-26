require('dotenv').config();

if (!process.env.PORT) {
  console.error("ENV file is missing");
}
else {
  createServer();
}

function createServer() {
  const express = require('express');
  const helmet = require('helmet');
  const { inject } = require('./src/routes');
  const cors = require('cors');

  const app = express();
  const port = process.env.PORT;

  // Set up middleware for enabling cors and helmet
  app.use(helmet.hsts());
  app.use(helmet.noSniff());
  app.use(cors());

  // Set up middleware for request parsing
  app.use(express.json());

  // Load up the routes
  inject(app);

  // Start the API
  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}