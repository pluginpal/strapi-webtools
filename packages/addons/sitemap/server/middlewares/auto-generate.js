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

  // Only add the middleware for the create, update and delete action.
  if (!['create', 'update', 'delete'].includes(action)) {
    return next();
  }

  // Perform the action.
  const document = await next();

  // Generate the sitemap.
  getPluginService('core').createSitemap('default');

  // Return the document
  return document;
};

export default autoGenerateMiddleware;
