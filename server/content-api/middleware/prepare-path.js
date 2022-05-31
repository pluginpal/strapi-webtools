'use strict';

const { isAPIRequest } = require('../../util/isAPIRequest');
const { getPluginService } = require('../../util/getPluginService');

const preparePath = async (strapi, ctx, next) => {
  await next();

  // Ensure body exists, occurs on non existent route.
  if (!ctx.body) {
    return;
  }

  // Only process api requests.
  if (isAPIRequest(ctx)) {
    ctx.body = await getPluginService('preparePathService').response(ctx.body);
  }
};

module.exports = (strapi) => {
  strapi.server.use((ctx, next) => preparePath(strapi, ctx, next));
};
