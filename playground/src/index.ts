import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
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

      await strapi.documents('plugin::i18n.locale').create({
        data: {
          code: 'nl',
          name: 'Dutch (nl)',
        },
      });

      await strapi.documents('plugin::webtools.url-pattern').create({
        data: {
          pattern: '/page/[title]',
          label: 'Test API pattern',
          code: 'test_api_pattern',
          contenttype: 'api::test.test',
          languages: ['en', 'nl'],
        },
      });

      await strapi.documents('plugin::webtools.url-pattern').create({
        data: {
          pattern: '/category/[title]',
          label: 'Category API pattern',
          code: 'category_api_pattern',
          contenttype: 'api::category.category',
          languages: [],
        },
      });

      await strapi.documents('plugin::webtools.url-pattern').create({
        data: {
          pattern: '/private-category/[title]',
          label: 'Private category API pattern',
          code: 'private_category_api_pattern',
          contenttype: 'api::private-category.private-category',
          languages: [],
        },
      });

      const privateCategory = await strapi.documents('api::private-category.private-category').create({
        data: {
          title: 'Published',
        },
        status: 'published',
      });

      const publishedCategory = await strapi.documents('api::category.category').create({
        data: {
          title: 'Published category',
        },
        status: 'published',
        populate: '*',
      });

      const unpublishedCategory = await strapi.documents('api::category.category').create({
        data: {
          title: 'Unpublished category',
        },
      });

      await strapi.documents('api::test.test').create({
        data: {
          title: 'Published test page',
          category: unpublishedCategory.documentId,
          private_category: privateCategory.documentId,
        },
        status: 'published',
        populate: '*',
      });

      await strapi.documents('api::test.test').create({
        data: {
          title: 'Unpublished test page',
          category: publishedCategory.documentId,
        },
      });
    }
  },
};
