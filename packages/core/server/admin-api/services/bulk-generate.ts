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

    if (! relatedEntity) {
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
// GENERATES 2 ITEMS OF 4... 2 MISSING
// const generateUrlAliases = async (params: GenerateParams) => {
//   const { types, generationType } = params;
//   let generatedCount = 0;
//
//   console.log('Starting URL alias generation');
//
//   // Loop over alle types in het request
//   await Promise.all(types.map(async (type) => {
//     // Verwijder bestaande URL-aliasen op basis van het generatietype
//     if (generationType === 'all') {
//       await getPluginService('url-alias').deleteMany({
//         locale: 'all',
//         filters: { contenttype: type },
//       });
//       console.log(`Deleted all URL aliases for type ${type}`);
//     }
//
//     if (generationType === 'only_generated') {
//       await getPluginService('url-alias').deleteMany({
//         locale: 'all',
//         filters: { contenttype: type, generated: true },
//       });
//       console.log(`Deleted only generated URL aliases for type ${type}`);
//     }
//
//     // Haal alle entiteiten op die geen URL-alias hebben
//     const entities = await strapi.entityService.findMany(type, {
//       filters: { url_alias: null },
//       locale: 'all',
//     });
//     console.log(`Found ${entities.length} entities without URL aliases for type ${type}`);
//
//     // Haal de URL-patronen op voor het type
//     const urlPatterns = await getPluginService('urlPatternService').findByUid(type);
//     console.log(urlPatterns, `Found ${urlPatterns.length} URL patterns for type ${type}.`);
//
//     // Loop door elke entiteit en genereer paden
//     for (const entity of entities) {
//       console.log(`Generating paths for entity ID: ${entity.id}`);
//
//       for (const urlPattern of urlPatterns) {
//         const resolvedPaths = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);
//         console.log(`Resolved paths for entity ID: ${entity.id}`, resolvedPaths);
//
//         // Zorg ervoor dat elk pad afzonderlijk als een URL-alias wordt opgeslagen
//         for (const path of Array.isArray(resolvedPaths) ? resolvedPaths : [resolvedPaths]) {
//           if (path && path !== '/') {
//             console.log(`Processing path: ${path} for entity ID: ${entity.id}`);
//
//             const existingAlias = await strapi.entityService.findMany('plugin::webtools.url-alias', {
//               filters: { url_path: path },
//             });
//
//             if (existingAlias.length === 0) {
//               console.log(`Creating new URL alias for path: ${path}`);
//
//               const newUrlAlias = await getPluginService('urlAliasService').create({
//                 url_path: path,
//                 generated: true,
//                 contenttype: type,
//                 locale: entity.locale,
//               });
//
//               await strapi.entityService.update(type, entity.id, {
//                 data: {
//                   url_alias: newUrlAlias.id,
//                 },
//               });
//
//               console.log(`Updated entity ID: ${entity.id} with new URL alias ID: ${newUrlAlias.id}`);
//               generatedCount += 1;
//             } else {
//               console.log(`Existing URL alias found for path: ${path}. Skipping.`);
//             }
//           }
//         }
//       }
//     }
//   }));
//
//   console.log(`Finished URL alias generation. Total generated: ${generatedCount}`);
//   return generatedCount;
// };

  // GENERATES 4 ITEMS BUT UNIQUE ERROR
const generateUrlAliases = async (params: GenerateParams) => {
  const { types, generationType } = params;
  let generatedCount = 0;

  console.log('Starting URL alias generation');

  // Loop over all types in the request
  await Promise.all(types.map(async (type) => {
    // Delete existing URL aliases based on the generation type
    if (generationType === 'all') {
      // Delete all URL aliases for the given content type
      await getPluginService('url-alias').deleteMany({
        // @ts-ignore
        locale: 'all',
        filters: { contenttype: type },
      });
      console.log(`Deleted all URL aliases for type ${type}`);
    }

    if (generationType === 'only_generated') {
      // Delete only the generated URL aliases for the given content type
      await getPluginService('url-alias').deleteMany({
        // @ts-ignore
        locale: 'all',
        filters: { contenttype: type, generated: true },
      });
      console.log(`Deleted only generated URL aliases for type ${type}`);
    }

    // Fetch relations and languages for the entities
    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      // Get the available languages from the i18n plugin
      languages = [];
      const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
      languages = locales.map((locale) => locale.code);
    }

    await Promise.all(languages.map(async (lang) => {
      // Get URL patterns for the content type and language
      const urlPatterns = await getPluginService('urlPatternService').findByUid(type, lang);
      // Get relations from the URL patterns
      const languageRelations = getPluginService('urlPatternService').getRelationsFromPattern(urlPatterns);
      relations = [...relations, ...languageRelations];
    }));

    // Fetch all entities of the type that do not have a corresponding URL alias
    const entities = await strapi.entityService.findMany(type, {
      filters: { url_alias: null },
      locale: 'all',
      populate: { ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}) },
    });
    console.log(`Found ${entities.length} entities without URL aliases for type ${type}`);

    // Fetch the URL patterns for the content type
    const urlPatterns = await getPluginService('urlPatternService').findByUid(type);
    console.log(urlPatterns, `Found ${urlPatterns.length} URL patterns for type ${type}.`);

    // Loop through each entity and generate paths
    await Promise.all(
      entities.map(async (entity) => {
        console.log(`Generating paths for entity ID: ${entity.id}`);

        // Resolve paths for each URL pattern
        const resolvedPathsArray = await Promise.all(
          urlPatterns.map(async (urlPattern) => {
            const resolvedPaths = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);
            console.log(`Resolved paths for entity ID: ${entity.id}`, resolvedPaths);
            return Array.isArray(resolvedPaths) ? resolvedPaths : [resolvedPaths];
          }),
        );

        // Flatten the array of resolved paths
        const allResolvedPaths = resolvedPathsArray.flat();

        // Ensure that each path is stored as a URL alias
        await Promise.all(
          allResolvedPaths.map(async (path) => {
            if (path && path !== '/') {
              console.log(`Processing path: ${path} for entity ID: ${entity.id}`);

              // Check if the URL alias already exists
              const existingAlias = await strapi.entityService.findMany('plugin::webtools.url-alias', {
                filters: { url_path: path },
              });

              if (existingAlias.length === 0) {
                console.log(`Creating new URL alias for path: ${path}`);

                // Create a new URL alias
                const newUrlAlias = await getPluginService('urlAliasService').create({
                  url_path: path,
                  generated: true,
                  contenttype: type,
                  // @ts-ignore
                  locale: entity.locale,
                });

                // Update the entity with the new alias, overriding the existing url_alias if necessary
                await strapi.entityService.update(type, entity.id, {
                  data: {
                    // @ts-ignore
                    url_alias: newUrlAlias.id, // Save the new alias ID
                  },
                });

                console.log(`Updated entity ID: ${entity.id} with new URL alias ID: ${newUrlAlias.id}`);
                generatedCount += 1;
              } else {
                console.log(`Existing URL alias found for path: ${path}. Skipping.`);
              }
            }
          }),
        );
      }),
    );
  }));

  console.log(`Finished URL alias generation. Total generated: ${generatedCount}`);
  return generatedCount;
};


export default () => ({
  generateUrlAliases,
  createLanguageLinksForUrlAliases,
});
