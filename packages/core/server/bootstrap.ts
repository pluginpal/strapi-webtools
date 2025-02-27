import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  try {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (strapi.admin.services.permission.actionProvider.registerMany as (a: any) => void)(actions);
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
