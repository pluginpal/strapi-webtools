import { contentAPI } from '@strapi/utils/lib/sanitize';

export const sanitizeOutput = (data, contentType, auth) => contentAPI.output(data, contentType, { auth });

module.exports = {
  sanitizeOutput,
};
