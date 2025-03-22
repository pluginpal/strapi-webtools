'use strict';

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
    await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .set({ key: 'settings', value: ctx.request.body });

    ctx.send({ ok: true });
  },
};
