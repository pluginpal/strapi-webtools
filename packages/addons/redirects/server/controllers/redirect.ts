import { factories } from '@strapi/strapi';

const contentTypeSlug = 'plugin::webtools-addon-redirects.redirect';

export default factories.createCoreController(contentTypeSlug, ({ strapi }) => ({
  config(ctx) {
    ctx.body = strapi.config.get('plugin::webtools-addon-redirects');
  },
}));
