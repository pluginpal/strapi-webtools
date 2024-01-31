/**
 * The purpose of this migration file is to be used when migrating
 * the URL alias plugin from @alpha to @beta.
 *
 * It will rename the database tables of the plugin before the
 * Strapi auto-migration will. That way we can preserve the data that
 * was stored in these tables.
 *
 * @from @strapi-community/strapi-plugin-url-alias@alpha
 * @to @pluginpal/webtools-core@beta
 */
module.exports = {
  async up(
    /** @type {import('knex').Knex} */
    knex,
  ) {
    const contentTypes = {
      // TODO by the user: Check the schema.json files of your content types and fill in the correct values.
      // example:
      // 'api::page.page': {
      //   collectionName: 'pages',
      //   singularName: 'page',
      // },
    };
    // Rename the url_paths table.
    const hasUrlPathsTable = await knex.schema.hasTable('url_paths');
    if (hasUrlPathsTable) {
      const oldUrlPathsName = 'url_paths';
      const newUrlPathsName = 'wt_url_alias';
      console.log(`Renaming "${oldUrlPathsName}" table to "${newUrlPathsName}"...`);
      await knex.schema.renameTable(oldUrlPathsName, newUrlPathsName);
      console.log(`Renamed "${oldUrlPathsName}" table to "${newUrlPathsName}".`);

      // create link tables

      await Promise.all(
        Object.keys(contentTypes).map(async (contentType) => {
          const { collectionName, singularName } = contentTypes[contentType];
          const linkTableName = `${collectionName}_url_alias_links`;
          console.log('creating link table', linkTableName);
          await knex.schema.createTable(linkTableName, (table) => {
            table.increments('id');
            table.integer(`${singularName}_id`).unsigned();
            table.foreign(`${singularName}_id`).references('id').inTable(collectionName);
            table.integer('url_alias_id').unsigned();
            table.foreign('url_alias_id').references('id').inTable(newUrlPathsName);
          });

          console.log('migrating existing links for', contentType);
          const entries = await knex.from(collectionName).select('id', 'url_path_id').whereNotNull('url_path_id');

          if (!entries || entries.length <= 0) {
            console.log('no links found for', contentType);
            return;
          }
          const links = entries.map((entry) => ({
            [`${singularName}_id`]: entry.id,
            url_alias_id: entry.url_path_id,
          }));
          await knex(linkTableName).insert(links);
          console.log('migrated existing links for', contentType);
        }),
      );
    } else {
      console.log('No url_paths table found. Skipping...');
    }

    // Rename the url_patterns table.
    const hasUrlPatternsTable = await knex.schema.hasTable('url_patterns');
    if (hasUrlPatternsTable) {
      console.log('Renaming "url_patterns" table to "wt_url_patterns"...');
      await knex.schema.renameTable('url_patterns', 'wt_url_patterns');
      console.log('Renamed "url_patterns" table to "wt_url_patterns".');
    } else {
      console.log('No url_patterns table found. Skipping...');
    }
  },
};
