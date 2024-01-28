

export default [
  {
    method: 'GET',
    path: '/router',
    handler: 'core.router',
    config: {
      policies: [],
      auth: false,
    },
  },
];
