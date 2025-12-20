---
sidebar_label: 'Strapi v4 to v5'
displayed_sidebar: webtoolsSidebar
slug: /migration/strapi-v4-to-v5.md
---

# Strapi v4 to v5

When you use Webtools in Strapi v4 and you want to migrate to Strapi v5 you can follow this guide.

## New package names

For starters the package name has changed.

### Old package names

```md title="package.json"
{
  "dependencies": {
    "@pluginpal/webtools-core": "*",
    "@pluginpal/webtools-addon-sitemap": "*"
  }
}
```

### New package names

```md title="package.json"
{
  "dependencies": {
    "strapi-plugin-webtools": "*",
    "webtools-addon-sitemap": "*"
  }
}
```

## Schema change

The new Strapi v5 plugin for Webtools changes the URL alias relations from a `oneToOne` to a `oneToMany`. To run the native Strapi v5 migration scripts together with the Webtools update you have to add a manual migration script that handles the schema change.

```md title="database/migrations/add-url-alias-order-column.js"
module.exports = {
  async up(knex) {
    const tables = await knex('information_schema.tables')
      .select('table_name')
      .where('table_name', 'like', '%url_alias_links');

    for (const table of tables) {
      await knex.schema.hasColumn(table.table_name, 'url_alias_ord').then(async function(exists) {
        if (!exists) {
          await knex.schema.alterTable(table.table_name, (t) => {
            t.integer('url_alias_ord');
          });
        }
      });
    }
  },
};
```
