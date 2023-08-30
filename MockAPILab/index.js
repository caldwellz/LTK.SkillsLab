const express = require('express');
const helmet = require('helmet');
const { sendStatus } = require('./lib');
const loans = require('./routes/loans');

const app = express();
const port = 5003;
const isLocal = true;
const localDynamoPort = 6001;

// Set up middleware
app.use(helmet());
app.use(express.json());
app.disable('x-powered-by');

// Do authentication/authorization
app.use((req, res, next) => {
  // Pretend this checks an API key and/or does other authorization for protected routes
  if (false) {
    sendStatus(res, 403, 'Access denied');
  } else {
    next();
  }
});

app.use('/loans', loans);

// Add a catch-all error handler
app.use('*', (req, res) => {
  sendStatus(res, 404, 'Invalid endpoint or HTTP method');
});

if (isLocal) {
  //local host
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  const dynalite = require('dynalite');
  const dynaliteServer = dynalite({ path: './mydb', createTableMs: 50 });
  dynaliteServer.listen(localDynamoPort, (err) => {
    if (err) throw err;
    console.log(`Dynalite started on port ${localDynamoPort}`);
  });
} else {
  //for lambda export
  module.exports = app;
}
