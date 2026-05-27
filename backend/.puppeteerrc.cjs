const { join } = require('node:path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
