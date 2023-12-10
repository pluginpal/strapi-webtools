
<h1>Migration guides</h1>

## From alpha.11 to beta.1

Starting with beta, the plugin will be renamed to `@strapi-webtools/core`.

### Migration steps

The following manual steps will have to be done when migrating.

##### 1. Updated API URLs

Because of the rename the URLs of the public API of the plugin have changed also.
In you're frontend you'll have to update the code to reflect that change.

###### From
```
/api/url-alias/get // Fetches a page, based on a URL alias.
/api/url-alias/all // Fetches all URL aliases.
```

###### To
```
/api/webtools/router
/api/webtools/url-alias
```

##### 2. Query responses

Prior to beta.1, the plugin would alter query responses by adding a field called `url_path`. Starting beta.1 that field will be replacd with the `url_alias` field, which is a native relations field. Meaning that if you wish to fetch it's response in a query, you'll have to use `populate` to include it in the response.

##### 3. Database migrations

You'll start the database migration locally by stopping your Strapi app. If it wasn't running, you can just continue to step 4.

##### 4. Database schema migration

To trigger the schema migrations we utilize Strapi [database migrations](https://docs.strapi.io/dev-docs/database-migrations). The plugin provides the migration file needed. You just need to copy [the migration file](https://github.com/strapi-community/strapi-plugin-url-alias/blob/master/migrations/2023.06.12T00.00.00.url-alias-to-webtools.js) and place it in the `./database/migrations` folder of your Strapi app.

##### 5. Update the package

Updating the package will go in two steps:

1. `yarn remove @strapi-community/strapi-plugin-url-alias`
2. `yarn add @strapi-webtools/core`

##### 6. Build Strapi

Build Strapi by running the following command

- `yarn build`

##### 7. Start Strapi

When starting Strapi, the migrations will automatically trigger and preserve all the data about URL alias you had previously stored in the database.

## From alpha.9 (or 10) to alpha.11

Url alias will be disabled by default for all content types. Make sure to enable it **before** updating to `1.0.0-alpha.11`. 

### Migration steps

The following manual steps will have to be done when migrating.

You have to options to do this:

##### 1. Through the admin panel

Go to the admin panel -> content type builder. Now select the content types you want url alias enabled for and click Edit -> Advanced settings -> Url alias. This will enable url alias for that specific content type.

##### 1. Through the schema.json files

Update the content type schema files `schema.json` in your code that you want url alias enabled for and add the following:

```jsonc
{
  // ...
  "pluginOptions": {
    "url-alias": {
      "enabled": true
    }
  }
  // ...
}
```
