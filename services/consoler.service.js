const CONSTANTS = require("../constants");

const env = (env) => {
  log("******************************************************");
  log("*                                                    *");
  log("*            PROCESS ENV INFORMATION                 *");
  log("*                                                    *");
  log("******************************************************");
  env = Object.entries(env);

  for (let i = 0; i < env.length; i++) {
    log(`${env[i][0]} : ${env[i][1]}`)
  }

  log("******************************************************");
};

const log = (log) => {
  if (typeof log !== 'string') {
    console.log(`[${CONSTANTS.MS_NAME}]-(${CONSTANTS.HOSTNAME})`);
    console.log(log);
  } else {
    console.log(`[${CONSTANTS.MS_NAME}]-(${CONSTANTS.HOSTNAME})-(${log})`);
  };
};

const debug = (log) => {
  console.debug(`[${CONSTANTS.MS_NAME}]-(${CONSTANTS.HOSTNAME})-(${log})`);
};

const info = (log) => {
  console.info(`[${CONSTANTS.MS_NAME}]-(${CONSTANTS.HOSTNAME})-(${log})`);
};

const warn = (log) => {
  console.warn(`[${CONSTANTS.MS_NAME}]-(${CONSTANTS.HOSTNAME})-(${log})`);
};

const error = (err, otherMsg = '') => {
  if (otherMsg !== '' && Object.getOwnPropertyNames(err).length > 0) {
    console.error(`\n[${CONSTANTS.MS_NAME}]-[${CONSTANTS.HOSTNAME}]-[ERROR]\nNAME:    ${err.name}\nMESSAGE: ${err.message}\nSTACK:   ${err.stack}\nOTHER_MESSAGE: ${otherMsg}\n`);
  } else if (otherMsg !== '' && Object.getOwnPropertyNames(err).length < 1) {
    console.error(`\n[${CONSTANTS.MS_NAME}]-[${CONSTANTS.HOSTNAME}]-[ERROR]\nOTHER_MESSAGE: ${otherMsg}\n`);
  } else {
    console.error(`\n[${CONSTANTS.MS_NAME}]-[${CONSTANTS.HOSTNAME}]-[ERROR]\nNAME:    ${err.name}\nMESSAGE: ${err.message}\nSTACK:   ${err.stack}\n`);
  }
};

module.exports = {
  env,
  log,
  error,
  debug,
  info,
  warn
}