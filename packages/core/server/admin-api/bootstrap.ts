'use strict';

import { getPluginService } from '../util/getPluginService';

export default async ({ strapi }) => {
  try {
    // Decorate the entity service with review workflow logic
    const { decorator } = getPluginService('queryLayerDecorator');
    strapi.entityService.decorate(decorator);

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
    await strapi.admin.services.permission.actionProvider.registerMany(actions);
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${error}`);
  }
};
