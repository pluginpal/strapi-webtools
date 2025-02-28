import { UID } from '@strapi/strapi';

import { getPluginService } from '../util/getPluginService';
import { GenerationType } from '../types';

export interface GenerateParams {
  types: UID.ContentType[],
  generationType: GenerationType,
}

/**
 * Find related entity and create language links for URL aliases.
 *
 * @returns {void}
 */
const createLanguageLinksForUrlAliases = async () => {
  const urlAliases = await strapi.documents('plugin::webtools.url-alias').findMany({
    fields: ['id', 'contenttype', 'locale', 'url_path'],
  });

  await Promise.all(urlAliases.map(async (urlAlias) => {
    const relatedEntity = await getPluginService('url-alias').findRelatedEntity(urlAlias.url_path, {
      fields: ['id'],
      populate: {
        localizations: {
          populate: {
            // @ts-ignore
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
        documentId: number
      },
    }>;

    const urlAliasLocalizations = localizations
      ?.map((loc) => loc.url_alias?.documentId)
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
      await strapi.db.query('plugin::webtools.url-alias').deleteMany({
        where: { contenttype: type },
      });
    }

    if (generationType === 'only_generated') {
      // Delete all the auto generated URL aliases of the given type.
      await strapi.db.query('plugin::webtools.url-alias').deleteMany({
        where: { contenttype: type, generated: true },
      });
    }

    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      languages = [];
      const locales = await strapi.documents('plugin::i18n.locale').findMany({});
      languages = locales.map((locale) => locale.code);
    }

    // Get all relations for the type
    await Promise.all(languages.map(async (lang) => {
      const urlPatterns = await getPluginService('url-pattern').findByUid(type, lang);
      urlPatterns.forEach((urlPattern) => {
        const languageRelations = getPluginService('url-pattern').getRelationsFromPattern(urlPattern);
        // @todo check if this works
        relations = [...relations, ...languageRelations];
      });
    }));

    // Query all the entities of the type that do not have a corresponding URL alias.
    const entities = await strapi.documents(type).findMany({
      // @ts-ignore
      filters: { url_alias: null },
      locale: 'all',
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
      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unsafe-argument
      const urlPatterns = await getPluginService('url-pattern').findByUid(type, entity.locale);
      const resolvedPathsArray = urlPatterns.map((urlPattern) => {
        const resolvedPaths = getPluginService('url-pattern').resolvePattern(type, entity, urlPattern);

        return resolvedPaths;
      });

      // Ensure each path is saved as a URL alias separately
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        resolvedPathsArray.map(async (path) => {
          try {
            const newUrlAlias = await strapi.documents('plugin::webtools.url-alias').create({
              url_path: path,
              generated: true,
              contenttype: type,
              locale: entity.locale,
            });

            await strapi.documents(type).update({
              documentId: entity.documentId,
              data: {
                // @ts-ignore
                url_alias: newUrlAlias.documentId,
              },
            });

            generatedCount += 1;
          } catch (error) {
            const err = error as Error;
            if (err.name === 'ValidationError' && err.message.includes('unique')) {
              console.log(`Validation error caught: ${err.message}. It seems a duplicate was created by another process. Skipping creation.`);
            } else {
              throw err;
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
