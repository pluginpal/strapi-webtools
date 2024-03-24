

export default [
  {
    method: 'GET',
    path: '/router',
    handler: 'core.router',
    config: {
      policies: [],
      find: {
        middlewares: ['api::page.default-populate'],
      },
      findOne: {
        middlewares: ['api::page.default-populate'],
      },
    },
  },
];
