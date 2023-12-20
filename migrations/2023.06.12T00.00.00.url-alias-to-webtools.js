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
    knex.schema.hasTable('url_paths').then((exists) => {
      if (!exists) {
        knex.schema.renameTable('url_paths', 'wt_url_alias');
      }
    });

    // Rename the url_patterns table.
    knex.schema.hasTable('url_patterns').then((exists) => {
      if (!exists) {
        knex.schema.renameTable('url_patterns', 'wt_url_patterns');
      }
    });
  },
};
