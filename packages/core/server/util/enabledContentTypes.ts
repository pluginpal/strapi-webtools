import get from 'lodash/get';
import { Common, Schema } from '@strapi/strapi';

import { pluginId } from './pluginId';

export const isContentTypeEnabled = (ct: Common.UID.ContentType | Schema.ContentType) => {
  let contentType: Schema.ContentType;

  if (typeof ct === 'string') {
    contentType = strapi.contentTypes[ct];
  } else {
    contentType = ct;
  }

  const { pluginOptions } = contentType;
  const enabled = get(pluginOptions, [pluginId, 'enabled'], false) as boolean;

  if (!enabled) return false;

  return true;
};
