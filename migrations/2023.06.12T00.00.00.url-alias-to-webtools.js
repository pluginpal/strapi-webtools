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
  async up(knex) {
    // Rename the url_paths table.
    const hasUrlPathsTable = await knex.schema.hasTable('url_paths');
    if (hasUrlPathsTable) {
      console.log('Renaming "url_paths" table to "wt_url_alias"...');
      await knex.schema.renameTable('url_paths', 'wt_url_alias');
      console.log('Renamed "url_paths" table to "wt_url_alias".');
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

