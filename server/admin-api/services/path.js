'use strict';

const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  /**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
  create: async (data) => {
    const duplicateCheck = async (ext = -1) => {
      const extension = ext >= 0 ? `-${ext}` : '';
      const pathAllreadyExists = await getPluginService('pathService').findByPath(data.path + extension);

      if (pathAllreadyExists) {
        duplicateCheck(ext + 1);
      } else {
        data.path = data.path + extension;
      }
    };

    await duplicateCheck();

    const pathEntity = await strapi.entityService.create('plugin::url-alias.path', {
      data,
    });

    return pathEntity;
  },

  /**
   * findOne.
   *
   * @param {number} id the id.
   * @returns {void}
   */
   findOne: async (id) => {
    const pathEntity = await strapi.entityService.findOne('plugin::url-alias.path', id);

    return pathEntity;
  },

  /**
   * findByPath.
   *
   * @param {string} path the path.
   * @returns {void}
   */
   findByPath: async (path) => {
    const pathEntity = await strapi.entityService.findMany('plugin::url-alias.path', {
      filters: {
        path,
      },
      limit: 1,
    });

    return pathEntity[0];
  },

  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {object} data the data.
   * @returns {void}
   */
  update: async (id, data) => {
    const duplicateCheck = async (ext = -1) => {
      const extension = ext >= 0 ? `-${ext}` : '';
      const pathAllreadyExists = await getPluginService('pathService').findByPath(data.path + extension);

      if (pathAllreadyExists) {
        duplicateCheck(ext + 1);
      } else {
        data.path = data.path + extension;
      }
    };

    await duplicateCheck();

    const pathEntity = await strapi.entityService.update('plugin::url-alias.path', id, {
      data,
    });

    return pathEntity;
  },

  /**
   * Delete.
   *
   * @param {number} id the id.
   * @returns {void}
   */
   delete: async (id) => {
    await strapi.entityService.delete('plugin::url-alias.path', id);
  },
});
