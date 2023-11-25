import { Schema } from '@strapi/strapi';
import { sanitize } from '@strapi/utils';

export const sanitizeOutput = (
  data,
  contentType: Schema.ContentType,
  auth: unknown,
) => sanitize.contentAPI.output(data, contentType, { auth });

export default {
  sanitizeOutput,
};
