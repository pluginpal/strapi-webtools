'use strict';

const _ = require('lodash');
const { transformResponse } = require('@strapi/strapi/lib/core-api/controller/transform');

const { getPluginService } = require('../../util/getPluginService');
const { sanitizeOutput } = require('../../util/sanitizeOutput');

/**
 * ByPath controller
 */

module.exports = {
  get: async (ctx) => {
    const { path } = ctx.query;
    const { auth } = ctx.state;
    let excludeDrafts = false;

    const pathEntity = await getPluginService('pathService').findByPath(path);
    if (!pathEntity) {
      ctx.notFound();
      return;
    }

    // Check drafAndPublish setting.
    const contentType = strapi.contentTypes[pathEntity.contenttype];
    if (_.get(contentType, ['options', 'draftAndPublish'], false)) {
      excludeDrafts = true;
    }

    const entity = await strapi.entityService.findMany(pathEntity.contenttype, {
      filters: {
        url_path_id: pathEntity.id,
        published_at: excludeDrafts ? {
          $notNull: true,
        } : {},
      },
      limit: 1,
    });
    if (!entity[0]) {
      ctx.notFound();
      return;
    }

    // Add content type to response.
    entity[0].contentType = pathEntity.contenttype;

    // Format response.
    const sanitizedEntity = await sanitizeOutput(entity[0], contentType, auth);
    ctx.body = transformResponse(sanitizedEntity, {}, { contentType });
  },
};
