const CONSTANTS = require("../constants");
let SLOTS_ALLOCATED = CONSTANTS.SLOTS_ALLOCATED;
const domainModel = require("../models/domain.model");
const { sslDetails, redirectChecker } = require('./api.service');
const { publishMessage } = require('./stan.service');
// const STAN = require('node-nats-streaming');
// require('events').EventEmitter.defaultMaxListeners = 0;

const CONSOLE = require('./consoler.service');
const scanner = async (dataC, domainId) => {
  try {
    let clientDomain = await domainModel.findById(domainId);

    let data = await sslDetails(dataC.domain);
    let data2 = await redirectChecker(dataC.domain);

    if (!data) {
      data = {
        "daysRemaining": 0,
        "valid": false,
        "status": "None Found",
        "riskLevel": "CRITICAL",
        "vulnerabilitiesFound": 0,
        "isRedirect": data2 ? data2.isRedirect : false
      }
    } else {
      data.status = "Found";
      data.riskLevel = 'LOW';
      data.isRedirect = data2 ? data2.isRedirect : false;
      data.vulnerabilitiesFound = data.isRedirect ? 0 : 1;
    }

    if (!data.valid) {
      data.daysRemaining = 0;
      data.status = "None Found";
      data.riskLevel = "CRITICAL";
      data.isRedirect = false;
      data.vulnerabilitiesFound = 2;
    }

    clientDomain.sslInfo = data;
    clientDomain.status = 'completed';
    clientDomain = await clientDomain.save();

    return true;
  } catch (err) {
    CONSOLE.error(err);
    clientDomain.status = 'crashed';
    clientDomain = await clientDomain.save();
    return false;
  }
};

const workerFunction = async (req, res) => {
  const start = Date.now();
  if (SLOTS_ALLOCATED < 0 || SLOTS_ALLOCATED > 1) {
    SLOTS_ALLOCATED = CONSTANTS.SLOTS_ALLOCATED;
  }

  if (SLOTS_ALLOCATED < 1) {
    return res.status(503).json({ message: "SLOT OCCUPIED" });
  }

  SLOTS_ALLOCATED = SLOTS_ALLOCATED - 1;
  // const work = { data: {} };
  // const work = {
  //   link: "http://www.basicwebsiteexamplse.co/pricing",
  //   domain: "smallwebsites.co",
  //   scanManagerId: "568c28fffc4be30d44d0398e",
  //   dateNow: 1609595645193
  // };
  let work = req.body;
  if (work) {


    try {
      // let clientDomain = await domainModel.findOne({ subScanId: work.subScanId });
      // if (!clientDomain) {
      let clientDomain = new domainModel({
        domain: work.domain,
        dateNow: work.dateNow,
        subScanId: work.subScanId,
        scanManagerId: work.scanManagerId,
      });
      clientDomain = await clientDomain.save();
      // }

      // Start Scanner
      const result = await scanner(work, clientDomain._id);
      if (result) {
        // Scan Successfull
        // const stan = STAN.connect(CONSTANTS.NATS_CLUSTER_ID, CONSTANTS.NATS_PUBLISHER_CLIENT_ID, CONSTANTS.NATS_SERVER);

        // stan.on('connect', async () => {
        //   CONSOLE.log('STAN CONNECTED!');
        //   const body = JSON.stringify({
        //     type: CONSTANTS.NATS_WORKER_SUBJECT.split(".").join("_"),
        //     data: work
        //   });

        //   stan.publish(CONSTANTS.NATS_WORKER_SUBJECT, body, (err, guid) => {
        //     if (err) {
        //       CONSOLE.error(err)
        //     }
        //     CONSOLE.log(`PUBLISHED ${CONSTANTS.NATS_WORKER_SUBJECT} (${guid})`);
        //     stan.close();
        //     CONSOLE.log('[SSL_WORKER] - PROFILER FINISHED')
        //   });

        //   stan.on('error', function (reason) {
        //     CONSOLE.log(`STAN ERROR => ${reason}`);
        //     stan.close();
        //   });
        // });
        const end = Date.now();
        let temp = {
          start,
          end,
          link: work.link,
          worker: 'ssl'
        };
        //await publishMessage('PERFORMANCE_STAGING', temp);
        await publishMessage(CONSTANTS.NATS_WORKER_SUBJECT, work);
        SLOTS_ALLOCATED = SLOTS_ALLOCATED + 1;
        return res.status(200).json({ message: "TASK COMPLETED" });

      } else {
        // Scan Failed
        await publishMessage(CONSTANTS.NATS_CRASH_SUBJECT, work);
        SLOTS_ALLOCATED = SLOTS_ALLOCATED + 1;
        return res.status(200).json({ message: "TASK FAILEd", error: result })
      }
    } catch (err) {
      CONSOLE.log("[SSL_WORKER] - ERROR DOMAIN CRASH");
      await publishMessage(CONSTANTS.NATS_CRASH_SUBJECT, work);
      CONSOLE.error(err);
      SLOTS_ALLOCATED = SLOTS_ALLOCATED + 1;
      return res.status(200).json({ message: "TASK FAILEd", error: JSON.stringify(err) })
    }
  }
}

// (async () => {
//   await Promise.all([workerFunction()]);
// })()

module.exports = {
  workerFunction
};
