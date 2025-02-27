import { Modules } from '@strapi/strapi';
import { getPluginService } from '../util/getPluginService';

// eslint-disable-next-line max-len
const preventDuplicateUrlsMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action } = context;

  // Only run this for the URL alias entities.
  if (uid !== 'plugin::webtools.url-alias') {
    return next();
  }

  // Run this middleware only for the create, update and clone action.
  if (!['create', 'update', 'clone'].includes(action)) {
    return next();
  }

  const params = context.params as Modules.Documents.ServiceParams<'plugin::webtools.url-alias'>['create' | 'update' | 'clone'] & { documentId: string };

  if (params.data.url_path) {
    params.data.url_path = await getPluginService('url-alias').makeUniquePath(params.data.url_path, params.documentId);
  }

  return next();
};

export default preventDuplicateUrlsMiddleware;
