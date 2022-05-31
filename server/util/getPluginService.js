'use strict';

const { pluginId } = require('./pluginId');

/**
 * A helper function to obtain a plugin service.
 * @param {boolean} name The name of the service.
 *
 * @return {any} service.
 */
const getPluginService = (name) => strapi.plugin(pluginId).service(name);

module.exports = {
  getPluginService,
};
