'use strict';

/**
 * A helper function to obtain a plugin service.
 * @param {ctx} ctx The name of the service.
 * @param {string} prefix The name of the service.
 *
 * @return {any} service.
 */
const isAPIRequest = (ctx, prefix = '/api/') => {
  return ctx.request && ctx.request.url && ctx.request.url.indexOf(prefix) !== -1;
};

module.exports = {
  isAPIRequest,
};
