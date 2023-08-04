import { request } from "@strapi/helper-plugin";
import { useQuery } from "react-query";
import pluginId from "../pluginId";
import { pluginOptionsSchema } from "../../../lib/schemas/pluginOptions";
import { getContentTypesSchema } from "../../../lib/schemas/getContentTypes";

export const useUrlAliasContentTypes = () => {
  return useQuery([pluginId, "contentTypes"], async () => {
    const response = await request(`/${pluginId}/info/getContentTypes`, {
      method: "GET",
    });
    const parsed = getContentTypesSchema.validateSync(response);
    return parsed;
  }, {
    // TODO: Should refetch in dev after content type changes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};
