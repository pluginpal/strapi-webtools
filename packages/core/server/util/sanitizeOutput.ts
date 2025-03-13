import { Schema } from '@strapi/strapi';

export const sanitizeOutput = (
  data,
  contentType: Schema.ContentType,
  auth: unknown,
) => strapi.contentAPI.sanitize.output(data, contentType, { auth });

export default {
  sanitizeOutput,
};
