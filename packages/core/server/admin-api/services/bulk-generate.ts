import { Common } from '@strapi/types';
import { getPluginService } from '../../util/getPluginService';
import { GenerationType } from '../../types';

export interface GenerateParams { types: Common.UID.ContentType[], generationType: GenerationType }

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
const generateUrlAliases = async (parms: GenerateParams) => {
  const { types, generationType } = parms;
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

    const urlPattern = await getPluginService('urlPatternService').findByUid(type);
    const relations = getPluginService('urlPatternService').getRelationsFromPattern(urlPattern);

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
      const generatedPath = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);

      // eslint-disable-next-line no-await-in-loop
      const newUrlAlias = await getPluginService('urlAliasService').create({
        url_path: generatedPath,
        generated: true,
        contenttype: type,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        locale: entity.locale,
      });

      // eslint-disable-next-line no-await-in-loop
      await strapi.entityService.update(type, entity.id, {
        data: {
          // @ts-ignore
          url_alias: newUrlAlias.id,
        },
      });

      generatedCount += 1;
    }
  }));

  return generatedCount;
};


export default () => ({
  generateUrlAliases,
  createLanguageLinksForUrlAliases,
});
