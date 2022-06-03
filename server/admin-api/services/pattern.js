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
    data.code = _.snakeCase(_.deburr(_.toLower(data.label)));

    const patternEntity = await strapi.entityService.create('plugin::path.pattern', {
      data,
    });

    return patternEntity;
  },

  /**
   * FindOne.
   *
   * @param {number} id the id.
   * @returns {void}
   */
   findOne: async (id) => {
    const patternEntity = await strapi.entityService.findOne('plugin::path.pattern', id);

    return patternEntity;
  },

  /**
   * Get.
   *
   * @returns {void}
   */
   findMany: async () => {
    const patternEntities = await strapi.entityService.findMany('plugin::path.pattern');

    return patternEntities;
  },

  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {object} data the data.
   * @returns {void}
   */
   update: async (id, data) => {
    const patternEntity = await strapi.entityService.update('plugin::path.pattern', id, {
      data,
    });

    return patternEntity;
  },

  /**
   * Delete.
   *
   * @param {number} id the id.
   * @returns {void}
   */
   delete: async (id) => {
    await strapi.entityService.delete('plugin::path.pattern', id);
  },
});
