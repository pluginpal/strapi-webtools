'use strict';

import _ from 'lodash';
import { getPluginService } from '../../util/getPluginService';

export default () => ({
  /**
   * Get an entity by it's path.
   *
   * @param {string} path the path.
   * @param {object} query the entity service query.
   * @returns {object} the entity.
   */
  byPath: async (path, query: Record<string, any> = {}) => {
    let excludeDrafts = false;

    const urlAliasEntity = await getPluginService('urlAliasService').findByPath(path);
    if (!urlAliasEntity) {
      return {};
    }

    // Check drafAndPublish setting.
    const contentType = strapi.contentTypes[urlAliasEntity.contenttype];
    if (_.get(contentType, ['options', 'draftAndPublish'], false)) {
      excludeDrafts = true;
    }

    const entity = await strapi.entityService.findMany(urlAliasEntity.contenttype, {
      ...query,
      filters: {
        ...query?.filters,
        url_alias: urlAliasEntity.id,
        published_at: excludeDrafts ? {
          $notNull: true,
        } : {},
      },
      locale: 'all',
      limit: 1,
    });

    if (!entity[0]) {
      return {};
    }

    return {
      entity: entity[0],
      contentType: urlAliasEntity.contenttype,
    };
  },
});
