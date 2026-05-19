import { getPluginService } from '../utils/getPluginService';

// eslint-disable-next-line max-len
const autoGenerateMiddleware = async (context, next) => {
  const { uid, action } = context;

  // Only add the middleware if auto-generate is enabled.
  if (!strapi.config.get('plugin::webtools-addon-sitemap.autoGenerate')) {
    return next();
  }

  const settings = await getPluginService('settings').getConfig();
  const defaultSitemapSettings = settings?.sitemaps?.default;

  // Only add the middleware if the content type is added to the sitemap.
  if (!defaultSitemapSettings?.contentTypes || !Object.keys(defaultSitemapSettings?.contentTypes).includes(uid)) {
    return next();
  }

  // Only add the middleware for the create, update, delete, publish and unpublish actions.
  // In Strapi 5, publish and unpublish are separate document service actions and do not
  // go through update, so they must be explicitly included here.
  if (!['create', 'update', 'delete', 'publish', 'unpublish'].includes(action)) {
    return next();
  }

  // Perform the action.
  const document = await next();

  // Generate the sitemap.
  setTimeout(() => {
    getPluginService('core').createSitemap('default');
  }, 0);

  // Return the document
  return document;
};

export default autoGenerateMiddleware;
