import _ from 'lodash';
import { pluginId } from './pluginId';

export const isContentTypeEnabled = (uid: string) => {
  const contentType = strapi.contentTypes[uid];
  const { pluginOptions } = contentType;

  const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
  if (isInContentManager === false) return false;

  const urlAliasPluginOptionsRaw = _.get(pluginOptions, [pluginId], {});

  if (!urlAliasPluginOptionsRaw.enabled) return false;

  return true;
};
