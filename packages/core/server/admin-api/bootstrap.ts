

import { getPluginService } from '../util/getPluginService';
import { IStrapi } from '../types/strapi';
import migrateToNativeRelation from './migrations/to-native-relation';
import migratePluginOptionsRename from './migrations/plugin-options-rename';

export default (strapi: IStrapi) => {
  try {
    // Decorate the entity service with review workflow logic
    const { decorator } = getPluginService('queryLayerDecorator');
    strapi.entityService.decorate(decorator);

    // Migrate to a native relation.
    migrateToNativeRelation(strapi);

    // Migrate the pluginOptions to reflect the plugin rename.
    migratePluginOptionsRename(strapi);

    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the URL alias list',
        uid: 'settings.list',
        pluginName: 'webtools',
      },
      {
        section: 'plugins',
        displayName: 'Access the URL alias patterns',
        uid: 'settings.patterns',
        pluginName: 'webtools',
      },
    ];

    strapi.admin.services.permission.actionProvider.registerMany(actions);
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
