import { Schema } from '@strapi/strapi';

export const sanitizeOutput = async (
  data,
  contentType: Schema.ContentType,
  auth: unknown,
) => {
  const output = await strapi.contentAPI.sanitize.output(data, contentType, { auth });

  const populateCreatorFields = strapi.config.get('plugin::webtools.populate_creator_fields');

  if (populateCreatorFields) {
    if (Object.prototype.hasOwnProperty.call(data, 'createdBy') && !Object.prototype.hasOwnProperty.call(output, 'createdBy')) {
      const creator = data.createdBy;
      if (creator) {
        output.createdBy = await strapi.contentAPI.sanitize.output(creator, strapi.getModel('admin::user'), { auth });
      } else {
        output.createdBy = creator;
      }
    }

    if (Object.prototype.hasOwnProperty.call(data, 'updatedBy') && !Object.prototype.hasOwnProperty.call(output, 'updatedBy')) {
      const creator = data.updatedBy;
      if (creator) {
        output.updatedBy = await strapi.contentAPI.sanitize.output(creator, strapi.getModel('admin::user'), { auth });
      } else {
        output.updatedBy = creator;
      }
    }
  }

  return output;
};

export default {
  sanitizeOutput,
};
