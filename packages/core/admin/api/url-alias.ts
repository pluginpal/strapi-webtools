import { request } from '@strapi/helper-plugin';

export const createUrlAlias = async (body, slug) => {
  return request('/content-manager/collection-types/plugin::webtools.url-alias', {
    method: 'POST',
    body: {
      ...body,
      contenttype: slug,
    },
  });
};

export const updateUrlAlias = async (body, slug) => {
  return request(`/content-manager/collection-types/plugin::webtools.url-alias/${body.id}`, {
    method: 'PUT',
    body: {
      ...body,
      contenttype: slug,
    },
  });
};
