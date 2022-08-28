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
const adminApiOverrideQueryLayerService = require('./admin-api/services/override-query-layer');

// Content API
const contentApiByPathController = require('./content-api/controllers/by-path');
const contentApiPreparePathService = require('./content-api/services/prepare-path');
const contentApiByPathService = require('./content-api/services/by-path');
const contentApiPathRoutes = require('./content-api/routes/path');

// Queue API
const queueApiQueueSchema = require('./queue/content-types/queue/schema.json');
const queueApiJobSchema = require('./queue/content-types/job/schema.json');
const queueApiQueueService = require('./queue/services/queue');
const queueApiQueueHelperService = require('./queue/services/helpers');
// const { getPluginService } = require('./util/getPluginService');

module.exports = {
  register: async ({ strapi }) => {
    await adminApiRegister(strapi);
  },
  bootstrap: async () => {
    await adminApiBootstrap();

    // const queueName = 'url-alias creation queue 9';
    // await getPluginService('queueService').process(queueName, async (job, done) => {
    //   console.log('we be processing the job breh', job.data);
    //   done();
    // });

    // await getPluginService('queueService').create(queueName);
    // await getPluginService('queueService').addJob(queueName, {
    //   some: 'data',
    // });
    // await getPluginService('queueService').addJob(queueName, {
    //   some: 'more data',
    // });
    // await getPluginService('queueService').addJob(queueName, {
    //   some: 'even data',
    // });
  },
  contentTypes: {
    path: {
      schema: adminApiPathSchema,
    },
    pattern: {
      schema: adminApiPatternSchema,
    },
    queue: {
      schema: queueApiQueueSchema,
    },
    job: {
      schema: queueApiJobSchema,
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
      routes: [
        ...contentApiPathRoutes,
      ],
    },
  },
  controllers: {
    path: adminApiPathController,
    pattern: adminApiPatternController,
    info: adminApiInfoController,
    byPath: contentApiByPathController,
  },
  services: {
    preparePathService: contentApiPreparePathService,
    pathService: adminApiPathService,
    patternService: adminApiPatternService,
    lifecycleService: adminApiLifecycleService,
    byPathService: contentApiByPathService,
    overrideQueryLayer: adminApiOverrideQueryLayerService,
    queueService: queueApiQueueService,
    queueHelpers: queueApiQueueHelperService,
  },
};
