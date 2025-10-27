import { UID } from '@strapi/strapi';

import { getPluginService } from '../util/getPluginService';
import { GenerationType } from '../types';

export interface GenerateParams {
  types: UID.ContentType[],
  generationType: GenerationType,
}

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
    await strapi.db.transaction(async () => {
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

      // Get all relations for the type from all patterns for all languages.
      const urlPatterns = await getPluginService('url-pattern').findByUid(type);
      urlPatterns.forEach((urlPattern) => {
        const languageRelations = getPluginService('url-pattern').getRelationsFromPattern(urlPattern);
        relations = [...relations, ...languageRelations];
      });

      // Query all the entities of the type that do not have a corresponding URL alias.
      const entities = await strapi.documents(type as 'api::test.test').findMany({
        filters: { url_alias: null },
        populate: {
          ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
          localizations: {
            populate: {
              ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
            },
          },
        },
      });

      /**
       * @todo
       * We should do a Promise.all(entities.map()) here to speed up the process.
       * Using that method we can create all the URL aliases in parallel.
       * Currently this is not possible due to the duplicateCheck function.
       * Race conditions can occur when two entities have the same URL path.
       */
      // eslint-disable-next-line no-restricted-syntax
      for (const entity of entities) {
        // FIXME: just filter the `urlPatterns` we already have.
        // eslint-disable-next-line no-await-in-loop
        const entityUrlPatterns = await getPluginService('url-pattern').findByUid(type, entity.locale);
        const resolvedPath = getPluginService('url-pattern').resolvePattern(type, entity, entityUrlPatterns[0]);

        // eslint-disable-next-line no-await-in-loop
        const newUrlAlias = await strapi.documents('plugin::webtools.url-alias').create({
          data: {
            url_path: resolvedPath,
            generated: true,
            contenttype: type,
            locale: entity.locale,
          },
        });

        // eslint-disable-next-line no-await-in-loop
        await strapi.documents(type as 'api::test.test').update({
          locale: entity.locale,
          documentId: entity.documentId,
          data: {
            url_alias: [newUrlAlias.documentId],
          },
        });

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(entity.localizations.map(async (loc) => {
          const patterns = await getPluginService('url-pattern').findByUid(type, loc.locale);
          const path = getPluginService('url-pattern').resolvePattern(type, loc, patterns[0]);

          const alias = await strapi.documents('plugin::webtools.url-alias').update({
            documentId: newUrlAlias.documentId,
            locale: loc.locale,
            data: {
              url_path: path,
              generated: true,
              contenttype: type,
              locale: entity.locale,
            },
          });

          await strapi.documents(type as 'api::test.test').update({
            documentId: entity.documentId,
            locale: loc.locale,
            data: {
              url_alias: [alias.documentId],
            },
          });
        }));

        generatedCount += 1;
      }
    });
  }));


  return generatedCount;
};


export default () => ({
  generateUrlAliases,
});
