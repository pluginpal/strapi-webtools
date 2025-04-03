const pluginPermissions = {
  // This permission regards the main component (App) and is used to tell
  // If the plugin link should be displayed in the menu
  // And also if the plugin is accessible. This use case is found when a user types the url of the
  // plugin directly in the browser
  'settings.list': [{ action: 'plugin::webtools-addon-redirects.settings.list', subject: null }],
  'settings.edit': [{ action: 'plugin::webtools-addon-redirects.settings.edit', subject: null }],
  'settings.create': [{ action: 'plugin::webtools-addon-redirects.settings.create', subject: null }],
  'settings.delete': [{ action: 'plugin::webtools-addon-redirects.settings.delete', subject: null }],
};

export default pluginPermissions;
