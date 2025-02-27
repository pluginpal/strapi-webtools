import { Modules, Data } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { getPluginService } from '../util/getPluginService';

// eslint-disable-next-line max-len
const generateUrlAliasMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action } = context;
  const hasWT = isContentTypeEnabled(uid);

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

  if (strapi.plugin('i18n')) {
    languages = [];
    const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
    languages = locales.map((locale) => locale.code);
  }

  await Promise.all(languages.map(async (lang) => {
    const urlPatterns = await getPluginService('url-pattern').findByUid(uid, lang);
    urlPatterns.forEach((urlPattern) => {
      const languageRelations = getPluginService('url-pattern').getRelationsFromPattern(urlPattern);
      // @todo check if this works
      relations = [...relations, ...languageRelations];
    });
  }));

  // Fire the action.
  const entity = await next() as Modules.Documents.AnyDocument;

  // Fetch the full entity.
  const fullEntity = await strapi.documents(uid as 'api::test.test').findOne({
    documentId: entity.documentId,
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

  // If the document already has an URL alias, fetch it.
  if (params.data.url_alias?.[0]) {
    urlAliasEntity = await strapi.documents('plugin::webtools.url-alias').findOne({
      documentId: params.data.url_alias[0] as string,
    });
  } else if (fullEntity.url_alias[0]) {
    [urlAliasEntity] = fullEntity.url_alias;
  }

  // If the URL alias has 'generated' set to false, do nothing.
  if (urlAliasEntity?.generated === false) {
    return next();
  }

  // Fetch the URL alias localizations.
  const urlAliasLocalizations = fullEntity.localizations
    // @todo check all url aliases, not just the first.
    ?.map((loc) => loc.url_alias[0].documentId)
    ?.filter((loc) => loc) || [];

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
      urlAliasEntity = await getPluginService('url-alias').update(urlAliasEntity.documentId, {
        data: {
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          locale: combinedEntity.locale,
          localizations: urlAliasLocalizations,
        },
      });
    }

    // If no URL alias was created, create one.
    if (!urlAliasEntity) {
      urlAliasEntity = await getPluginService('url-alias').create({
        data: {
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          locale: combinedEntity.locale,
          localizations: urlAliasLocalizations,
        },
      });
    }
  }));

  // Update all the URL alias localizations.
  await Promise.all(urlAliasLocalizations.map(async (localization) => {
    await strapi.db.query('plugin::webtools.url-alias').update({
      where: {
        id: localization,
      },
      data: {
        localizations: [
          ...(urlAliasLocalizations.filter((loc) => loc !== localization)),
          urlAliasEntity.documentId,
        ],
      },
    });
  }));

  // Eventually update the entity to include the URL alias.
  params.data.url_alias = [urlAliasEntity?.documentId];

  return next();
};

export default generateUrlAliasMiddleware;
