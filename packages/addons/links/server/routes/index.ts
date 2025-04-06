export default {
  'content-api': {
    type: 'content-api',
    routes: [],
  },
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/search',
        handler: 'search.index',
        config: {
          policies: [],
        },
      },
    ],
  },
};
