'use strict';

import _ from 'lodash';

import { getPluginService } from '../../util/getPluginService';

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
      pathEntity = await getPluginService('urlAliasService').create({ url_path: data.path_value, generated: false, contenttype: modelName });
    } else {
      const generatedPath = await getPluginService('urlPatternService').resolvePattern(modelName, entity);
      pathEntity = await getPluginService('urlAliasService').create({ url_path: generatedPath, generated: true, contenttype: modelName });
    }

    data.url_path_id = pathEntity.id;

    return;
  }

  if (!data.path_generated && !data.path_value) {
    const pathEntity = await getPluginService('urlAliasService').findOne(entity.url_path_id);

    if (pathEntity.generated) {
      const generatedPath = await getPluginService('urlPatternService').resolvePattern(modelName, entity);
      await getPluginService('urlAliasService').update(entity.url_path_id, { url_path: generatedPath, generated: true });
    }
  } else if (!data.path_generated && data.path_value) {
    await getPluginService('urlAliasService').update(entity.url_path_id, { url_path: data.path_value, generated: false });
  } else {
    const generatedPath = await getPluginService('urlPatternService').resolvePattern(modelName, entity);
    await getPluginService('urlAliasService').update(entity.url_path_id, { url_path: generatedPath, generated: true });
  }
};
/**
 * Delete an entity.
 *
 * @param {object} event The lifecycle event.
 * @param {string} parentId The parent id.
 * @returns {void}
 */
const deleteEntity = async (event, parentId?) => {
  const { id } = event.params.where;
  const { uid } = event.model;

  const entity = await strapi.entityService.findOne(uid, parentId || id);

  if (!entity.url_path_id) {
    return null;
  }

  await getPluginService('urlAliasService').delete(entity.url_path_id);
};

/**
 * Create an entity.
 *
 * @param {object} event The lifecycle event.
 * @returns {void}
 */
const createEntity = async (event) => {
  const { data } = event.params;
  const { uid } = event.model;

  let pathEntity;

  if (!data.path_generated && data.path_value) {
    pathEntity = await getPluginService('urlAliasService').create({ url_path: data.path_value, generated: false, contenttype: uid });
  } else {
    const generatedPath = await getPluginService('urlPatternService').resolvePattern(uid, data);
    pathEntity = await getPluginService('urlAliasService').create({ url_path: generatedPath, generated: true, contenttype: uid });
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
    strapi.db.lifecycles.subscribe({
      // @ts-ignore
      models: [modelName],

      // Create the path entity.
      async beforeCreate(event) {
        await createEntity(event);
      },

      // Create the path entity.
      async beforeCreateMany(event) {
        // TODO: before create many.
        // const ids = event.params.where['$and'][0].id['$in'];
        // for (let i = 0; i < ids.length; i++) {
        //   createEntity(event, ids[i]);
        // }
      },

      // Delete the path entity.
      async beforeDelete(event) {
        await deleteEntity(event);
      },

      // Delete the path entity.
      async beforeDeleteMany(event) {
        const ids = event.params.where.$and[0].id.$in;
        for (let i = 0; i < ids.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          await deleteEntity(event, ids[i]);
        }
      },

      // Update or create the path entity.
      async beforeUpdate(event) {
        await updateEntity(event, modelName);
      },

      // Update or create the path entity.
      async beforeUpdateMany(event) {
        // TODO: before update many.
        // const ids = event.params.where['$and'][0].id['$in'];
        // for (let i = 0; i < ids.length; i++) {
        //   updateEntity(event, ids[i]);
        // }
      },
    });
  } else {
    strapi.log.error(`Could not load lifecycles on model '${modelName}'`);
  }
};

export default () => ({
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