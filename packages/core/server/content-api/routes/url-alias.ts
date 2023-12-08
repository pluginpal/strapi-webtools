

export default [
  {
    method: 'GET',
    path: '/url-alias/all',
    handler: 'url-alias.find',
    config: {
      policies: [],
    },
  },
];
