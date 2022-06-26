'use strict';

const _ = require('lodash');
const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  /**
   * Get an entity by it's path.
   *
   * @param {string} path the path.
   * @param {object} query the entity service query.
   * @returns {object} the entity.
   */
  byPath: async (path, query = {}) => {
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

    const entity = await strapi.entityService.findMany(pathEntity.contenttype, {
      ...query,
      filters: {
        ...query?.filters,
        url_path_id: pathEntity.id,
        published_at: excludeDrafts ? {
          $notNull: true,
        } : {},
      },
      limit: 1,
    });

    if (!entity[0]) {
      return {};
    }

    return {
      entity: entity[0],
      contentType: pathEntity.contenttype,
    };
  },
});
