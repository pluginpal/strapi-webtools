import packageJson from '../../package.json';

export const migrateToNewConfigObject = (oldConfig) => {
  return {
    version: packageJson.version,
    sitemaps: {
      default: oldConfig,
    },
  };
};

export const isOldConfigFormat = (config) => {
  return config.version === undefined;
};
