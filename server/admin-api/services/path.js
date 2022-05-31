'use strict';

const _ = require('lodash');

module.exports = () => ({
  /**
   * Create.
   *
   * @param {string} path the path.
   * @returns {void}
   */
  create: async (path) => {
    // TODO:
    // Check for duplicate URLs and append -0, -1, -2 etc.
    const pathEntity = await strapi.entityService.create('plugin::path.path', {
      data: {
        path,
      },
    });

    return pathEntity;
  },

  /**
   * Get.
   *
   * @param {number} id the id.
   * @returns {void}
   */
   get: async (id) => {
    const pathEntity = await strapi.entityService.findOne('plugin::path.path', id);

    return pathEntity;
  },

  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {string} path the path.
   * @returns {void}
   */
   update: async (id, path) => {
    const pathEntity = await strapi.entityService.update('plugin::path.path', id, {
      data: {
        path,
      },
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
    await strapi.entityService.delete('plugin::path.path', id);
  },
});
