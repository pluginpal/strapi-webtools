import get from 'lodash/get';
import { Schema } from '@strapi/strapi';


export const isContentTypeEnabled = (contentType: Schema.ContentType) => {
  const { pluginOptions } = contentType;
  return get(pluginOptions, ['webtools', 'enabled'], false) as boolean;
};
