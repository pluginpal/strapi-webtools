import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the overview page',
        uid: 'settings.list',
        pluginName: 'webtools-addon-redirects',
      },
      {
        section: 'plugins',
        displayName: 'Edit existing redirects',
        uid: 'settings.edit',
        pluginName: 'webtools-addon-redirects',
      },
      {
        section: 'plugins',
        displayName: 'Create new redirects',
        uid: 'settings.create',
        pluginName: 'webtools-addon-redirects',
      },
      {
        section: 'plugins',
        displayName: 'Delete existing redirects',
        uid: 'settings.delete',
        pluginName: 'webtools-addon-redirects',
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (strapi.admin.services.permission.actionProvider.registerMany as (a: any) => void)(actions);
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
