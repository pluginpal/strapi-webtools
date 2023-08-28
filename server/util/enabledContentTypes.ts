import _ from 'lodash';
import { pluginId } from './pluginId';
import { pluginOptionsSchema } from '../../lib/schemas/pluginOptions';

export const isContentTypeEnabled = (uid: string) => {
  const contentType = strapi.contentTypes[uid];
  const { pluginOptions } = contentType;

  const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
  if (isInContentManager === false) return false;

  const urlAliasPluginOptionsRaw = _.get(pluginOptions, [pluginId], {});
  const urlAliasOptions = pluginOptionsSchema.cast(urlAliasPluginOptionsRaw);

  if (!urlAliasOptions.enabled) return false;

  return true;
};
