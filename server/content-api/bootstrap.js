'use strict';

const preparePathMiddleware = require('./middleware/prepare-path');

module.exports = async () => {
  preparePathMiddleware(strapi);
};
