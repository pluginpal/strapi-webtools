
'use strict';

const _ = require('lodash');

module.exports = async (strapi) => {
  // Register the path_id field.
  Object.values(strapi.contentTypes).forEach((contentType) => {
    const { attributes, pluginOptions } = contentType;

    // Not for CTs that are not visible in the content manager.
    const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
    if (isInContentManager === false) return;

    _.set(attributes, 'path_id', {
      writable: true,
      private: false,
      configurable: false,
      visible: false,
      default: null,
      type: 'string',
    });
  });
};
