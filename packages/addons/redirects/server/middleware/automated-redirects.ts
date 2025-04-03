import { Modules } from '@strapi/strapi';

// eslint-disable-next-line max-len
const automatedRedirectsMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action } = context;

  // Only run this for the URL alias entities.
  if (uid !== 'plugin::webtools.url-alias') {
    return next();
  }

  // Run this middleware only for the update action.
  if (!['update'].includes(action)) {
    return next();
  }

  // Run this middleware only if the auto_generate setting is enabled.
  if (!strapi.config.get('plugin::webtools-addon-redirects.auto_generate', true)) {
    return next();
  }

  const params = context.params as Modules.Documents.ServiceParams<'plugin::webtools.url-alias'>['update'] & { documentId: string };

  const existingAlias = await strapi.documents('plugin::webtools.url-alias').findOne({
    documentId: params.documentId,
  });

  if (params.data.url_path !== existingAlias.url_path) {
    await strapi.documents('plugin::webtools-addon-redirects.redirect').create({
      data: {
        from: existingAlias.url_path,
        to: params.data.url_path,
        status_code: strapi.config.get('plugin::webtools-addon-redirects.default_status_code', 307),
      },
    });
  }

  return next();
};

export default automatedRedirectsMiddleware;
