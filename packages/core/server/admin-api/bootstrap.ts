import { getPluginService } from '../util/getPluginService';
import { IStrapi } from '../types/strapi';

export default (strapi: IStrapi) => {
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
      {
        section: 'plugins',
        displayName: 'Access the URL alias sidebar',
        uid: 'edit-view.sidebar',
        pluginName: 'webtools',
      },
    ];

    strapi.admin.services.permission.actionProvider.registerMany(actions);
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
