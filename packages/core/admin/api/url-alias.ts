import { useFetchClient } from '@strapi/helper-plugin';

export const createUrlAlias = async (body: { id: number }, slug: string) => {
  const { post } = useFetchClient();

  return post('/webtools/url-alias/create', {
    method: 'POST',
    body: {
      // @ts-ignore
      data: {
        ...body,
        contenttype: slug,
      },
    },
  });
};

export const updateUrlAlias = async (body: { id: number }, slug: string) => {
  const { put } = useFetchClient();

  return put(`/webtools/url-alias/update/${body.id}`, {
    method: 'PUT',
    body: {
      // @ts-ignore
      data: body,
      contenttype: slug,
    },
  });
};

export const deleteUrlAlias = async (body: { id: number }) => {
  const { post } = useFetchClient();

  return post(`/webtools/url-alias/delete/${body.id}`, {
    method: 'POST',
  });
};
