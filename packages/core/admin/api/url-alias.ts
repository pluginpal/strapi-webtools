import { useFetchClient } from '@strapi/helper-plugin';
import { UrlAliasEntity } from '../types/url-aliases';

export const useCreateUrlAlias = () => {
  const { post } = useFetchClient();

  const createUrlAlias = async (body: { id: number }, slug: string) => {
    return post<UrlAliasEntity>('/webtools/url-alias/create', {
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
  const updateUrlAliases = async (body: { id: number }, slug: string) => {
    return put<UrlAliasEntity>(`/webtools/url-alias/update/${body.id}`, {
      data: {
        ...body,
        contenttype: slug,
      },
    });
  };

  return { updateUrlAliases };
};


export const useDeleteUrlAlias = () => {
  const { post } = useFetchClient();

  const deleteUrlAlias = async (body: { id: number }) => {
    return post(`/webtools/url-alias/delete/${body.id}`);
  };

  return { deleteUrlAlias };
};
