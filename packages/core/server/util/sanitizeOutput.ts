import { sanitize } from '@strapi/utils';

export const sanitizeOutput = (data, contentType, auth) => sanitize.contentAPI.output(data, contentType, { auth });

module.exports = {
  sanitizeOutput,
};
