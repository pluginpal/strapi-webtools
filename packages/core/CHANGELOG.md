# core

## 1.0.0-beta.8

### Minor Changes

- [#131](https://github.com/pluginpal/strapi-webtools/pull/131) [`1f01462`](https://github.com/pluginpal/strapi-webtools/commit/1f01462d4bcabd65772eb9733d76746834d9e508) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Relational URL patterns

### Patch Changes

- [#126](https://github.com/pluginpal/strapi-webtools/pull/126) [`905ff2e`](https://github.com/pluginpal/strapi-webtools/commit/905ff2ea322aa1a21b836e76fb6f095de660c430) Thanks [@Alexnortung](https://github.com/Alexnortung)! - Url paths created for a collection type, that is then disabled, will now be deleted

## 1.0.0-beta.7

### Patch Changes

- [#119](https://github.com/pluginpal/strapi-webtools/pull/119) [`fae4c75`](https://github.com/pluginpal/strapi-webtools/commit/fae4c75d7fb67ab9cc60d5b8a48d4f136b24e128) Thanks [@Alexnortung](https://github.com/Alexnortung)! - Duplicate check will use an ignore id so that it does not update the url path because it is a duplicate of itself

## 1.0.0-beta.6

### Minor Changes

- [#112](https://github.com/pluginpal/strapi-webtools/pull/112) [`816f4db`](https://github.com/pluginpal/strapi-webtools/commit/816f4db1577a576438d048d5e244d19a17035e57) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Check for 'find' permissions of a content-type in the router controller. Return a 403 when the user has insufficient rights.

- [#117](https://github.com/pluginpal/strapi-webtools/pull/117) [`3aba7ed`](https://github.com/pluginpal/strapi-webtools/commit/3aba7ed6b814e2588f3403b5f8884f9e90ac7b34) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Added an extra admin permission to grant/revoke acces to the URL alias sidebar (#55)

### Patch Changes

- [#115](https://github.com/pluginpal/strapi-webtools/pull/115) [`6d2ee80`](https://github.com/pluginpal/strapi-webtools/commit/6d2ee80506aa3df8d0bc6ceb5031bc79cd253e8d) Thanks [@Alexnortung](https://github.com/Alexnortung)! - Will no longer fail when trying to generate a path that initially already exists.

- [#103](https://github.com/pluginpal/strapi-webtools/pull/103) [`6a6fb9d`](https://github.com/pluginpal/strapi-webtools/commit/6a6fb9d0a58c8cf9d1ed159c11b6a197ec3de916) Thanks [@Alexnortung](https://github.com/Alexnortung)! - The migration script will now handle migrating the entries, instead of doing this while strapi is running

- [#118](https://github.com/pluginpal/strapi-webtools/pull/118) [`a628383`](https://github.com/pluginpal/strapi-webtools/commit/a628383adf5aa0640c97e7379af1a2dd308e80fb) Thanks [@TMSchipper](https://github.com/TMSchipper)! - Added default value for url_pattern

- [#118](https://github.com/pluginpal/strapi-webtools/pull/118) [`426b4ae`](https://github.com/pluginpal/strapi-webtools/commit/426b4aee9a80f080cd3ba2627360eb5b23230c88) Thanks [@TMSchipper](https://github.com/TMSchipper)! - Make pluralName allowed in url pattern

- [#113](https://github.com/pluginpal/strapi-webtools/pull/113) [`5da6433`](https://github.com/pluginpal/strapi-webtools/commit/5da643305f62a2a2cd6d56a9ffa9885a3d2d9a02) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Fix bug in the query-layer-decorator to allow updates to entities without an URL alias (#105)

- Updated dependencies [[`095c92c`](https://github.com/pluginpal/strapi-webtools/commit/095c92cd4c2cb98bb3cb6b6e51d75a8a3f7efe0e)]:
  - @pluginpal/webtools-helper-plugin@1.0.0-beta.3

## 1.0.0-beta.5

### Patch Changes

- 0b32de2: Fix issue with path generation (#96)
- feb9d87: Removed redundant files from the npm builds
- d7be9d5: Remove strapi-typed from the devDependencies
- e5ba503: Add an MIT license file
- dee1907: Fix issue with the admin translations
- Updated dependencies [e5ba503]
  - @pluginpal/webtools-helper-plugin@1.0.0-beta.2

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
