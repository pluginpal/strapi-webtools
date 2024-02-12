'use strict';
import { Strapi } from '@strapi/strapi';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    // Seed the database with some test data for the integration tests.
    if (process.env.NODE_ENV === 'test') {
      // Give the public role some permissions to test with
      const roles = await strapi
        .service('plugin::users-permissions.role')
        .find();

      const publicId = roles.filter((role) => role.type === 'public')[0]?.id;

      if (publicId) {
        const publicRole = await strapi
          .service('plugin::users-permissions.role')
          .findOne(publicId);

        publicRole.permissions['plugin::webtools'] = {
          controllers: {
            core: {
              router: { enabled: true },
            },
            'url-alias': {
              find: { enabled: true },
            },
          },
        };

        publicRole.permissions['api::test'] = {
          controllers: {
            test: {
              find: { enabled: true },
            },
          },
        };

        publicRole.permissions['api::category'] = {
          controllers: {
            category: {
              find: { enabled: true },
            },
          },
        };

        await strapi
          .service('plugin::users-permissions.role')
          .updateRole(publicRole.id, publicRole);
      }

      await strapi.entityService.create('plugin::webtools.url-pattern', {
        data: {
          pattern: '/page/[title]',
          label: 'Test API pattern',
          code: 'test_api_pattern',
          contenttype: 'api::test.test',
          languages: [],
        }
      });

      await strapi.entityService.create('plugin::webtools.url-pattern', {
        data: {
          pattern: '/category/[title]',
          label: 'Category API pattern',
          code: 'category_api_pattern',
          contenttype: 'api::category.category',
          languages: [],
        }
      });

      await strapi.entityService.create('plugin::webtools.url-pattern', {
        data: {
          pattern: '/private-category/[title]',
          label: 'Private category API pattern',
          code: 'private_category_api_pattern',
          contenttype: 'api::private-category.private-category',
          languages: [],
        }
      });

      const privateCategory = await strapi.entityService.create('api::private-category.private-category', {
        data: {
          title: 'Published',
          publishedAt: new Date(),
        }
      });

      const publishedCategory = await strapi.entityService.create('api::category.category', {
        data: {
          title: 'Published category',
          publishedAt: new Date(),
        }
      });

      const unpublishedCategory = await strapi.entityService.create('api::category.category', {
        data: {
          title: 'Unpublished category',
        }
      });

      await strapi.entityService.create('api::test.test', {
        data: {
          title: 'Published test page',
          publishedAt: new Date(),
          category: unpublishedCategory.id,
          private_category: privateCategory.id,
        }
      });

      await strapi.entityService.create('api::test.test', {
        data: {
          title: 'Unpublished test page',
          category: publishedCategory.id,
        }
      });
    }
  },
};
