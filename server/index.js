'use strict';

// Admin API
const adminApiRegister = require('./admin-api/register');
const adminApiBootstrap = require('./admin-api/bootstrap');
const adminApiPathSchema = require('./admin-api/content-types/path/schema.json');
const adminApiPatternSchema = require('./admin-api/content-types/pattern/schema.json');
const adminApiPathController = require('./admin-api/controllers/path');
const adminApiPatternController = require('./admin-api/controllers/pattern');
const adminApiInfoController = require('./admin-api/controllers/info');
const adminApiPathService = require('./admin-api/services/path');
const adminApiPatternService = require('./admin-api/services/pattern');
const adminApiPathRoutes = require('./admin-api/routes/path');
const adminApiPatternRoutes = require('./admin-api/routes/pattern');
const adminApiInfoRoutes = require('./admin-api/routes/info');
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
    pattern: {
      schema: adminApiPatternSchema,
    },
  },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        ...adminApiPathRoutes,
        ...adminApiPatternRoutes,
        ...adminApiInfoRoutes,
      ],
    },
    "content-api": {
      type: "content-api",
      routes: [],
    },
  },
  controllers: {
    path: adminApiPathController,
    pattern: adminApiPatternController,
    info: adminApiInfoController,
  },
  services: {
    preparePathService: contentApiPreparePathService,
    pathService: adminApiPathService,
    patternService: adminApiPatternService,
    lifecycleService: adminApiLifecycleService,
  },
};
