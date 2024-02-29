'use strict';

import { getService, logMessage } from '../utils';

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
        await getService('core').createSitemap();
      },

      async afterCreateMany() {
        await getService('core').createSitemap();
      },

      async afterUpdate() {
        await getService('core').createSitemap();
      },

      async afterUpdateMany() {
        await getService('core').createSitemap();
      },

      async afterDelete() {
        await getService('core').createSitemap();
      },

      async afterDeleteMany() {
        await getService('core').createSitemap();
      },
    });
  } else {
    strapi.log.error(logMessage(`Could not load lifecycles on model '${modelName}'`));
  }
};

export default () => ({
  async loadAllLifecycleMethods() {
    const settings = await getService('settings').getConfig();

    // Loop over configured contentTypes from store.
    if (settings.contentTypes && strapi.config.get('plugin.webtools-addon-sitemap.autoGenerate')) {
      Object.keys(settings.contentTypes).map(async (contentType) => {
        await subscribeLifecycleMethods(contentType);
      });
    }
  },

  async loadLifecycleMethod(modelName) {
    if (strapi.config.get('plugin.webtools-addon-sitemap.autoGenerate')) {
      await subscribeLifecycleMethods(modelName);
    }
  },
});
