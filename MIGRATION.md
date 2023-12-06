
<h1>Migration guides</h1>

## From 1.0.0-alpha.11 to 1.0.0-beta.1

Starting with beta, the plugin will be renamed to `@strapi-webtools/core`.

### Migration steps

The following manual steps will have to be done when migrating.

##### 1. Updated API URLs

Because of the rename the URLs of the public API of the plugin have changed also.
In you're frontend you'll have to update the code to reflect that change.

###### From
```
/api/url-alias/get
/api/url-alias/all
```

###### To
```
/api/webtools/get
/api/webtools/all
```

##### 2. Stop your Strapi app

You'll start the database migration locally by stopping your Strapi app. If it wasn't running you can just continue to step 2.

##### 3. Database schema migration

To trigger the schema migrations we utilize Strapi [database migrations](https://docs.strapi.io/dev-docs/database-migrations). The plugin provides the migration file needed. You just need to copy [the migration file](https://github.com/strapi-community/strapi-plugin-url-alias/blob/master/migrations/2023.06.12T00.00.00.url-alias-to-webtools.js) and place it in the `./database/migrations` folder of your Strapi app.

##### 4. Update the package

Updating the package will go in two steps:

1. `yarn remove @strapi-community/strapi-plugin-url-alias`
2. `yarn add @strapi-webtools/core`

##### 5. Build Strapi

Build Strapi by running the following command

- `yarn build`

##### 6. Start Strapi

When starting Strapi, the migrations will automatically trigger and preserve all the data about URL alias you had previously stored in the database.

##### 7. Data structure change

In the alpha versions, when you'd fetch an entry that had a URL alias, you would see that alias in the response. That field (`url_path`) would be injected through a query hook.

Starting from beta, this behavior will change as the URL alias becomes a native relation. Meaning you will have to use `populate` to get it in the response of a fetch query.

## From v1.0.0-alpha.9 (or alpha.10) to 1.0.0-alpha.11

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
