import { Config, defineConfig } from '@strapi/pack-up';

const config: Config = defineConfig({
  bundles: [
    {
      source: './admin/index.js',
      import: './dist/admin/index.mjs',
      require: './dist/admin/index.js',
      runtime: 'web',
    },
    {
      source: './server/index.js',
      import: './dist/server/index.mjs',
      require: './dist/server/index.js',
      runtime: 'node',
    },
    {
      source: './server/cli.js',
      import: './dist/cli/index.mjs',
      require: './dist/cli/index.js',
      runtime: 'node',
    },
  ],
  dist: './dist',
  /**
   * Because we're exporting a server & client package
   * which have different runtimes we want to ignore
   * what they look like in the package.json
   */
  exports: {},
});

export default config;
