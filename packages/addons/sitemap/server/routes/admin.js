'use strict';

export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/build-sitemap/:id',
      handler: 'core.buildSitemap',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/info/:id',
      handler: 'core.info',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/create-new-sitemap',
      handler: 'settings.createNewSitemap',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: 'settings.deleteSitemap',
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
      path: '/settings/:id',
      handler: 'settings.updateSettings',
      config: {
        policies: [],
      },
    },
  ],
};
