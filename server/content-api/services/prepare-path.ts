'use strict';

import _ from 'lodash';
import { getPluginService } from '../../util/getPluginService';

module.exports = () => ({
  /**
   * Rewrite url_path_id to the actual path.
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

      if (key === 'url_path_id') {
        if (Number(value) && value !== null) {
          const pathEntity = await getPluginService('pathService').findOne(value);
          data['url_path'] = pathEntity.url_path;
        }

        // delete data.url_path_id;
      }
    }));

    return data;
  },

  async response(data) {
    data = await this.preparePath(data);
    return data;
  },
});
