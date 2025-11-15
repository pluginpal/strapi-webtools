'use strict';

import { Map } from 'immutable';
import { isOldConfigFormat, migrateToNewConfigObject } from '../migrations/migrate-config-object-to-array';
import packageJson from '../../package.json';

/**
 * Sitemap.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

export const pluginStore = strapi.store({
  environment: '',
  type: 'plugin',
  name: 'sitemap',
});

const createDefaultConfig = async () => {
  const value = {
    version: packageJson.version,
    sitemaps: {
      default: {
        hostname: '',
        includeHomepage: true,
        excludeDrafts: true,
        defaultLanguageUrlType: '',
        defaultLanguageUrl: '',
        hostname_overrides: {},
        contentTypes: Map({}),
        customEntries: Map({}),
      },
    },
  };

  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
};

export default () => ({
  getConfig: async () => {
    let config = await pluginStore.get({ key: 'settings' });

    // Create default config if none is found
    if (!config) {
      config = await createDefaultConfig();
    }

    // Migrate old config format to new one
    if (isOldConfigFormat(config)) {
      config = migrateToNewConfigObject(config);
    }

    // Update the stored config version
    await pluginStore.set({
      key: 'settings',
      value: {
        ...config,
        version: packageJson.version,
      },
    });

    // Return the final config
    const finalConfig = await pluginStore.get({ key: 'settings' });
    return finalConfig;
  },
});
