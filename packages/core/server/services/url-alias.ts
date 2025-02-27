import { factories, UID } from '@strapi/strapi';
import { Modules } from '@strapi/types';
import { get } from 'lodash';
import { getPluginService } from '../util/getPluginService';

/**
 * URL alias service
 */

const contentTypeSlug = 'plugin::webtools.url-alias';

const customServices = () => ({
  findRelatedEntity: async (path: string, query: Modules.Documents.ServiceParams['findMany'] = {}) => {
    let excludeDrafts = false;

    const urlAliasEntity = await getPluginService('url-alias').findByPath(path);
    if (!urlAliasEntity) {
      return {};
    }

    const contentTypeUid = urlAliasEntity.contenttype as UID.ContentType;

    // Check drafAndPublish setting.
    const contentType = strapi.contentTypes[contentTypeUid];
    if (get(contentType, ['options', 'draftAndPublish'], false)) {
      excludeDrafts = true;
    }

    const entities = await strapi.documents(contentTypeUid).findMany({
      filters: {
        ...query?.filters,
        url_alias: urlAliasEntity.id,
        publishedAt: excludeDrafts ? {
          $notNull: true,
        } : {},
      },
      locale: 'all',
      limit: 1,
    });

    /**
     * If we're querying a single type, which does not have localizations enabled,
     * Strapi will return a single entity instead of an array. Which is slightly weird,
     * because the API we're querying is called `findMany`. That's why we need to check
     * if the result is an array or not and handle it accordingly.
     */
    const entity = Array.isArray(entities) ? entities[0] : entities;

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
