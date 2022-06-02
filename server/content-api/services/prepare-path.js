'use strict';

const _ = require('lodash');
const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  /**
   * Test.
   *
   * @param {object} data the data.
   * @returns {object} transformed data
   */
  preparePath: async function traverse(data) {
    if (!_.isObject(data)) {
      return data;
    }

    // fields
    await Promise.all(Object.entries(data).map(async ([key, value]) => {
      if (!value && key !== 'path_id') {
        return;
      }

      if (key === 'path_id' && Number(value)) {
        const pathEntity = await getPluginService('pathService').get(value);
        data[key] = pathEntity.path;
      }

      // relation(s)
      if (_.has(value, 'data')) {
        let relation = null;
        // single
        if (_.isObject(value.data)) {
          relation = await traverse(value.data);
        }

        // many
        if (_.isArray(value.data)) {
          relation = await value.data.map((e) => traverse(e));
        }

        data[key]['data'] = relation;
      }

      // single component
      if (_.has(value, 'id')) {
        data[key] = await traverse(value);
      }

      // repeatable component & dynamic zone
      if (_.isArray(value) && _.has(_.head(value), 'id')) {
        data[key] = await value.map((p) => traverse(p));
      }
    }));

    return data;
  },

  async response(data) {
    data = await this.preparePath(data);
    return data;
  },
});
