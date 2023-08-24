"use strict";

// Has to be imported once for build
import { } from "@strapi/strapi";
// Admin API
import adminApiRegister from "./admin-api/register";
import adminApiBootstrap from "./admin-api/bootstrap";
import adminApiPathSchema from "./admin-api/content-types/path/schema.json";
import adminApiPatternSchema from "./admin-api/content-types/pattern/schema.json";
import adminApiRedirectSchema from "./admin-api/content-types/redirect/schema.json";
import adminApiPathController from "./admin-api/controllers/path";
import adminApiPatternController from "./admin-api/controllers/pattern";
import adminApiInfoController from "./admin-api/controllers/info";
import adminApiPathService from "./admin-api/services/path";
import adminApiPatternService from "./admin-api/services/pattern";
import adminApiPathRoutes from "./admin-api/routes/path";
import adminApiPatternRoutes from "./admin-api/routes/pattern";
import adminApiInfoRoutes from "./admin-api/routes/info";
import adminApiLifecycleService from "./admin-api/services/lifecycle";
import adminApiOverrideQueryLayerService from "./admin-api/services/override-query-layer";
import adminApiInfoService from "./admin-api/services/info";
import adminApiRedirectService from "./admin-api/services/redirect";

// Content API
import contentApiByPathController from "./content-api/controllers/by-path";
import contentApiPreparePathService from "./content-api/services/prepare-path";
import contentApiByPathService from "./content-api/services/by-path";
import contentApiPathRoutes from "./content-api/routes/path";

export default {
  register: async ({ strapi }) => {
    await adminApiRegister(strapi);
  },
  bootstrap: async ({ strapi }) => {
    await adminApiBootstrap({ strapi });
  },
  contentTypes: {
    path: {
      schema: adminApiPathSchema,
    },
    pattern: {
      schema: adminApiPatternSchema,
    },
    redirect: {
      schema: adminApiRedirectSchema,
    },
  },
  routes: {
    admin: {
      type: "admin",
      routes: [
        ...adminApiPathRoutes,
        ...adminApiPatternRoutes,
        ...adminApiInfoRoutes,
      ],
    },
    "content-api": {
      type: "content-api",
      routes: [...contentApiPathRoutes],
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
    infoService: adminApiInfoService,
    redirectService: adminApiRedirectService,
  },
};
