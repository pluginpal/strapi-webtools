'use strict';

import pluginPkg from '../../package.json';

/**
 * A helper function to obtain the plugin id.
 *
 * @return {string} The plugin id.
 */
export const pluginId = pluginPkg.strapi.name;
