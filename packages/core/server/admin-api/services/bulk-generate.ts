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
        filters: {
          contenttype: type,
        },
      });
    }

    if (generationType === 'only_generated') {
      // Delete all the auto generated URL aliases of the given type.
      await getPluginService('url-alias').deleteMany({
        // @ts-ignore
        locale: 'all',
        filters: {
          contenttype: type,
          generated: true,
        },
      });
    }

    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      languages = [];
      const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
      languages = locales.map((locale) => locale.code);
    }

    await Promise.all(languages.map(async (lang) => {
      const urlPatterns = await getPluginService('urlPatternService').findByUid(type, lang);
      const languageRelations = getPluginService('urlPatternService').getRelationsFromPattern(urlPatterns);
      relations = [...relations, ...languageRelations];
    }));

    // Query all the entities of the type that do not have a corresponding URL alias.
    const entities = await strapi.entityService.findMany(type, {
      filters: {
        url_alias: null,
      },
      locale: 'all',
      // @ts-ignore
      populate: {
        ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
      },
    });


    // Fetch the user-defined patterns from the database
    const urlPatterns = await getPluginService('urlPatternService').findByUid(type);

    // Genereer URL-patronen voor alle entiteiten
    const entitiesWithPaths = await Promise.all(entities.map((entity) => {
      const generatedPaths = urlPatterns.map((urlPattern) => getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern));

      return { entity, generatedPaths };
    }));

    // Maak URL-aliasen en werk de entiteiten bij
    await Promise.all(entitiesWithPaths.map(async ({ entity, generatedPaths }) => {
      await Promise.all(generatedPaths.map(async (generatedPath) => {
        console.log(generatedPath);

        const existingAlias = await strapi.entityService.findMany('plugin::webtools.url-alias', {
          filters: {
            url_path: generatedPath,
          },
        });

        if (existingAlias.length > 0) {
          console.log(`URL alias already exists for path ${generatedPath}. Skipping...`);
          return;
        }

        const newUrlAlias = await getPluginService('urlAliasService').create({
          url_path: generatedPath,
          generated: true,
          contenttype: type,
          locale: entity.locale,
        });

        await strapi.entityService.update(type, entity.id, {
          data: {
            url_alias: newUrlAlias.id,
          },
        });

        generatedCount += 1;
      }));
    }));
  }));

  return generatedCount;
};

export default () => ({
  generateUrlAliases,
  createLanguageLinksForUrlAliases,
});
