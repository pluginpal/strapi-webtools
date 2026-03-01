# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Strapi Webtools is a plugin for Strapi CMS v5 that provides URL management, routing, and an extensible addon system. It's a monorepo managed with Yarn workspaces and Turborepo, containing:

- **packages/core**: Main plugin (`strapi-plugin-webtools`)
- **packages/cli**: Installation CLI tool (`webtools-cli`)
- **packages/addons/sitemap**: Sitemap addon example
- **packages/docs**: Documentation site
- **playground**: Development Strapi instance for testing

## Development Setup

### Initial Setup

```bash
# Install root dependencies
yarn install

# Install playground dependencies (runs automatically via postinstall)
yarn playground:install
```

### Development Workflow

Development requires running **two terminal sessions**:

**Terminal 1 - Build the plugin in watch mode:**
```bash
yarn develop
```
This runs TypeScript compilation in watch mode across all packages and uses `yalc` to link them.

**Terminal 2 - Run the playground Strapi instance:**
```bash
yarn playground:develop
```
This starts Strapi at http://localhost:1337 with the plugin pre-installed.

Changes to the plugin code will rebuild automatically (Terminal 1) and hot-reload in the playground (Terminal 2).

### Building for Production

```bash
yarn build
```
Builds all packages using Turborepo's caching and dependency graph.

## Testing

### Unit Tests

```bash
# Run all unit tests
yarn test:unit

# Run unit tests in watch mode (add to jest command in package.json)
ENV_PATH=./playground/.env jest --watch
```

Unit tests are located in `__tests__` directories:
- `packages/core/server/middlewares/__tests__/`
- `packages/core/server/hooks/__tests__/`
- `packages/core/server/controllers/__tests__/`
- `packages/addons/sitemap/server/utils/__tests__/`

Uses Jest with ts-jest preset. Test files: `*.test.ts` or `*.test.js`

### Integration Tests

```bash
yarn test:integration
```
Runs healthcheck integration test against the playground instance.

### E2E Tests

```bash
yarn test:e2e
```
Opens Cypress test runner. E2E tests have `.cy.ts` or `.cy.tsx` extensions.

## Code Quality

### Linting

```bash
# Check all packages
yarn eslint

# Auto-fix issues
yarn eslint:fix

# Type checking (no emit)
yarn tscheck
```

Uses `@uncinc/eslint-config` with special overrides for Cypress and Jest files.

## Architecture Overview

### Core Plugin Structure

The plugin follows Strapi 5's plugin architecture with two entry points:

**Server-side** (`packages/core/server/index.ts`):
- `register()`: Registers services, controllers, routes, content types
- `bootstrap()`: Registers document middlewares and hooks
- `contentTypes`: Defines `url-alias` and `url-pattern` internal content types
- `routes`: Admin API and public Content API endpoints
- `services`: Business logic (url-alias, url-pattern, info)
- `middlewares`: Document lifecycle hooks for automatic URL generation
- `controllers`: Request handlers for API endpoints

**Admin-side** (`packages/core/admin/index.ts`):
- `register()`: Registers the plugin with Strapi Admin
- `bootstrap()`: Injects UI into Content Manager and Content-Type Builder
- `permissions`: RBAC permission definitions

### Key Architectural Concepts

#### 1. URL Aliases and Patterns

**URL Pattern** (`plugin::webtools.url-pattern`):
- Template that defines how URLs are generated for a content type
- Uses bracket syntax: `[fieldName]`, `[relation.field]`, `[pluralName]`, `[documentId]`
- Example: `/blog/[category.slug]/[title]` → `/blog/news/hello-world`
- Stored in database, managed via Admin UI

**URL Alias** (`plugin::webtools.url-alias`):
- The actual generated URL path for an entry
- Localized (supports i18n)
- Tracks whether it was generated or manually set (`generated` field)
- Automatically created/updated by middlewares

#### 2. Document Middleware Chain

Three middlewares hook into the Strapi 5 document lifecycle:

1. **generate-url-alias.ts**: Runs on create/update/clone
   - Fetches URL patterns for the content type
   - Resolves pattern templates using entry data
   - Creates/updates URL alias records
   - Respects manual URLs (`generated: false`)

2. **prevent-duplicate-urls.ts**: Ensures URL uniqueness
   - Appends numeric suffixes when conflicts exist (-1, -2, etc.)

3. **delete-url-alias.ts**: Cleans up on entry deletion

These run BEFORE/AFTER document operations using Strapi's document middleware API (not legacy entity service).

#### 3. Content Type Enablement

Content types opt into Webtools via `pluginOptions`:

```javascript
{
  "pluginOptions": {
    "webtools": { "enabled": true }
  }
}
```

When enabled:
- A `url_alias` relation field is injected at bootstrap
- Middlewares activate for that content type
- Admin UI shows the Webtools side panel in the content editor

