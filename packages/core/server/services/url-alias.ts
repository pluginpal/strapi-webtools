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

    const entity = await strapi.documents(contentTypeUid as 'api::test.test').findFirst({
      status: 'published',
      ...query,
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
  findByPath: async (path: string, documentId: string = '') => {
    const pathEntity = await strapi.documents('plugin::webtools.url-alias').findMany({
      filters: {
        url_path: path,
        documentId: {
          $not: documentId,
        },
      },
      limit: 1,
    });

    return pathEntity[0];
  },

  /**
   * Finds a path from the original path that is unique
   */
  makeUniquePath: async (
    originalPath: string,
    ignoreId?: string,
    ext: number = -1,
  ): Promise<string> => {
    const extension = ext >= 0 ? `-${ext}` : '';
    const newPath = originalPath + extension;
    const pathAlreadyExists = await getPluginService('url-alias').findByPath(newPath, ignoreId);

    if (pathAlreadyExists) {
      return getPluginService('url-alias').makeUniquePath(originalPath, ignoreId, ext + 1);
    }

    return newPath;
  },
});

export default factories.createCoreService(contentTypeSlug, customServices);
