const pluginPermissions = {
  // This permission regards the main component (App) and is used to tell
  // If the plugin link should be displayed in the menu
  // And also if the plugin is accessible. This use case is found when a user types the url of the
  // plugin directly in the browser
  'settings.list': [{ action: 'plugin::webtools.settings.list', subject: null }],
  'settings.overview': [{ action: 'plugin::webtools.settings.overview', subject: null }],
  'settings.patterns': [{ action: 'plugin::webtools.settings.patterns', subject: null }],
};

export default pluginPermissions;
