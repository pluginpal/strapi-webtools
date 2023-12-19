export default async (strapi) => {
  try {
    // Give the public role permissions to access the public API endpoints.
    if (strapi.plugin('users-permissions')) {
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

        await strapi
          .service('plugin::users-permissions.role')
          .updateRole(publicRole.id, publicRole);
      }
    }
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
