

export default [
  {
    method: 'GET',
    path: '/url-alias',
    handler: 'url-alias.find',
    config: {
      policies: [],
      auth: false,
    },
  },
];
