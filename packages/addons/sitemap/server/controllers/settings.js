'use strict';

import { Map } from 'immutable';
import { pluginStore } from '../services/settings';
import { getPluginService } from '../utils/getPluginService';

/**
 * Sitemap.js controller
 *
 * @description: A set of functions called "actions" of the `sitemap` plugin.
 */

export default {
  getSettings: async (ctx) => {
    const config = await getPluginService('settings').getConfig();

    ctx.send(config);
  },

  updateSettings: async (ctx) => {
    const settings = await getPluginService('settings').getConfig();
    settings.sitemaps[ctx.params.id] = ctx.request.body;

    await pluginStore.set({ key: 'settings', value: settings });
    ctx.send({ ok: true });
  },

  deleteSitemap: async (ctx) => {
    const { id } = ctx.params;

    const settings = await getPluginService('settings').getConfig();
    delete settings.sitemaps[id];
    await pluginStore.set({ key: 'settings', value: settings });

    ctx.send('Sitemap was successfully deleted');
  },

  createNewSitemap: async (ctx) => {
    const { name } = ctx.request.body;
    const settings = await getPluginService('settings').getConfig();

    const isAvailable = !Object.keys(settings.sitemaps).includes(name);

    if (!isAvailable) {
      ctx.throw(400, 'Sitemap name is already in use');
    }

    settings.sitemaps[name] = {
      hostname: '',
      includeHomepage: true,
      excludeDrafts: true,
      defaultLanguageUrlType: '',
      defaultLanguageUrl: '',
      hostname_overrides: {},
      contentTypes: Map({}),
      customEntries: Map({}),
    };

    await pluginStore.set({ key: 'settings', value: settings });
    ctx.send({ ok: true });
  },
};
