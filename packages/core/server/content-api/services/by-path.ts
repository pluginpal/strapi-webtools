

import get from 'lodash/get';
import { Common, EntityService } from '@strapi/strapi';
import { getPluginService } from '../../util/getPluginService';

export default () => ({
  /**
   * Get an entity by it's path.
   *
   * @param {string} path the path.
   * @param {object} query the entity service query.
   * @returns {object} the entity.
   */
  byPath: async (path: string, query: EntityService.Params.Pick<any, 'fields' | 'populate' | 'pagination' | 'sort' | 'filters' | '_q' | 'publicationState' | 'plugin'> = {}) => {
    let excludeDrafts = false;

    const urlAliasEntity = await getPluginService('urlAliasService').findByPath(path);
    console.log(urlAliasEntity);
    if (!urlAliasEntity) {
      return {};
    }

    const contentTypeUid = urlAliasEntity.contenttype as Common.UID.ContentType;

    // Check drafAndPublish setting.
    const contentType = strapi.contentTypes[contentTypeUid];
    if (get(contentType, ['options', 'draftAndPublish'], false)) {
      excludeDrafts = true;
    }

    const entities = await strapi.entityService.findMany(contentTypeUid, {
      ...query,
      filters: {
        ...query?.filters,
        // @ts-ignore
        url_alias: urlAliasEntity.id,
        published_at: excludeDrafts ? {
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
      contentType: urlAliasEntity.contenttype as Common.UID.ContentType,
    };
  },
});
