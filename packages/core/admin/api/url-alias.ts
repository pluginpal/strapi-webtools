import { useFetchClient } from '@strapi/helper-plugin';

export const useCreateUrlAlias = () => {
  const { post } = useFetchClient();

  const createUrlAlias = async (body: { id: number }, slug: string) => {
    return post('/webtools/url-alias/create', {
      data: {
        ...body,
        contenttype: slug,
      },
    });
  };

  return { createUrlAlias };
};

export const useUpdateUrlAlias = () => {
  const { put } = useFetchClient();

  const updateUrlAlias = async (body: { id: number }, slug: string) => {
    return put(`/webtools/url-alias/update/${body.id}`, {
      data: {
        ...body,
        contenttype: slug,
      },
    });
  };

  return { updateUrlAlias };
};

export const useDeleteUrlAlias = () => {
  const { post } = useFetchClient();

  const deleteUrlAlias = async (body: { id: number }) => {
    return post(`/webtools/url-alias/delete/${body.id}`);
  };

  return { deleteUrlAlias };
};
