'use strict';

export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'core.buildSitemap',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/info',
      handler: 'core.info',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/settings',
      handler: 'settings.updateSettings',
      config: {
        policies: [],
      },
    },
  ],
};
