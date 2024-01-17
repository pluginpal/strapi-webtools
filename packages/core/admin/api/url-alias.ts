import { request } from '@strapi/helper-plugin';

export const createUrlAlias = async (body: { id: number }, slug: string) => {
  return request('/webtools/url-alias/create', {
    method: 'POST',
    body: {
      // @ts-expect-error
      data: {
        ...body,
        contenttype: slug,
      },
    },
  });
};

export const updateUrlAlias = async (body: { id: number }, slug: string) => {
  return request(`/webtools/url-alias/update/${body.id}`, {
    method: 'PUT',
    body: {
      // @ts-expect-error
      data: body,
      contenttype: slug,
    },
  });
};
