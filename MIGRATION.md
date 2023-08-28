## Migration guides

### From `<= 1.0.0-alpha.10`

Url alias will be disabled by default for all content types. Make sure to enable it for the content types you need url alias enabled for.

You have to options to do this:

#### Option 1

Stay in version `1.0.0-alpha.10` and run the development server. Go to the admin panel -> content type builder. Now select the content types you want url alias enabled for and click Edit -> Advanced settings -> Url alias. This will enable url alias for that specific content type.

#### Options 2

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
