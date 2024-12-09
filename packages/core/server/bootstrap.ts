import { Core } from '@strapi/strapi';
import { IStrapi } from './types/strapi';
import { getPluginService } from './util/getPluginService';

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    // // Decorate the entity service with review workflow logic
    // const { decorator } = getPluginService('queryLayerDecorator');
    // strapi.entityService.decorate(decorator);

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

    // Give the public role permissions to access the public API endpoints.
    if (strapi.plugin('users-permissions')) {
      const roles = await strapi
        .service('plugin::users-permissions.role')
        .find();

      const publicId = roles.filter((role) => role.type === 'public')[0]?.id;

      if (publicId) {
        const publicRole = await strapi
          .service('plugin::users-permissions.role')
          .findOne(publicId);

        publicRole.permissions['plugin::webtools'] = {
          controllers: {
            core: {
              router: { enabled: true },
            },
            'url-alias': {
              find: { enabled: true },
            },
          },
        };

        await strapi
          .service('plugin::users-permissions.role')
          .updateRole(publicRole.id, publicRole);
      }
    }
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
