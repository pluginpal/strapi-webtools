import get from 'lodash/get';
import { Schema } from '@strapi/strapi';

import { pluginId } from './pluginId';

export const isContentTypeEnabled = (ct: Schema.ContentType) => {
  let contentType: Schema.ContentType;

  if (typeof ct === 'string') {
    contentType = strapi.contentTypes[ct];
  } else {
    contentType = ct;
  }

  const { pluginOptions } = contentType;

  return get(pluginOptions, [pluginId, 'enabled'], false) as boolean;
};
