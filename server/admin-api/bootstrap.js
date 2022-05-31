'use strict';

module.exports = async () => {
  // Register permission actions.
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the plugin settings',
      uid: 'settings.read',
      pluginName: 'path',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
