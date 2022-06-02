'use strict';

const _ = require('lodash');

module.exports = () => ({
  /**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
  create: async (data) => {
    // TODO:
    // Check for duplicate URLs and append -0, -1, -2 etc.
    const pathEntity = await strapi.entityService.create('plugin::path.path', {
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
    const pathEntity = await strapi.entityService.findOne('plugin::path.path', id);

    return pathEntity;
  },

  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {object} data the data.
   * @returns {void}
   */
   update: async (id, data) => {
    const pathEntity = await strapi.entityService.update('plugin::path.path', id, {
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
    await strapi.entityService.delete('plugin::path.path', id);
  },
});
