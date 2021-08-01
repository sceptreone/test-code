const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CONSTANTS = require('../constants');
const { workerFunction } = require('../services/worker.service');

router.get('/', async (req, res, next) => {
  res.status(200).json({ name: 'PROFILER SSL WORKER' });
});

router.get('/_health', async (req, res, next) => {
  let status = 'Not Connected'
  if (mongoose.connection.readyState === 1) {
    status = 'Connected';
  }

  res.status(200).send({ status, hostname: CONSTANTS.HOSTNAME, name: "PROFILER SSL WORKER" })
});

router.post('/runSslWorker', workerFunction);

module.exports = router;