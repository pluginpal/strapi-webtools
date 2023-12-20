# @pluginpal/webtools-core

## 1.0.0-beta.4

### Patch Changes

- 239af0a: Use Strapi native factories for url-alias controllers & services

## 1.0.0-beta.3

### Patch Changes

- 401bfcd: Rename API endpoint /webtools/url-alias/all to /webtools/url-alias

## 1.0.0-beta.2

### Patch Changes

- d37fb75: Updated react peer-dependency range to allow ^17 || ^18

## 1.0.0-beta.1

### Major Changes

- 01b242c: Beta release! :tada:

  **Migration**
  Refer to the migration guide when updating from `alpha` to `beta`.

  **Changes**

  - The plugin was renamed from 'URL alias' to 'Webtools'
  - The API endpoints got renamed as well
  - Refactored the repository into a monorepo
  - Native relations (#43)
  - Give API permissions to the public UP role by default (#22)

  **Chores**

  - Better automated testing
  - Stricter linting rules

### Patch Changes

- b9d7aa6: Updated `transformResponse` strategy for usage with Strapi 4.15
- Updated dependencies [e7d270c]
  - @pluginpal/webtools-helper-plugin@1.0.0-beta.1
