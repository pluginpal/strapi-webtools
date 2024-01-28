

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
import contentApiUrlAliasController from './content-api/controllers/url-alias';
import contentApiCoreController from './content-api/controllers/core';
import contentApiByPathService from './content-api/services/by-path';
import contentApiUrlAliasRoutes from './content-api/routes/url-alias';
import contentApiUrlAliasService from './content-api/services/url-alias';
import contentApiCoreRoutes from './content-api/routes/core';
import { IStrapi } from './types/strapi';

export default {
  register: ({ strapi }: { strapi: IStrapi }) => {
    adminApiRegister(strapi);
  },
  bootstrap: ({ strapi }: { strapi: IStrapi }) => {
    adminApiBootstrap(strapi);
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
      routes: [
        ...contentApiUrlAliasRoutes,
        ...contentApiCoreRoutes,
      ],
    },
  },
  controllers: {
    'url-alias': contentApiUrlAliasController,
    'url-alias-admin': adminApiUrlAliasController,
    'url-pattern': adminApiUrlPatternController,
    info: adminApiInfoController,
    core: contentApiCoreController,
  },
  services: {
    'url-alias': contentApiUrlAliasService,
    urlAliasService: adminApiUrlAliasService,
    urlPatternService: adminApiUrlPatternService,
    byPathService: contentApiByPathService,
    queryLayerDecorator: queryLayerDecoratorService,
  },
};
