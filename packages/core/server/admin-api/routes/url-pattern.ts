

export default [
  {
    method: 'GET',
    path: '/url-pattern/findOne/:id',
    handler: 'url-pattern.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-pattern/findMany',
    handler: 'url-pattern.findMany',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-pattern/delete/:id',
    handler: 'url-pattern.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/url-pattern/update/:id',
    handler: 'url-pattern.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/url-pattern/create',
    handler: 'url-pattern.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-pattern/allowed-fields',
    handler: 'url-pattern.allowedFields',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/url-pattern/validate',
    handler: 'url-pattern.validatePattern',
    config: {
      policies: [],
    },
  },
];
