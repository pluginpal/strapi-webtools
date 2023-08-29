"use strict";

import { object, boolean, InferType } from "yup";

export const pluginOptionsSchema = object({
  enabled: boolean().default(false),
});

export type PluginOptions = InferType<typeof pluginOptionsSchema>;
