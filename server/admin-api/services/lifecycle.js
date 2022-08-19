'use strict';

const _ = require('lodash');

const { getPluginService } = require('../../util/getPluginService');

/**
 * Update an entity.
 *
 * @param {object} event The lifecycle event.
 * @param {string} modelName The name of the model.
 * @returns {void}
 */
const updateEntity = async (event, modelName) => {
  const { id } = event.params.where;
  const { data } = event.params;
  const { uid } = event.model;

  const fetchedEntity = await strapi.entityService.findOne(uid, id);
  const entity = _.merge(fetchedEntity, data);

  if (!entity.url_path_id) {
    let pathEntity;

    if (!data.path_generated && data.path_value) {
      pathEntity = await getPluginService('pathService').create({ url_path: data.path_value, generated: false, contenttype: modelName });
    } else {
      const generatedPath = await getPluginService('patternService').resolvePattern(modelName, entity);
      pathEntity = await getPluginService('pathService').create({ url_path: generatedPath, generated: true, contenttype: modelName });
    }

    data.url_path_id = pathEntity.id;

    return;
  }

  if (!data.path_generated && !data.path_value) {
    const pathEntity = await getPluginService('pathService').findOne(entity.url_path_id);

    if (pathEntity.generated) {
      const generatedPath = await getPluginService('patternService').resolvePattern(modelName, entity);
      await getPluginService('pathService').update(entity.url_path_id, { url_path: generatedPath, generated: true });
    }
  } else if (!data.path_generated && data.path_value) {
    await getPluginService('pathService').update(entity.url_path_id, { url_path: data.path_value, generated: false });
  } else {
    const generatedPath = await getPluginService('patternService').resolvePattern(modelName, entity);
    await getPluginService('pathService').update(entity.url_path_id, { url_path: generatedPath, generated: true });
  }
};
/**
 * Delete an entity.
 *
 * @param {object} event The lifecycle event.
 * @param {string} modelName The name of the model.
 * @returns {void}
 */
const deleteEntity = async (event, modelName) => {
  const { id } = event.params.where;
  const { uid } = event.model;

  const entity = await strapi.entityService.findOne(uid, id);

  if (!entity.url_path_id) {
    return null;
  }

  await getPluginService('pathService').delete(entity.url_path_id);
};

/**
 * Create an entity.
 *
 * @param {object} event The lifecycle event.
 * @param {string} modelName The name of the model.
 * @returns {void}
 */
const createEntity = async (event, modelName) => {
  const { data } = event.params;
  let pathEntity;

  if (!data.path_generated && data.path_value) {
    pathEntity = await getPluginService('pathService').create({ url_path: data.path_value, generated: false, contenttype: modelName });
  } else {
    const generatedPath = await getPluginService('patternService').resolvePattern(modelName, data);
    pathEntity = await getPluginService('pathService').create({ url_path: generatedPath, generated: true, contenttype: modelName });
  }

  data.url_path_id = pathEntity.id;
};

/**
 * Subscribes to the lifecycle methods.
 *
 * @returns {void}
 */

const subscribeLifecycleMethods = async (modelName) => {
  if (strapi.contentTypes[modelName]) {
    await strapi.db.lifecycles.subscribe({
      models: [modelName],

      // Create the path entity.
      async beforeCreate(event) {
        await createEntity(event, modelName);
      },

      // Create the path entity.
      async beforeCreateMany(event) {
        // TODO: wrap in a loop.
        // await createEntity(event, modelName);
      },

      // Delete the path entity.
      async beforeDelete(event) {
        await deleteEntity(event, modelName);
      },

      // Delete the path entity.
      async beforeDeleteMany(event) {
        const ids = event.params.where['$and'][0].id['$in'];
        for (const i = 0; i < ids; i + 1) {
          event.params.where.id = ids[i];
          deleteEntity(event, modelName);
        }
      },

      // Update or create the path entity.
      async beforeUpdate(event) {
        await updateEntity(event, modelName);
      },

      // Update or create the path entity.
      async beforeUpdateMany(event) {
        // TODO: wrap in a loop.
        // await updateEntity(event, modelName);
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
