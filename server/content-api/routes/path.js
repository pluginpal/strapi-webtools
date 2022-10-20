'use strict';

module.exports = [
  // Hack, placeholder for generate correct permissions (https://github.com/strapi-community/strapi-plugin-url-alias/issues/22)
  {
    method: "GET",
    path: "/find",
    handler: "path.find",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/get",
    handler: "byPath.get",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/all",
    handler: "byPath.all",
    config: {
      policies: [],
    },
  },
];
