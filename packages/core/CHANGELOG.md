# core

## 1.4.4

### Patch Changes

- [#292](https://github.com/pluginpal/strapi-webtools/pull/292) [`2456afc`](https://github.com/pluginpal/strapi-webtools/commit/2456afc9f2359b32b26a2067dabf2158579bf477) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: duplicate forward slash removal

- [#287](https://github.com/pluginpal/strapi-webtools/pull/287) [`b917017`](https://github.com/pluginpal/strapi-webtools/commit/b9170170316d6e5dd93580aaa67ce4587338be52) Thanks [@jorrit](https://github.com/jorrit)! - Fixes several Typescript issues and adds lint check

- [#292](https://github.com/pluginpal/strapi-webtools/pull/292) [`49f6fb0`](https://github.com/pluginpal/strapi-webtools/commit/49f6fb0bb631ddcfebf1bf7738957eab462e5a80) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: actually slugify relational fields in the pattern

## 1.4.3

### Patch Changes

- [#276](https://github.com/pluginpal/strapi-webtools/pull/276) [`56de963`](https://github.com/pluginpal/strapi-webtools/commit/56de9638c15032a622e3affee4b00e55e92779ea) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: response structure for cloned content to prevent issues

- [#277](https://github.com/pluginpal/strapi-webtools/pull/277) [`7171604`](https://github.com/pluginpal/strapi-webtools/commit/7171604a970295ca50416fb62bcd05f7e7f089fd) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: pass the locale to the URL alias update request to prevent issues

## 1.4.2

### Patch Changes

- [#262](https://github.com/pluginpal/strapi-webtools/pull/262) [`9be555a`](https://github.com/pluginpal/strapi-webtools/commit/9be555a65e8eb7c5291c0210ce58115a847d3297) Thanks [@jorrit](https://github.com/jorrit)! - fix: simplify scripts by adding devDependencies

- [`534bace`](https://github.com/pluginpal/strapi-webtools/commit/534baceb172de0cf3a53228e292f3444cce48594) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: remove test title in URL alias modal

## 1.4.1

### Patch Changes

- [#253](https://github.com/pluginpal/strapi-webtools/pull/253) [`59c059c`](https://github.com/pluginpal/strapi-webtools/commit/59c059ce78586d64c0e3c2e912dfab73e5ef0b1a) Thanks [@boazpoolman](https://github.com/boazpoolman)! - docs: update the install command in the readme

## 1.4.0

### Minor Changes

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`6d4669f`](https://github.com/pluginpal/strapi-webtools/commit/6d4669f8709f6e6f30883f679062ba50801fab02) Thanks [@boazpoolman](https://github.com/boazpoolman)! - feat: show the pattern languages in the patterns list

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`38ba66c`](https://github.com/pluginpal/strapi-webtools/commit/38ba66c7747f80caecef7ea97cc4a2157bbff4ae) Thanks [@boazpoolman](https://github.com/boazpoolman)! - feat: create a custom side panel for all Webtools related links

### Patch Changes

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`486cf5c`](https://github.com/pluginpal/strapi-webtools/commit/486cf5cc8cd722077ecbae35d2279cf54f668145) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: use generic design-system 'rc' version constraint

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`2b74f3a`](https://github.com/pluginpal/strapi-webtools/commit/2b74f3aa1f05c88671eddc7595e33c15901f6bc6) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: show the content type displayName instead of globalId

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`9f3c9ad`](https://github.com/pluginpal/strapi-webtools/commit/9f3c9adfefcbaa95cabeabfb358b4c7e51e03b24) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: allow & test for node 22

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`213dac9`](https://github.com/pluginpal/strapi-webtools/commit/213dac9dae03a6b5832e069dc5602e09b21a2244) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: add some spacing between the table row actions

- [#248](https://github.com/pluginpal/strapi-webtools/pull/248) [`d659485`](https://github.com/pluginpal/strapi-webtools/commit/d6594854035df8d88856dd3493c45b6ccf90ef0a) Thanks [@boazpoolman](https://github.com/boazpoolman)! - feat: give more feedback about the enabled content types, and add links to the documentation in case no content types have been enabled

## 1.3.1

### Patch Changes

- [`4d8c704`](https://github.com/pluginpal/strapi-webtools/commit/4d8c704a0f25154e38dcca3fa4c2aff7f606e532) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: prevent packup from bundling the 'qs' package by listing it as a dependency

- [`4904ac1`](https://github.com/pluginpal/strapi-webtools/commit/4904ac1c49e96c7c61b71ea5a5c76ced8977da35) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: updated logic for removing the url_alias field from the edit form

## 1.3.0

### Minor Changes

- [#243](https://github.com/pluginpal/strapi-webtools/pull/243) [`6787412`](https://github.com/pluginpal/strapi-webtools/commit/6787412add7e68cabae8c89e2b8177f909a539bb) Thanks [@boazpoolman](https://github.com/boazpoolman)! - feat: introduce a new rbac permission 'overview'

### Patch Changes

- [#243](https://github.com/pluginpal/strapi-webtools/pull/243) [`b36a457`](https://github.com/pluginpal/strapi-webtools/commit/b36a457fb57b2bb8a365030cc7d42863de270f6f) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: use RBAC hook instead of <Page.Protect> for the permission check of the sidebar view

- [#240](https://github.com/pluginpal/strapi-webtools/pull/240) [`9d4d596`](https://github.com/pluginpal/strapi-webtools/commit/9d4d596b61b89c7d001f1c633ef44aa111de9130) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: incorrect 'modified' status by preventing the updated_at value to be changed when linking the url_alias relation

- [#241](https://github.com/pluginpal/strapi-webtools/pull/241) [`bb50837`](https://github.com/pluginpal/strapi-webtools/commit/bb5083711732f7e0aa54fb82e6286f2eb1e67b6a) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: prevent unnecessary network requests for content types that have Webtools disabled

- [#244](https://github.com/pluginpal/strapi-webtools/pull/244) [`2b1d22e`](https://github.com/pluginpal/strapi-webtools/commit/2b1d22ee1233dc49ac4706b4d42bcde497cdb5b4) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: make the locale filter actually work by rewriting the URL params

- [#243](https://github.com/pluginpal/strapi-webtools/pull/243) [`acf283c`](https://github.com/pluginpal/strapi-webtools/commit/acf283c0476eb5d38a49c0518c79f7d7ddd9d892) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: cleanup rbac permission usage

- [#244](https://github.com/pluginpal/strapi-webtools/pull/244) [`d2f52ac`](https://github.com/pluginpal/strapi-webtools/commit/d2f52acecca7a9766a982e74409086827352eb16) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: make sure the edit URL respects the alias locale

- [#243](https://github.com/pluginpal/strapi-webtools/pull/243) [`ed9dea9`](https://github.com/pluginpal/strapi-webtools/commit/ed9dea99ec363f094c147d1bc8a98b5bf0e05568) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: prevent the whole form from being removed when a user doesn't have url_alias permissions

- [#244](https://github.com/pluginpal/strapi-webtools/pull/244) [`ad1bb85`](https://github.com/pluginpal/strapi-webtools/commit/ad1bb852675ca8532da670e53fb91950bf780f04) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: actually return the localized entity in the router endpoint

## 1.2.0

### Minor Changes

- [#231](https://github.com/pluginpal/strapi-webtools/pull/231) [`196ad05`](https://github.com/pluginpal/strapi-webtools/commit/196ad056e772c30647dafde660765da8f47b1e9b) Thanks [@boazpoolman](https://github.com/boazpoolman)! - feat: enhance the URL alias overview (locale filters & locale and contenttype in the table)

### Patch Changes

- [#231](https://github.com/pluginpal/strapi-webtools/pull/231) [`bb3b4df`](https://github.com/pluginpal/strapi-webtools/commit/bb3b4dffb5ce60b40132cc38ba8e0da2bda09697) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: make sure the 'path' parameter from the router endoint doesn't end up on the document service query params

- [#231](https://github.com/pluginpal/strapi-webtools/pull/231) [`454584d`](https://github.com/pluginpal/strapi-webtools/commit/454584db45d4f6e77da90ea3665a5f0f0f7b5e19) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: make the header button(s) smaller to align with the rest of the admin panel

- [#233](https://github.com/pluginpal/strapi-webtools/pull/233) [`d1e769d`](https://github.com/pluginpal/strapi-webtools/commit/d1e769d7e396c26c4679ba10ec255a39acae2ab4) Thanks [@boazpoolman](https://github.com/boazpoolman)! - docs: update the README and package.json with the latest information

- [#231](https://github.com/pluginpal/strapi-webtools/pull/231) [`73128f9`](https://github.com/pluginpal/strapi-webtools/commit/73128f91057d985105c4386ab40f2fe478802ac6) Thanks [@boazpoolman](https://github.com/boazpoolman)! - fix: issue with pagination when simulteously using the filter options

## 1.1.0

### Minor Changes

- [#230](https://github.com/pluginpal/strapi-webtools/pull/230) [`9b0ecdb`](https://github.com/pluginpal/strapi-webtools/commit/9b0ecdb4a88f6b837e78bca437662d5724809da2) Thanks [@boazpoolman](https://github.com/boazpoolman)! - New config 'slugify' to overwrite the slugify function of the plugin

## 1.0.1

### Patch Changes

- [#217](https://github.com/pluginpal/strapi-webtools/pull/217) [`36bf8d3`](https://github.com/pluginpal/strapi-webtools/commit/36bf8d38ebd90556a0db5941f62469d0672b67c9) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Fix incorrect duplication prevention for content types without internationalization

## 1.0.0

### Major Changes

- [#204](https://github.com/pluginpal/strapi-webtools/pull/204) [`a70cb10`](https://github.com/pluginpal/strapi-webtools/commit/a70cb106bdf783c2a0f0038bb0165dc0646ffb55) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Strapi 5 support

## 1.0.0-beta.15

### Patch Changes

- [#199](https://github.com/pluginpal/strapi-webtools/pull/199) [`65fdc7f`](https://github.com/pluginpal/strapi-webtools/commit/65fdc7fbf510f7810ecee509902acfffa445aa77) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Issue in the router endpoint when querying a single type which does not have localizations enabled.

- [#197](https://github.com/pluginpal/strapi-webtools/pull/197) [`faec872`](https://github.com/pluginpal/strapi-webtools/commit/faec87287907ef5acd9ad0b12b728212fa823adf) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Update the README files to reference the docs website

## 1.0.0-beta.14

### Patch Changes

- [#163](https://github.com/pluginpal/strapi-webtools/pull/163) [`77c41b1`](https://github.com/pluginpal/strapi-webtools/commit/77c41b1ff6bb5c4d49ca2240ae72082560b19bf0) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Shrink the bundle size by a factor of 10 :rocket:

- [#188](https://github.com/pluginpal/strapi-webtools/pull/188) [`801f859`](https://github.com/pluginpal/strapi-webtools/commit/801f859c16abb8c4000e744ee4d3cf68d59c2cab) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Prevent deadlocks from happening by using the native deleteMany service

- [#187](https://github.com/pluginpal/strapi-webtools/pull/187) [`bcbbc3e`](https://github.com/pluginpal/strapi-webtools/commit/bcbbc3e68ac3ee270172656f5c427c7ffe4a34ba) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Update all the URL alias localizations on update/create/clone in the query layer decorator

## 1.0.0-beta.13

### Minor Changes

- [#147](https://github.com/pluginpal/strapi-webtools/pull/147) [`e5c0587`](https://github.com/pluginpal/strapi-webtools/commit/e5c058758087c9d878ab7f40466672b340731e99) Thanks [@MSACC](https://github.com/MSACC)! - Extended query decorator functionality to handle deleteMany (#140) and clone (#138)

## 1.0.0-beta.12

### Minor Changes

- [#154](https://github.com/pluginpal/strapi-webtools/pull/154) [`60b5eff`](https://github.com/pluginpal/strapi-webtools/commit/60b5eff18795afd173a57380a87767fc29d06b3d) Thanks [@TMSchipper](https://github.com/TMSchipper)! - Fix issue with not loading url patterns when there is an empty array

- [#151](https://github.com/pluginpal/strapi-webtools/pull/151) [`d620caa`](https://github.com/pluginpal/strapi-webtools/commit/d620caa4d42b409e87fd604d88e99d23ac6e985a) Thanks [@SalahAdDin](https://github.com/SalahAdDin)! - Adding spanish and turkish translations

## 1.0.0-beta.11

### Minor Changes

- [#142](https://github.com/pluginpal/strapi-webtools/pull/142) [`ff7cb45`](https://github.com/pluginpal/strapi-webtools/commit/ff7cb457cd292f6b1ff938adf655c678e1cb446d) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Multilinguality for patterns and aliases using the @strapi/plugin-i18n package

- [#139](https://github.com/pluginpal/strapi-webtools/pull/139) [`ff0851a`](https://github.com/pluginpal/strapi-webtools/commit/ff0851a7a335ff8c0d79428f7b209c5675546bea) Thanks [@boazpoolman](https://github.com/boazpoolman)! - URL alias content management enhancements. Possibility for searching, filtering, deleting and manual generation

- [#142](https://github.com/pluginpal/strapi-webtools/pull/142) [`c99b57e`](https://github.com/pluginpal/strapi-webtools/commit/c99b57eee5910e9a49534980f678cdc4c0b14471) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Add a main menu item for all the admin pages of Webtools

- [#145](https://github.com/pluginpal/strapi-webtools/pull/145) [`05ae3ca`](https://github.com/pluginpal/strapi-webtools/commit/05ae3ca82ac1f2eb7c825852b0d24408daf1b501) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Core injections zones for adding links to the sidebar menu and adding routes

### Patch Changes

- [`49fe9bc`](https://github.com/pluginpal/strapi-webtools/commit/49fe9bc05fc2799735e92a76dd8639982aa04680) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Remove the creator fields middleware as we can do without

- Updated dependencies [[`4fd5602`](https://github.com/pluginpal/strapi-webtools/commit/4fd56026d262e4f0a30cf5ab8274d916d29aadd6)]:
  - @pluginpal/webtools-helper-plugin@1.0.0-beta.4

## 1.0.0-beta.10

### Patch Changes

- [`a48cc8c`](https://github.com/pluginpal/strapi-webtools/commit/a48cc8cc2fb4a02e74418c0ad326c44ad5c97a65) Thanks [@boazpoolman](https://github.com/boazpoolman)! - Fix an issue with the update decorator service

## 1.0.0-beta.9

### Minor Changes

- [#133](https://github.com/pluginpal/strapi-webtools/pull/133) [`cb59eb7`](https://github.com/pluginpal/strapi-webtools/commit/cb59eb78ef7d45d7c3c07ec7350747b6bc611b27) Thanks [@TMSchipper](https://github.com/TMSchipper)! - The "Populate Creator Fields" plugin enhances the functionality of your Strapi project by allowing you to populate

### Patch Changes

- [#133](https://github.com/pluginpal/strapi-webtools/pull/133) [`9b81da2`](https://github.com/pluginpal/strapi-webtools/commit/9b81da214ec8a1aa3f42d2d4eadaa30688ff4fe7) Thanks [@TMSchipper](https://github.com/TMSchipper)! - Fix an error that occurs when there is no pattern and the default should've been used

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
