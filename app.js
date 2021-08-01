const CONSTANTS = require('./constants');
const CONSOLE = require('./services/consoler.service');
CONSOLE.env(CONSTANTS);
const express = require('express');
const responseTime = require('response-time');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const app = express();

app.use(logger('debug'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(responseTime());

let mongoConnected = false;
(async () => {
  while (true) {
    if (mongoConnected) {
      break;
    }

    if (!mongoConnected) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          keepAlive: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          poolSize: parseInt(process.env.MONGODB_POOLSIZE)
        }).then(() => {
          CONSOLE.log('[SSL_WORKER] - MONGODB CONNECTED');
          mongoConnected = true;
        },
          error => {
            CONSOLE.error(error)
          }
        );
      } catch (err) {
        CONSOLE.error(err);
      }
    }
    await sleep(2000);
  }
})();

app.use('/', indexRouter);

module.exports = app;
