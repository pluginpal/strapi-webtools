export default {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/url-alias',
        handler: 'url-alias.find',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/url-alias/:id',
        handler: 'url-alias.findOne',
        config: {
          policies: [],
        },
      },
      {
        method: 'DELETE',
        path: '/url-alias/:id',
        handler: 'url-alias.delete',
        config: {
          policies: [],
        },
      },
      {
        method: 'PUT',
        path: '/url-alias/:id',
        handler: 'url-alias.update',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/url-alias',
        handler: 'url-alias.create',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/router',
        handler: 'router.findOne',
        config: {
          policies: [],
        },
      },
    ],
  },
  admin: {
    type: 'admin',
    routes: [
      /**
       * URL Alias routes
       */
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
        handler: 'url-alias.find',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/url-alias/findFrom',
        handler: 'url-alias.findFrom',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
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
      {
        method: 'POST',
        path: '/url-alias/generate',
        handler: 'url-alias.generate',
        config: {
          policies: [],
        },
      },

      /**
       * Info routes
       */
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
        path: '/info/getLanguages',
        handler: 'info.getLanguages',
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

      /**
       * URL Pattern routes
       */
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
        handler: 'url-pattern.find',
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
      /**
       * Search routes
       */
      {
        method: 'GET',
        path: '/search',
        handler: 'search.search',
        config: {
          policies: [],
        },
      },
      /**
       * Reverse Search routes for a title or slug
       */
      {
        method: 'GET',
        path: '/search/reverse/:contentType/:documentId',
        handler: 'search.reverseSearch',
        config: {
          policies: [],
        },
      },
    ],
  },
};
