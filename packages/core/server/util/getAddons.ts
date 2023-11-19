const getAddons = (strapi) => {
  const enabledPlugins = strapi.config.get('enabledPlugins');
  const addons = {};

  for (const plugin of Object.keys(enabledPlugins)) {
    if (enabledPlugins[plugin].info.webtoolsAddon === true) {
      addons[plugin] = enabledPlugins[plugin];
    }
  }

  return addons;
};

export default getAddons;
