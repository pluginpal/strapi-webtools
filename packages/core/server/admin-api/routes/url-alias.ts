

export default [
  {
    method: 'GET',
    path: '/url-alias/findOne/:id',
    handler: 'url-alias-admin.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-alias/findMany',
    handler: 'url-alias-admin.findMany',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/url-alias/delete/:id',
    handler: 'url-alias-admin.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/url-alias/update/:id',
    handler: 'url-alias-admin.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/url-alias/create',
    handler: 'url-alias-admin.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/url-alias/editLink',
    handler: 'url-alias-admin.editLink',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/url-alias/generate',
    handler: 'url-alias-admin.generate',
    config: {
      policies: [],
    },
  },
];
