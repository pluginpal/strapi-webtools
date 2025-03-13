import pluginPkg from '../../package.json';

/**
 * A helper function to obtain the plugin id.
 *
 * @return {string} The plugin id.
 */
const pluginId = pluginPkg.strapi.name;

export default pluginId;
