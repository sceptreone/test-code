const sslChecker = require('ssl-checker');
const axios = require('axios');

const CONSOLE = require('./consoler.service');
const sslDetails = async (hostname) => {
  let results = null;
  try {
    results = await sslChecker(hostname, { method: "GET", port: 443, timeout: 60000, rejectUnauthorized: false });
  } catch (err) {
    CONSOLE.log("[SSL] - Error");
    CONSOLE.error(err);
    results = null;
  }
  return results;
}

const redirectChecker = async (hostname) => {
  let results = null;
  try {
    const response = await axios.get('http://' + hostname)
    CONSOLE.log(response.request._redirectable._currentUrl);
    CONSOLE.log(response.request._redirectable._isRedirect);
    results = {
      currentUrl: response.request._redirectable._currentUrl,
      isRedirect: response.request._redirectable._isRedirect
    }
    return results;
  } catch (err) {
    CONSOLE.error(err);
    return results;
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
  } catch (_) {
    return false;
  }

  return true;
}

module.exports = {
  sslDetails,
  redirectChecker,
  isValidUrl
};
