import { factories, UID } from '@strapi/strapi';
import { Modules } from '@strapi/types';
import { getPluginService } from '../util/getPluginService';

/**
 * URL alias service
 */

const contentTypeSlug = 'plugin::webtools.url-alias';

const customServices = () => ({
  findRelatedEntity: async (path: string, query: Modules.Documents.ServiceParams<'api::test.test'>['findFirst'] = {}) => {
    const urlAliasEntity = await getPluginService('url-alias').findByPath(path);
    if (!urlAliasEntity) {
      return {};
    }

    const contentTypeUid = urlAliasEntity.contenttype as UID.ContentType;
    const model = strapi.getModel(contentTypeUid);
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isLocalized = model.pluginOptions.i18n?.localized as boolean;

    const entity = await strapi.documents(contentTypeUid as 'api::test.test').findFirst({
      status: 'published',
      ...query,
      ...(isLocalized ? { locale: urlAliasEntity.locale } : {}),
      filters: {
        ...query?.filters,
        url_alias: { documentId: urlAliasEntity.documentId },
      },
    });

    if (!entity) {
      return {};
    }

    return {
      entity,
      contentType: urlAliasEntity.contenttype as UID.ContentType,
    };
  },

  /**
   * findByPath.
   *
   * @param {string} path the path.
   * @param {number} id the id to ignore.
   */
  findByPath: async (path: string, excludeFilters: { [key: string]: any }[] = [{}]) => {
    const locales = await strapi.documents('plugin::i18n.locale').findMany({ fields: 'code' });

    let pathEntity: Modules.Documents.Document<'plugin::webtools.url-alias'> | null = null;

    await locales.reduce(async (prevPromise, locale) => {
      await prevPromise; // Ensure previous iteration is done
      if (pathEntity) return; // Stop early if we already found one

      pathEntity = await strapi.documents('plugin::webtools.url-alias').findFirst({
        locale: locale.code,
        filters: {
          url_path: path,
          $not: {
            $and: excludeFilters,
          },
        },
      });
    }, Promise.resolve());

    return pathEntity;
  },

  /**
   * Finds a path from the original path that is unique
   *
   * @param originalPath The path as generated from the pattern and document
   * @param currentDocumentId If generating for an existing document, its document id
   * @param currentLocale If generating for an existing document, its locale code
   */
  makeUniquePath: async (
    originalPath: string,
    currentDocumentId?: string,
    currentLocale?: string,
  ): Promise<string> => {
    const uniquePerLocale = strapi.config.get('plugin::webtools.unique_per_locale', false);
    let newPath = originalPath;

    // FIXME: limit number of iterations to prevent overloading the server?
    for (let iteration = -1; ; ++iteration) {
      if (iteration >= 0) {
        newPath = `${originalPath}-${iteration}`;
      }

      const filters: Record<string, unknown> = {
        url_path: newPath,
      };

      if (currentDocumentId) {
        filters.documentId = { $not: currentDocumentId };
      }

      // This loop can't be parallelized as the iteration is increased between each step.
      // eslint-disable-next-line no-await-in-loop
      const existingPathEntity = await strapi.documents('plugin::webtools.url-alias').findFirst({
        locale: uniquePerLocale ? currentLocale : undefined,
        filters,
      });

      if (!existingPathEntity) {
        break;
      }
    }

    return newPath;
  },
});

export default factories.createCoreService(contentTypeSlug, customServices);
