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
      // 'api::page-post.page-post': {
      //   collectionName: 'page_posts',
      //   // NOTE: The singularName should be snake_case, not kebab-case.
      //   singularName: 'page_post',
      // },
    };
    // In commit b14eb26f76b53a3a9ad91f050b04266224fc244d the paths table was renamed to url_paths
    const hasPathsTable = await knex.schema.hasTable('paths');
    if (hasPathsTable) {
      console.log('Renaming "paths" table to "url_paths"...');
      await knex.schema.renameTable('paths', 'url_paths');
      console.log('Renamed "paths" table to "url_paths".');
    }
    // Rename the url_paths table.
    const hasUrlPathsTable = await knex.schema.hasTable('url_paths');
    if (hasUrlPathsTable) {
      const oldUrlPathsName = 'url_paths';
      const newUrlPathsName = 'wt_url_alias';
      console.log(`Renaming "${oldUrlPathsName}" table to "${newUrlPathsName}"...`);
      await knex.schema.renameTable(oldUrlPathsName, newUrlPathsName);
      console.log(`Renamed "${oldUrlPathsName}" table to "${newUrlPathsName}".`);

      // Also migrate for commit db0dea6c521915ced354709b52d678ae436e62dd
      // which changed the path column to url_path
      const hasPathColumn = await knex.schema.hasColumn(newUrlPathsName, 'path');
      if (hasPathColumn) {
        console.log('Renaming "path" column to "url_path"...');
        await knex.schema.alterTable(newUrlPathsName, (table) => {
          table.renameColumn('path', 'url_path');
        });
        console.log('Renamed "path" column to "url_path".');
      }

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

    // In commit b14eb26f76b53a3a9ad91f050b04266224fc244d the patterns table was renamed to url_patterns
    const hasPatternsTable = await knex.schema.hasTable('patterns');
    if (hasPatternsTable) {
      console.log('Renaming "patterns" table to "url_patterns"...');
      await knex.schema.renameTable('patterns', 'url_patterns');
      console.log('Renamed "patterns" table to "url_patterns".');
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
