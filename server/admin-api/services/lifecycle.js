'use strict';

const { getPluginService } = require('../../util/getPluginService');

/**
 * Gets lifecycle service
 *
 * @returns {object} - Lifecycle service
 */

const subscribeLifecycleMethods = async (modelName) => {
  if (strapi.contentTypes[modelName]) {
    await strapi.db.lifecycles.subscribe({
      models: [modelName],

      async beforeCreate(event) {
        const { data } = event.params;
      },

      async beforeDelete(event) {
        const { data } = event.params;
        console.log(data);
      },

      async beforeUpdate(event) {
        const { data } = event.params;

        if (!data.path_id) {
          return null;
        }

        if (data.overridden_path && data.overridden_path_value) {
          await getPluginService('pathService').update(data.path_id, { path: data.overridden_path_value, generated: false });
        } else {
          await getPluginService('pathService').update(data.path_id, { path: 'generated-path', generated: true });
        }
      },
    });
  } else {
    strapi.log.error(`Could not load lifecycles on model '${modelName}'`);
  }
};

module.exports = () => ({
  async loadAllLifecycleMethods() {
    Object.keys(strapi.contentTypes).map(async (contentType) => {
      await subscribeLifecycleMethods(contentType);
    });
  },

  async loadLifecycleMethod(modelName) {
    await subscribeLifecycleMethods(modelName);
  },
});
