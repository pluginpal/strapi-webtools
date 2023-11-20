

// Has to be imported once for build
import { } from '@strapi/strapi';
// Admin API
import adminApiRegister from './admin-api/register';
import adminApiBootstrap from './admin-api/bootstrap';
import adminApiConfig from './admin-api/config';
import adminApiUrlAliasSchema from './admin-api/content-types/url-alias/schema.json';
import adminApiUrlPatternSchema from './admin-api/content-types/url-pattern/schema.json';
import adminApiUrlAliasController from './admin-api/controllers/url-alias';
import adminApiUrlPatternController from './admin-api/controllers/url-pattern';
import adminApiInfoController from './admin-api/controllers/info';
import adminApiUrlAliasService from './admin-api/services/url-alias';
import adminApiUrlPatternService from './admin-api/services/url-pattern';
import adminApiUrlAliasRoutes from './admin-api/routes/url-alias';
import adminApiUrlPatternRoutes from './admin-api/routes/url-pattern';
import adminApiInfoRoutes from './admin-api/routes/info';
import queryLayerDecoratorService from './admin-api/services/query-layer-decorator';

// Content API
import contentApiByPathController from './content-api/controllers/by-path';
import contentApiByPathService from './content-api/services/by-path';
import contentApiPathRoutes from './content-api/routes/path';

export default {
  register: async ({ strapi }) => {
    await adminApiRegister(strapi);
  },
  bootstrap: async ({ strapi }) => {
    await adminApiBootstrap({ strapi });
  },
  config: adminApiConfig,
  contentTypes: {
    'url-alias': {
      schema: adminApiUrlAliasSchema,
    },
    'url-pattern': {
      schema: adminApiUrlPatternSchema,
    },
  },
  routes: {
    admin: {
      type: 'admin',
      routes: [
        ...adminApiUrlAliasRoutes,
        ...adminApiUrlPatternRoutes,
        ...adminApiInfoRoutes,
      ],
    },
    'content-api': {
      type: 'content-api',
      routes: [...contentApiPathRoutes],
    },
  },
  controllers: {
    path: adminApiUrlAliasController,
    pattern: adminApiUrlPatternController,
    info: adminApiInfoController,
    byPath: contentApiByPathController,
  },
  services: {
    urlAliasService: adminApiUrlAliasService,
    urlPatternService: adminApiUrlPatternService,
    byPathService: contentApiByPathService,
    queryLayerDecorator: queryLayerDecoratorService,
  },
};
