'use strict';

import { logMessage } from '../utils';
import { getPluginService } from '../utils/getPluginService';

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */

const subscribeLifecycleMethods = async (modelName) => {
  if (strapi.contentTypes[modelName]) {
    await strapi.db.lifecycles.subscribe({
      models: [modelName],

      async afterCreate() {
        await getPluginService('core').createSitemap();
      },

      async afterCreateMany() {
        await getPluginService('core').createSitemap();
      },

      async afterUpdate() {
        await getPluginService('core').createSitemap();
      },

      async afterUpdateMany() {
        await getPluginService('core').createSitemap();
      },

      async afterDelete() {
        await getPluginService('core').createSitemap();
      },

      async afterDeleteMany() {
        await getPluginService('core').createSitemap();
      },
    });
  } else {
    strapi.log.error(logMessage(`Could not load lifecycles on model '${modelName}'`));
  }
};

export default () => ({
  async loadAllLifecycleMethods() {
    const settings = await getPluginService('settings').getConfig();

    // Loop over configured contentTypes from store.
    if (settings.contentTypes && strapi.config.get('plugin::webtools-addon-sitemap.autoGenerate')) {
      Object.keys(settings.contentTypes).map(async (contentType) => {
        await subscribeLifecycleMethods(contentType);
      });
    }
  },

  async loadLifecycleMethod(modelName) {
    if (strapi.config.get('plugin::webtools-addon-sitemap.autoGenerate')) {
      await subscribeLifecycleMethods(modelName);
    }
  },
});
