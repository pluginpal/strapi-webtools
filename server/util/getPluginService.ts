"use strict";

import { Strapi } from '@strapi/strapi';
import { pluginId } from "./pluginId";

/**
 * A helper function to obtain a plugin service.
 * @param {string} name The name of the service.
 *
 * @return {any} service.
 */
export const getPluginService = (name: string) =>
  strapi.plugin(pluginId).service(name);
