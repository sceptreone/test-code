const os = require("os");
const WORKER_TIMEOUT = parseInt(process.env.WORKER_TIMEOUT) || 500000;
const SLOTS_ALLOCATED = parseInt(process.env.SLOTS_ALLOCATED) || 1;
const HOSTNAME = `SSL_WORKER_${os.hostname()}`;
const MS_NAME = `SSL_WORKER`;

const NATS_URI = process.env.NATS_URI.split(",");
const NATS_SUBJECT = process.env.NATS_SUBJECT;
const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID;
const NATS_CLIENT_ID = HOSTNAME;
const NATS_PUBLISHER_CLIENT_ID = `PUBLISHER_${HOSTNAME}`;
const NATS_SERVER = {
  servers: NATS_URI,
  ackTimeout: 60000,
  connectTimeout: 60000,
};
const NATS_WORKER_SUBJECT = process.env.NATS_WORKER_SUBJECT;
const NATS_CRASH_SUBJECT = process.env.NATS_CRASH_SUBJECT;
module.exports = {
  HOSTNAME,
  SLOTS_ALLOCATED,
  MS_NAME,
  WORKER_TIMEOUT,
  NATS_URI,
  NATS_SUBJECT,
  NATS_CLIENT_ID,
  NATS_PUBLISHER_CLIENT_ID,
  NATS_CLUSTER_ID,
  NATS_SERVER,
  NATS_WORKER_SUBJECT,
  NATS_CRASH_SUBJECT,
};
