import { Modules } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';

const deleteUrlAliasMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
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

  const locales = await strapi.documents('plugin::i18n.locale').findMany({ fields: 'code' });
  let urlAlias: Modules.Documents.Document<'plugin::webtools.url-alias'> | null = null;

  await locales.reduce(async (prevPromise, locale) => {
    await prevPromise; // Ensure previous iteration is done
    if (urlAlias) return; // Stop early if we already found one

    const entity = await strapi.documents(uid as 'api::test.test').findOne({
      documentId: params.documentId,
      locale: locale.code,
      populate: {
        url_alias: {
          fields: ['id'],
        },
      },
    });

    if (entity?.url_alias[0]) {
      [urlAlias] = entity.url_alias;
    }
  }, Promise.resolve());

  // If a URL alias is present, delete it.
  if (urlAlias) {
    await strapi.documents('plugin::webtools.url-alias').delete({
      locale: params.locale,
      documentId: urlAlias.documentId,
    });
  }

  // Eventually delete the entity.
  return next();
};

export default deleteUrlAliasMiddleware;
