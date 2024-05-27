import { useFetchClient } from '@strapi/helper-plugin';

export const useCreateUrlAlias = () => {
  const { post } = useFetchClient();

  const createUrlAlias = async (body: { id: number }, slug: string) => {
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

  return { createUrlAlias };
};

export const useUpdateUrlAlias = () => {
  const { put } = useFetchClient();

  const updateUrlAlias = async (body: { id: number }, slug: string) => {
    return put(`/webtools/url-alias/update/${body.id}`, {
      method: 'PUT',
      body: {
        // @ts-ignore
        data: body,
        contenttype: slug,
      },
    });
  };

  return { updateUrlAlias };
};

export const useDeleteUrlAlias = () => {
  const { post } = useFetchClient();

  const deleteUrlAlias = async (body: { id: number }) => {
    return post(`/webtools/url-alias/delete/${body.id}`, {
      method: 'POST',
    });
  };

  return { deleteUrlAlias };
};
