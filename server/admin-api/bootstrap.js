'use strict';

const { getPluginService } = require("../util/getPluginService");

module.exports = async () => {
  try {
    // Register the lifecycle methods.
    await getPluginService('lifecycleService').loadAllLifecycleMethods();

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
  } catch (error) {
    strapi.log.error('Bootstrap failed.');
  }
};
