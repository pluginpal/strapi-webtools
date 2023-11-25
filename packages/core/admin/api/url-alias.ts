import { request } from '@strapi/helper-plugin';

export const createUrlAlias = async (body, slug: string) => {
  return request('/content-manager/collection-types/plugin::webtools.url-alias', {
    method: 'POST',
    body: JSON.stringify({
      ...body,
      contenttype: slug,
    }),
  });
};

export const updateUrlAlias = async (body: { id: number }, slug: string) => {
  return request(`/content-manager/collection-types/plugin::webtools.url-alias/${body.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...body,
      contenttype: slug,
    }),
  });
};