#### 4. Addon System

Addons are Strapi plugins with a special flag in their `package.json`:

```json
{
  "strapi": {
    "webtoolsAddon": true
  }
}
```

**Discovery**: Core scans `enabledPlugins` at runtime for this flag

**Integration**: Addons inject components via named zones:
- `webtoolsRouter`: Adds routes to main navigation
- `webtoolsSidePanel`: Adds components to content editor sidebar

**Implementation**: Addons call:
```typescript
app.getPlugin('webtools').injectComponent(zone, type, { Component, ... })
```

Example: The Sitemap addon extends enabled content types with a `sitemap_exclude` field and adds UI to manage sitemaps.

#### 5. Services

Key services accessible via `getPluginService()`:

**url-alias**:
- `findByPath(path, locale?)`: Find entries by URL path
- `findRelatedEntity(path, locale?)`: Resolve URL to entity
- `makeUniquePath(uid, path, locale?, excludeId?)`: Ensure uniqueness

**url-pattern**:
- `resolvePattern(uid, entity, locale?)`: Convert pattern to path
- `validatePattern(uid, pattern)`: Check pattern syntax
- `getAllowedFields(uid)`: List fields available in patterns
- `getFieldsFromPattern(pattern)`: Extract field references
- `getRelationsFromPattern(uid, pattern)`: Get relations to populate

#### 6. Frontend Router

The `/api/webtools/router` endpoint enables frontend routing:

```
GET /api/webtools/router?path=/blog/hello-world
```

Returns:
- The content entity
- Content type UID
- Applies full permission checks
- Optionally executes Strapi controllers (if `router_use_controllers: true`)

### Admin UI Structure

**Main Routes**:
- `/` - Overview page
- `/urls` - List/edit all URL aliases
- `/patterns` - Manage URL patterns

**Injection Zones**:
- Addons can add navigation items (webtoolsRouter)
- Addons can add sidebar components (webtoolsSidePanel)

**Content Manager Integration**:
- `WebtoolsPanel` appears in Content Manager's edit view for enabled types
- Shows current URL alias, edit form, and injected addon components

## Configuration

Plugin options in `config/plugins.js`:

```javascript
module.exports = {
  webtools: {
    config: {
      default_pattern: '/[pluralName]/[documentId]',
      unique_per_locale: true,
      router_use_controllers: false,
      slugify: (text) => text.toLowerCase().replace(/\s+/g, '-'),
      website_url: 'https://example.com',
    },
  },
};
```

## Common Patterns

### Adding a New Service Method

1. Add method to service interface in `server/services/[service-name].ts`
2. Export service in `server/services/index.ts`
3. Access via `getPluginService('[service-name]')` with full type safety

### Creating a New Middleware

1. Add file to `server/middlewares/`
2. Export from `server/middlewares/index.ts`
3. Register in `bootstrap()` using `strapi.documents.use(middleware)`

### Adding Admin UI Screens

1. Create screen component in `admin/screens/[ScreenName]/`
2. Add route to `containers/App/index.tsx`
3. Add permission check if needed
4. Add navigation link in sidebar configuration

### Creating an Addon

See `packages/addons/sitemap` as reference:

1. Create Strapi plugin with `strapi.webtoolsAddon: true` in package.json
2. Add `strapi-plugin-webtools` as peerDependency
3. In `admin/index.js` bootstrap, call injection APIs:
   ```typescript
   const webtoolsPlugin = app.getPlugin('webtools');
   webtoolsPlugin.injectComponent('webtoolsRouter', 'route', {
     path: '/sitemap',
     label: 'Sitemap',
     Component: SitemapPage,
   });
   ```
4. Optionally extend content types in server `bootstrap()`

## Release Process

This project uses Changesets for version management:

```bash
# After making changes, create a changeset
npx changeset

# Prepare release (bump versions, update CHANGELOGs)
yarn release:prepare

# Publish to npm
yarn release:publish
```

## Troubleshooting

### Playground not seeing plugin changes

1. Ensure `yarn develop` is running (builds plugin in watch mode)
2. Check that yalc linked correctly: `cd playground && yalc check`
3. Rebuild admin: `cd playground && yarn build`
4. Clear Strapi cache: `rm -rf playground/node_modules/.strapi/`

### TypeScript errors in IDE but builds succeed

Run `yarn tscheck` to see actual type errors. The playground has a separate tsconfig that may cause confusion.

### Tests fail with "Cannot find module"

Ensure `ENV_PATH=./playground/.env` is set when running tests. The tests need access to the playground's Strapi configuration.

## Documentation

- Main docs: https://docs.pluginpal.io/webtools
- Contributing guide: CONTRIBUTING.md
- Strapi plugin development: https://strapi.io/documentation/developer-docs/latest/plugin-development/
