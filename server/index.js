'use strict';

// Admin API
const adminApiRegister = require('./admin-api/register');
const adminApiBootstrap = require('./admin-api/bootstrap');
const adminApiPathSchema = require('./admin-api/content-types/path/schema.json');
const adminApiPathService = require('./admin-api/services/path');

// Content API
const contentApiBootstrap = require('./content-api/bootstrap');
const contentApiPreparePathService = require('./content-api/services/prepare-path');

module.exports = {
  register: async ({ strapi }) => {
    await adminApiRegister(strapi);
  },
  bootstrap: async () => {
    await adminApiBootstrap();
    await contentApiBootstrap();
  },
  contentTypes: {
    path: {
      schema: adminApiPathSchema,
    },
  },
  services: {
    preparePathService: contentApiPreparePathService,
    pathService: adminApiPathService,
  },
};
