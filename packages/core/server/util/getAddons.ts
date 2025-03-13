const getAddons = () => {
  const enabledPlugins = strapi.config.get('enabledPlugins');

  const addons: {
    [key: string]: unknown
  } = {};

  Object.keys(enabledPlugins).forEach((plugin) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const webtoolsAddon = enabledPlugins[plugin]?.info?.webtoolsAddon as boolean;

    if (webtoolsAddon === true) {
      addons[plugin] = enabledPlugins[plugin];
    }
  });

  return addons;
};

export default getAddons;
