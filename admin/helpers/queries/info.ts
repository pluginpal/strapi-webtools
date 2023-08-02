import { request } from "@strapi/helper-plugin";
import { useQuery } from "react-query";
import pluginId from "../pluginId";
import { pluginOptionsSchema } from "../../../lib/schemas/pluginOptions";

export const usePluginOptions = (uid: string) => {
  return useQuery([pluginId, "pluginOptions", uid], async () => {
    const response = await request(`/${pluginId}/info/getPluginOptions/${uid}`, {
      method: "GET",
    });
    const parsed = pluginOptionsSchema.cast(response);
    return parsed;
  });
};
