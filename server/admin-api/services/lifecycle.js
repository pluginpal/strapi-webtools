'use strict';

const _ = require('lodash');

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

      // Create the path entity.
      async beforeCreate(event) {
        const { data } = event.params;
        let pathEntity;

        if (!data.path_generated && data.path_value) {
          pathEntity = await getPluginService('pathService').create({ path: data.path_value, generated: false, contenttype: modelName });
        } else {
          const generatedPath = await getPluginService('patternService').resolvePattern(modelName, data);
          pathEntity = await getPluginService('pathService').create({ path: generatedPath, generated: true, contenttype: modelName });
        }

        data.path_id = pathEntity.id;
      },

      // Delete the path entity.
      async beforeDelete(event) {
        const { id } = event.params.where;
        const { uid } = event.model;

        const entity = await strapi.entityService.findOne(uid, id);

        if (!entity.path_id) {
          return null;
        }

        await getPluginService('pathService').delete(entity.path_id);
      },

      // Update or create the path entity.
      async beforeUpdate(event) {
        const { data } = event.params;

        if (!data.path_id) {
          let pathEntity;

          if (!data.path_generated && data.path_value) {
            pathEntity = await getPluginService('pathService').create({ path: data.path_value, generated: false, contenttype: modelName });
          } else {
            const generatedPath = await getPluginService('patternService').resolvePattern(modelName, data);
            pathEntity = await getPluginService('pathService').create({ path: generatedPath, generated: true, contenttype: modelName });
          }

          data.path_id = pathEntity.id;

          return;
        }

        if (!data.path_generated && !data.path_value) {
          const pathEntity = await getPluginService('pathService').findOne(data.path_id);

          if (pathEntity.generated) {
            const generatedPath = await getPluginService('patternService').resolvePattern(modelName, data);
            await getPluginService('pathService').update(data.path_id, { path: generatedPath, generated: true });
          }
        } else if (!data.path_generated && data.path_value) {
          await getPluginService('pathService').update(data.path_id, { path: data.path_value, generated: false });
        } else {
          const generatedPath = await getPluginService('patternService').resolvePattern(modelName, data);
          await getPluginService('pathService').update(data.path_id, { path: generatedPath, generated: true });
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
      const { pluginOptions } = strapi.contentTypes[contentType];

      // Not for CTs that are not visible in the content manager.
      const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
      if (isInContentManager === false) return;

      await subscribeLifecycleMethods(contentType);
    });
  },

  async loadLifecycleMethod(modelName) {
    await subscribeLifecycleMethods(modelName);
  },
});
