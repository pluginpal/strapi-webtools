"use strict";

import { pluginId } from "./pluginId";
import type config from '..';

type Config = typeof config;
type Services = Config['services'];
/**
 * A helper function to obtain a plugin service.
 * @param {string} name The name of the service.
 *
 * @return {any} service.
 */
export const getPluginService = <ServiceName extends keyof Services>(name: ServiceName) => {
  const service = strapi.service<ReturnType<Services[ServiceName]>>(`plugin::${pluginId}.${name}`);
  return service as Exclude<typeof service, undefined>;
};
