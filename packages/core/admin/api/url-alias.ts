import { request } from '@strapi/helper-plugin';

export const create = async (body, slug) => {
  return await request('/content-manager/collection-types/plugin::webtools.url-alias', {
    method: 'POST',
    body: {
      ...body,
      contenttype: slug,
    },
  });
};

export const update = async (body, slug) => {
  return await request(`/content-manager/collection-types/plugin::webtools.url-alias/${body.id}`, {
    method: 'PUT',
    body: {
      ...body,
      contenttype: slug,
    },
  });
};
