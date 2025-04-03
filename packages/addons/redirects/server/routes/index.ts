export default {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/webtools/redirects',
        handler: 'redirect.find',
        config: {
          policies: [],
          prefix: '',
        },
      },
    ],
  },
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/webtools/redirects',
        handler: 'redirect.find',
        config: {
          policies: [],
          prefix: '',
        },
      },
      {
        method: 'GET',
        path: '/webtools/redirects/config',
        handler: 'redirect.config',
        config: {
          policies: [],
          prefix: '',

        },
      },
      {
        method: 'GET',
        path: '/webtools/redirects/:id',
        handler: 'redirect.findOne',
        config: {
          policies: [],
          prefix: '',

        },
      },
      {
        method: 'DELETE',
        path: '/webtools/redirects/:id',
        handler: 'redirect.delete',
        config: {
          policies: [],
          prefix: '',

        },
      },
      {
        method: 'PUT',
        path: '/webtools/redirects/:id',
        handler: 'redirect.update',
        config: {
          policies: [],
          prefix: '',

        },
      },
      {
        method: 'POST',
        path: '/webtools/redirects',
        handler: 'redirect.create',
        config: {
          policies: [],
          prefix: '',

        },
      },
    ],
  },
};
