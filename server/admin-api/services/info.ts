'use strict';

import { get } from 'lodash';
import { pluginOptionsSchema } from '../../../lib/schemas/pluginOptions';
import { pluginId } from '../../util/pluginId';

export default () => ({
  getPluginOptions: (uid: string) => {
    const contentType = strapi.contentType(uid as any); // Using as any should be fine here as we do not know about the user's content types
    const pluginOptions = get(contentType, ['pluginOptions', pluginId], {});
    const schema = pluginOptionsSchema;

    return schema.cast(pluginOptions);
  },
});
