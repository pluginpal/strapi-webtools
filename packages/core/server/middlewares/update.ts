import { Modules, Data } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { getPluginService } from '../util/getPluginService';

const updateMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action, params } = context;
  const hasWT = isContentTypeEnabled(uid);

  // If Webtools isn't enabled, do nothing.
  if (!hasWT) {
    return next();
  }

  // Run this middleware only for the create action.
  if (action !== 'update') {
    return next();
  }

  const data = params.data as Modules.Documents.ServiceParams<'api::test.test'>['update']['data'];

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

  await next();

  // Manually fetch the entity that's being updated.
  // We do this because not all it's data is present in data.
  const entity = await strapi.documents(uid as 'api::test.test').findOne({
    documentId: context.params.documentId,
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

  // Fetch the URL alias localizations.
  const urlAliasLocalizations = entity.localizations
    ?.map((loc) => loc.url_alias[0]?.documentId)
    ?.filter((loc) => loc) || [];

  const entityWithoutLocalizations = {
    ...entity,
    localizations: undefined,
  };

  if (data.url_alias?.[0]) {
    urlAliasEntity = await strapi.documents('plugin::webtools.url-alias').findOne({
      documentId: data.url_alias[0],
    });
  } else if (entity.url_alias[0]) {
    [urlAliasEntity] = entity.url_alias;
  }

  // If a URL alias is present and 'generated' is set to false, do nothing.
  if (urlAliasEntity?.generated === false) {
    return next();
  }

  // Generate the path.
  const urlPatterns = await getPluginService('url-pattern').findByUid(uid, entity.locale);
  await Promise.all(urlPatterns.map(async (urlPattern) => {
    const generatedPath = getPluginService('url-pattern').resolvePattern(uid, entityWithoutLocalizations, urlPattern);

    if (urlAliasEntity?.generated === true) {
      await getPluginService('url-alias').update(urlAliasEntity.documentId, {
        data: {
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          locale: entity.locale,
          localizations: urlAliasLocalizations,
        },
      });
    }

    if (!urlAliasEntity) {
      urlAliasEntity = await getPluginService('url-alias').create({
        data: {
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          locale: entity.locale,
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
          urlAliasEntity?.documentId,
        ],
      },
    });
  }));

  data.url_alias = [urlAliasEntity?.documentId];

  // Eventually update the entity.
  return next();
};

export default updateMiddleware;
