'use strict';

// Admin API
const adminApiRegister = require('./admin-api/register');
const adminApiBootstrap = require('./admin-api/bootstrap');
const adminApiPathSchema = require('./admin-api/content-types/path/schema.json');
const adminApiPathController = require('./admin-api/controllers/path');
const adminApiPathService = require('./admin-api/services/path');
const adminApiPathRoutes = require('./admin-api/routes/path');
const adminApiLifecycleService = require('./admin-api/services/lifecycle');

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
  routes: {
    admin: {
      type: 'admin',
      routes: [
        ...adminApiPathRoutes,
      ],
    },
    "content-api": {
      type: "content-api",
      routes: [],
    },
  },
  controllers: {
    path: adminApiPathController,
  },
  services: {
    preparePathService: contentApiPreparePathService,
    pathService: adminApiPathService,
    lifecycleService: adminApiLifecycleService,
  },
};
