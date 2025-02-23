import { Modules } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';

const deleteMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action, params } = context;
  const hasWT = isContentTypeEnabled(uid);

  // If Webtools isn't enabled, do nothing.
  if (!hasWT) {
    return next();
  }

  // Run this middleware only for the create action.
  if (action !== 'delete') {
    return next();
  }

  // Fetch the entity because we need the url_alias id.
  const entity = await strapi.documents(uid as 'api::test.test').findOne({
    documentId: params.documentId,
    populate: {
      url_alias: {
        fields: ['id'],
      },
    },
  });

  // If a URL alias is present, delete it.
  if (entity.url_alias[0]) {
    await Promise.all(entity.url_alias.map(async (url_alias) => {
      await strapi.documents('plugin::webtools.url-alias').delete({
        documentId: url_alias.documentId,
      });
    }));
  }

  // Eventually delete the entity.
  return next();
};

export default deleteMiddleware;
