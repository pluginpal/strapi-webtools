import { Modules, Data } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { getPluginService } from '../util/getPluginService';

// eslint-disable-next-line max-len
const generateUrlAliasMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action, contentType } = context;
  const hasWT = isContentTypeEnabled(contentType);

  // If Webtools isn't enabled, do nothing.
  if (!hasWT) {
    return next();
  }

  // Run this middleware only for the create, update and clone action.
  if (!['clone', 'create', 'update'].includes(action)) {
    return next();
  }

  const params = context.params as Modules.Documents.ServiceParams<'api::test.test'>['create' | 'update' | 'clone'];

  // Fetch the URL pattern for this content type.
  let relations: string[] = [];
  let languages: string[] = [undefined];
  let urlAliasEntity: Data.ContentType<'plugin::webtools.url-alias'> | undefined;

  languages = [];
  const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
  languages = locales.map((locale) => locale.code);

  await Promise.all(languages.map(async (lang) => {
    const urlPatterns = await getPluginService('url-pattern').findByUid(uid, lang);
    urlPatterns.forEach((urlPattern) => {
      const languageRelations = getPluginService('url-pattern').getRelationsFromPattern(urlPattern);
      relations = [...relations, ...languageRelations];
    });
  }));

  // Remove the URL alias if we're cloning the entity.
  // This way we can generate a new URL alias for the cloned entity.
  if (action === 'clone') {
    params.data.url_alias = null;
  }

  // Fire the action.
  const entity = await next() as Modules.Documents.AnyDocument;

  // Fetch the full entity.
  const fullEntity = await strapi.documents(uid as 'api::test.test').findOne({
    documentId: entity.documentId,
    ...(params.locale ? { locale: params.locale } : {}),
    populate: {
      ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
      url_alias: {
        fields: ['id', 'generated'],
      },
      localizations: {
        populate: {
          url_alias: {
            fields: ['id'],
          },
        },
      },
    },
  });

  // If the document already has a URL alias, fetch it.
  if (params.data.url_alias?.[0]) {
    urlAliasEntity = await strapi.documents('plugin::webtools.url-alias').findOne({
      ...(params.locale ? { locale: params.locale } : {}),
      documentId: params.data.url_alias[0] as string,
    });
  } else if (fullEntity.url_alias[0]) {
    [urlAliasEntity] = fullEntity.url_alias;
  }

  // If the URL alias has 'generated' set to false, do nothing.
  if (urlAliasEntity?.generated === false) {
    return entity;
  }

  // Fetch the URL alias localization.
  const urlAliasLocalization = fullEntity.localizations
    ?.map((loc) => loc?.url_alias[0]?.documentId)
    ?.filter((loc) => loc)[0] || null;

  const fullEntityWithoutLocalizations = {
    ...fullEntity,
    localizations: undefined,
  };

  const combinedEntity = { ...fullEntityWithoutLocalizations };
  const urlPatterns = await getPluginService('url-pattern').findByUid(uid, combinedEntity.locale);

  await Promise.all(urlPatterns.map(async (urlPattern) => {
    const generatedPath = getPluginService('url-pattern').resolvePattern(uid, combinedEntity, urlPattern);

    // If a URL alias was created and 'generated' is set to true, update the alias.
    if (urlAliasEntity?.generated === true) {
      urlAliasEntity = await strapi.documents('plugin::webtools.url-alias').update({
        documentId: urlAliasEntity.documentId,
        locale: combinedEntity.locale,
        data: {
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
        },
      });
    }

    // If no URL alias was created, create one.
    if (!urlAliasEntity) {
      if (urlAliasLocalization) {
        urlAliasEntity = await strapi.documents('plugin::webtools.url-alias').update({
          documentId: urlAliasLocalization,
          locale: combinedEntity.locale,
          data: {
            url_path: generatedPath,
            generated: true,
            contenttype: uid,
          },
        });
      } else {
        urlAliasEntity = await strapi.documents('plugin::webtools.url-alias').create({
          locale: combinedEntity.locale,
          data: {
            url_path: generatedPath,
            generated: true,
            contenttype: uid,
          },
        });
      }
    }
  }));

  const all = await strapi.db.query(uid as 'api::test.test').findMany({
    where: {
      ...(params.locale ? { locale: params.locale } : {}),
      document_id: entity.documentId,
    },
  });

  await Promise.all(all.map(async (doc) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await strapi.db.query(uid as 'api::test.test').updateRelations(doc.id as string, {
      url_alias: [urlAliasEntity?.id],
    });
  }));

  const finalEntity = await strapi.documents(uid as 'api::test.test').findOne({
    documentId: entity.documentId,
    fields: params.fields,
    ...(params.locale ? { locale: params.locale } : {}),
    populate: params.populate,
  });

  if (action === 'clone') {
    return {
      documentId: entity.documentId,
      entries: [finalEntity],
    };
  }

  return finalEntity;
};

export default generateUrlAliasMiddleware;
