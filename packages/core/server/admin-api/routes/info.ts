

export default [
  {
    method: 'GET',
    path: '/info/getContentTypes',
    handler: 'info.getContentTypes',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/info/addons',
    handler: 'info.getAddons',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/info/config',
    handler: 'info.getConfig',
    config: {
      policies: [],
    },
  },
];
