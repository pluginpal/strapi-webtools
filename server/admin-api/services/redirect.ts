"use strict";

import { getPluginService } from "../../util/getPluginService";
import { pluginId } from "../../util/pluginId";

export default () => ({
  async create(fromPathId: number | string, toPathId: number | string) {
    return strapi.entityService.create("plugin::url-alias.redirect", {
      data: {
        from_path_id: fromPathId,
        to_path_id: toPathId,
      },
    });
  },

  async createFromChange(pathEntityOrId: { [key: string]: any } | number | string, newPath: string) {
    const pathEntity = typeof pathEntityOrId === "object" ? pathEntityOrId : await getPluginService("pathService").findOne(pathEntityOrId);
    const oldPath = pathEntity.url_path;

    if (oldPath === newPath) {
      return null;
    }

    const pathService = getPluginService("pathService");
    // Update path entity
    await pathService.update(pathEntity.id, {
      url_path: newPath,
    });

    // Create new path entity
    const newPathEntity = await pathService.create({
      url_path: oldPath,
      generated: true,
      contenttype: `plugin::${pluginId}.redirect`,
    });
    // Create redirect entity

    const service = getPluginService("redirectService");

    return service.create(newPathEntity.id, pathEntity.id);
  },
});
