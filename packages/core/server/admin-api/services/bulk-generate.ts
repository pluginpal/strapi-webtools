import { Common } from '@strapi/types';
import { getPluginService } from '../../util/getPluginService';
import { GenerationType } from '../../types';

export interface GenerateParams {
  types: Common.UID.ContentType[],
  generationType: GenerationType
}

/**
 * Find related entity.
 *
 * @param {object} data the data.
 * @returns {void}
 */
const createLanguageLinksForUrlAliases = async () => {
  const urlAliases = await getPluginService('urlAliasService').findMany(true, {
    // @ts-ignore
    fields: ['id', 'contenttype', 'locale'],
  });

  await Promise.all(urlAliases.results.map(async (urlAlias) => {
    const relatedEntity = await getPluginService('urlAliasService').findRelatedEntity(urlAlias, {
      fields: [],
      populate: {
        // @ts-ignore
        localizations: {
          populate: {
            url_alias: {
              fields: ['id'],
            },
          },
        },
      },
    });

    if (!relatedEntity) {
      return;
    }

    // @ts-ignore
    const localizations = relatedEntity.localizations as Array<{
      url_alias: {
        id: number
      },
    }>;

    const urlAliasLocalizations = localizations
      ?.map((loc) => loc.url_alias?.id)
      ?.filter((loc) => loc) || [];

    /**
     * @todo
     * Call the Strapi entity service, instead of the db query.
     * Currently we can't because saving the localizations is not working.
     * Eventough the localizations are present at the moment of updating.
     */
    // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unsafe-assignment
    await strapi.db.query('plugin::webtools.url-alias').update({
      where: {
        id: urlAlias.id,
      },
      data: {
        localizations: urlAliasLocalizations,
      },
    });
  }));
};

/**
 * generateUrlAliases.
 *
 * @param {number} id the id.
 * @returns {number} - the total amount generated URLs.
 */
const generateUrlAliases = async (params: GenerateParams) => {
  const { types, generationType } = params;
  let generatedCount = 0;

  // Map over all the types sent in the request.
  await Promise.all(types.map(async (type) => {
    if (generationType === 'all') {
      // Delete all the URL aliases for the given type.
      await getPluginService('url-alias').deleteMany({
        // @ts-ignore
        locale: 'all',
        filters: { contenttype: type },
      });
    }

    if (generationType === 'only_generated') {
      // Delete all the auto generated URL aliases of the given type.
      await getPluginService('url-alias').deleteMany({
        // @ts-ignore
        locale: 'all',
        filters: { contenttype: type, generated: true },
      });
    }

    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      languages = [];
      const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
      languages = locales.map((locale) => locale.code);
    }

    // Get all relations for the type
    await Promise.all(languages.map(async (lang) => {
      const urlPatterns = await getPluginService('urlPatternService').findByUid(type, lang);
      const languageRelations = getPluginService('urlPatternService').getRelationsFromPattern(urlPatterns);
      relations = [...relations, ...languageRelations];
    }));

    // Query all the entities of the type that do not have a corresponding URL alias
    const entities = await strapi.entityService.findMany(type, {
      filters: { url_alias: null },
      locale: 'all',
      populate: { ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}) },
    });

    // Get URL patterns for the type
    const urlPatterns = await getPluginService('urlPatternService').findByUid(type);

    // Loop through each entity and generate paths
    await Promise.all(entities.map(async (entity) => {
      const resolvedPathsArray = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/require-await
        urlPatterns.map(async (urlPattern) => {
          const resolvedPaths = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);
          return Array.isArray(resolvedPaths) ? resolvedPaths : [resolvedPaths];
        }),
      );

      // Flatten the array of arrays
      const allResolvedPaths = resolvedPathsArray.flat();

      // Ensure each path is saved as a URL alias separately
      await Promise.all(
        allResolvedPaths.map(async (path) => {
          try {
            const newUrlAlias = await getPluginService('urlAliasService').create({
              url_path: path,
              generated: true,
              contenttype: type,
              // @ts-ignore
              locale: entity.locale,
            });

            await strapi.entityService.update(type, entity.id, {
              data: {
                // @ts-ignore
                url_alias: newUrlAlias.id,
              },
            });

            generatedCount += 1;
          } catch (error) {
            // console.error(`Error creating URL alias for path: ${path}`, error);
          }
        }),
      );
    }));
  }));

  return generatedCount;
};

export default () => ({
  generateUrlAliases,
  createLanguageLinksForUrlAliases,
});
