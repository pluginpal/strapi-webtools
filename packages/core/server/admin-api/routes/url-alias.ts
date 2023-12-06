

export default [
  {
    method: 'GET',
    path: '/url-alias/findOne/:id',
    handler: 'url-alias.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-alias/findMany',
    handler: 'url-alias.findMany',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-alias/delete/:id',
    handler: 'url-alias.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/url-alias/update/:id',
    handler: 'url-alias.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/url-alias/create',
    handler: 'url-alias.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-alias/editLink',
    handler: 'url-alias.editLink',
    config: {
      policies: [],
    },
  },
];
