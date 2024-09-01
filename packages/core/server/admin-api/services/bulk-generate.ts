import { Common } from '@strapi/types';
import { getPluginService } from '../../util/getPluginService';
import { GenerationType } from '../../types';

export interface GenerateParams {
  types: Common.UID.ContentType[],
  generationType: GenerationType
}

/**
 * Find related entity and create language links for URL aliases.
 *
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
     * Even though the localizations are present at the moment of updating.
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
 * Generate URL aliases based on given parameters.
 *
 * @param {GenerateParams} params - The parameters including types and generation type.
 * @returns {Promise<number>} - The total amount of generated URLs.
 */
const generateUrlAliases = async (params: GenerateParams): Promise<number> => {
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
      // Delete all the auto-generated URL aliases of the given type.
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
      // @ts-ignore
      populate: { ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}) },
    });

    /**
     * @todo
     * We should do a Promise.all(entities.map()) here to speed up the process.
     * Using that method we can create all the URL aliases in parallel.
     * Currently this is not possible due to the duplicateCheck function.
     * Race conditions can occur when two entities have the same URL path.
     */
    // For all those entities we will create a URL alias and connect it to the entity.
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of entities) {
      // @ts-ignore
      // eslint-disable-next-line no-await-in-loop
      const urlPatterns = await getPluginService('urlPatternService').findByUid(type, entity.locale);
      const resolvedPathsArray = urlPatterns.map((urlPattern) => {
        const resolvedPaths = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);

        return resolvedPaths;
      });

      // Ensure each path is saved as a URL alias separately
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        resolvedPathsArray.map(async (path) => {
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
            if (error.name === 'ValidationError' && error.message.includes('unique')) {
              console.log(`Validation error caught: ${error.message}. It seems a duplicate was created by another process. Skipping creation.`);
            } else {
              throw error; // Re-throw if it's not the expected validation error
            }
          }
        }),
      );
    }
  }));

  return generatedCount;
};

export default () => ({
  generateUrlAliases,
  createLanguageLinksForUrlAliases,
});
