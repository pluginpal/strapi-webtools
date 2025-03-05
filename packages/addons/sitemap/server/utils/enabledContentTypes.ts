import get from 'lodash/get';
import { UID, Schema } from '@strapi/strapi';


export const isContentTypeEnabled = (ct: UID.ContentType) => {
  let contentType: Schema.ContentType;

  if (typeof ct === 'string') {
    contentType = strapi.contentTypes[ct];
  } else {
    contentType = ct;
  }

  const { pluginOptions } = contentType;
  const enabled = get(pluginOptions, ['webtools', 'enabled'], false) as boolean;

  if (!enabled) return false;

  return true;
};
