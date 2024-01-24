import { Schema, Strapi } from '@strapi/strapi';

const migrateToNativeRelation = async (strapi: Strapi) => {
  await Promise.all(
    Object.values(strapi.contentTypes).map(async (
      contentType: Schema.ContentType,
    ) => {
      const notMigrated = await strapi.db.getSchemaConnection().hasColumn(contentType.collectionName, 'url_path_id');

      // Return when the migration is allready finished.
      if (!notMigrated) {
        return;
      }

      // Find the pages that need migration.
      const pagesToBeMigrated = await strapi.entityService.findMany(contentType.uid, {
        // @ts-ignore
        fields: 'url_path_id',
        filters: {
          // @ts-ignore
          url_path_id: {
            $notNull: true,
          },
        },
      });

      // Migrate those fields.
      await Promise.all(pagesToBeMigrated.map(async (page) => {
        await strapi.entityService.update(contentType.uid, page.id, {
          data: {
            // @ts-ignore
            url_alias: Number(page.url_path_id),
            url_path_id: null,
          },
        });
      }));
    }),
  );

  // Log the migration in the database.
  await strapi.db
    .getConnection()
    .insert({
      name: 'to-native-relation',
      time: new Date(),
    })
    .into('strapi_migrations');
};

export default migrateToNativeRelation;
