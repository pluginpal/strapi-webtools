'use strict';

const _ = require('lodash');
const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  /**
   * Rewrite path_id to the actual path.
   *
   * @param {object} data the data.
   * @returns {object} transformed data
   */
  preparePath: async function traverse(data) {
    if (!_.isObject(data)) {
      return data;
    }

    await Promise.all(Object.entries(data).map(async ([key, value]) => {
      if (_.isObject(data[key])) {
        await traverse(data[key]);
        return;
      }

      if (key === 'path_id') {
        if (Number(value)) {
          const pathEntity = await getPluginService('pathService').findOne(value);
          data['path'] = pathEntity.path;
        }

        delete data.path_id;
      }
    }));

    return data;
  },

  async response(data) {
    data = await this.preparePath(data);
    return data;
  },
});
