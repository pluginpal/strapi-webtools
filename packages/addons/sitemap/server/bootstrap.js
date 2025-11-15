import { logMessage } from './utils';
import { getPluginService } from './utils/getPluginService';

export default async () => {
  const cron = strapi.config.get('plugin::webtools-addon-sitemap.cron');

  try {
    // Give the public role permissions to access the public API endpoints.
    if (strapi.plugin('users-permissions')) {
      const roles = await strapi
        .service('plugin::users-permissions.role')
        .find();

      const publicId = roles.filter((role) => role.type === 'public')[0]?.id;

      if (publicId) {
        const _public = await strapi
          .service('plugin::users-permissions.role')
          .findOne(publicId);

        _public.permissions['plugin::webtools-addon-sitemap'] = {
          controllers: {
            core: {
              getSitemap: { enabled: true },
              getSitemapXsl: { enabled: true },
              getSitemapXslCss: { enabled: true },
              getSitemapXslJs: { enabled: true },
              getSitemapXslSortable: { enabled: true },
            },
          },
        };

        await strapi
          .service('plugin::users-permissions.role')
          .updateRole(_public.id, _public);
      }
    }

    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the plugin settings',
        uid: 'settings.read',
        pluginName: 'webtools-addon-sitemap',
      },
    ];
    await strapi.admin.services.permission.actionProvider.registerMany(actions);

    // Schedule cron to generate the sitemap
    if (cron) {
      strapi.cron.add({
        generateDefaultSitemap: {
          task: async ({ strapi }) => {
            getPluginService('core').createSitemap('default');
          },
          options: {
            rule: cron,
          },
        },
      });
    }
  } catch (error) {
    strapi.log.error(logMessage(`Bootstrap failed with error "${error.message}".`));
  }
};
