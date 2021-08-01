const CONSTANTS = require('../constants');
const STAN = require('node-nats-streaming');
const { v4: uuidv4 } = require('uuid');
require('events').EventEmitter.defaultMaxListeners = 0;

const CONSOLE = require('./consoler.service');
async function publishMessage(subject, data) {

  let uuid = uuidv4();
  let stan = STAN.connect(CONSTANTS.NATS_CLUSTER_ID, `${uuid}_${CONSTANTS.NATS_PUBLISHER_CLIENT_ID}`, CONSTANTS.NATS_SERVER);

  stan.on('connect', () => {
    CONSOLE.log('STAN CONNECTED!');

    const body = JSON.stringify({
      type: subject.split(".").join("_"),
      data
    });

    stan.publish(subject, body, (err, guid) => {
      if (err) {
        CONSOLE.error(err);
      }
      CONSOLE.log(`PUBLISHED ${subject} (${guid})`);
      stan.close();
    });

  });

  stan.on('close', function () {
    CONSOLE.log('[STAN] close')
  })

  stan.on('error', function (reason) {
    CONSOLE.log(`STAN ERROR => ${reason}`);
  });
}

module.exports = {
  publishMessage
}