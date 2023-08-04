"use strict";

import { object, array, string, InferType } from "yup";

export const getContentTypesSchema = array(
  object({
    name: string().required(),
    uid: string().required(),
  }),
).required();

export type GetContentTypes = InferType<typeof getContentTypesSchema>;
