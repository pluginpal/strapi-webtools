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

    const pathEntity = await getPluginService('pathService').findByPath(path);
    if (!pathEntity) {
      return {};
    }

    // Check drafAndPublish setting.
    const contentType = strapi.contentTypes[pathEntity.contenttype];
    if (_.get(contentType, ['options', 'draftAndPublish'], false)) {
      excludeDrafts = true;
    }

    const entity = await strapi.entityService.findMany(pathEntity.contenttype as any, {
      ...query,
      filters: {
        ...query?.filters,
        url_path_id: pathEntity.id,
        published_at: excludeDrafts ? {
          $notNull: true,
        } : {},
      },
      locale: 'all',
      limit: 1,
    });

    if (!entity?.[0]) {
      return {};
    }

    return {
      entity: entity[0],
      contentType: pathEntity.contenttype,
    };
  },
});
