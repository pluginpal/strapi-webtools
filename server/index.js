'use strict';

// Admin API
const adminApiPathSchema = require('./admin-api/content-types/path/schema.json');
const adminApiBootstrap = require('./admin-api/bootstrap');
const adminApiRegister = require('./admin-api/register');

module.exports = {
  bootstrap: async () => {
    await adminApiBootstrap();
  },
  register: async ({ strapi }) => {
    await adminApiRegister(strapi);
  },
  contentTypes: {
    path: {
      schema: adminApiPathSchema,
    },
  },
};
